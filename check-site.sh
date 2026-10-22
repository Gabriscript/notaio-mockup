#!/usr/bin/env bash
# Static checks for the site pages. Usage: bash check-site.sh  (SITE_DIR=dir to check another folder)
set -u
cd "${SITE_DIR:-$(dirname "$0")}" || { echo "ERRORE cartella non trovata"; exit 1; }

errors=0
err() { echo "ERRORE $1"; errors=$((errors + 1)); }
LIMIT=1048576

shopt -s nullglob
pages=(*.html)
if [ ${#pages[@]} -eq 0 ]; then echo "nessuna pagina"; exit 0; fi

# Strip a URL's ?query and #fragment.
clean() { local u=${1%%#*}; echo "${u%%\?*}"; }
is_local() { case "$1" in ''|http:*|https:*|//*|mailto:*|tel:*|data:*|javascript:*|\#*) return 1;; esac; return 0; }

# Print "line<TAB>value" for every href/src and each srcset item.
refs() {
  grep -noE '(href|src)="[^"]*"' "$1" | sed -E 's/^([0-9]+):(href|src)="(.*)"$/\1\t\3/'
  grep -noE 'srcset="[^"]*"' "$1" | sed -E 's/^([0-9]+):srcset="(.*)"$/\1\t\2/' |
    awk -F'\t' '{ n = split($2, a, ","); for (i = 1; i <= n; i++) { split(a[i], b, " "); w = b[1]; if (w == "") w = b[2]; print $1 "\t" w } }'
}

# Visible text: remove comments, <script> and <style> content (multi-line aware), keep line numbers.
visible() {
  awk '{
    out = ""; s = $0
    while (length(s) > 0) {
      if (mode == "") {
        i = match(s, /<!--|<script|<style/)
        if (i == 0) { out = out s; s = "" }
        else {
          out = out substr(s, 1, RSTART - 1); t = substr(s, RSTART, RLENGTH); s = substr(s, RSTART + RLENGTH)
          mode = (t == "<!--") ? "-->" : (t == "<script") ? "</script" : "</style"
        }
      } else {
        i = index(s, mode)
        if (i == 0) s = ""
        else { s = substr(s, i + length(mode)); mode = "" }
      }
    }
    print NR "\t" out
  }' "$1"
}

declare -A KB
for f in "${pages[@]}"; do
  grep -q '<html[^>]*lang="it"' "$f" || err "$f:1 manca <html lang=\"it\">"
  grep -qE '<title>[^<[:space:]][^<]*</title>' "$f" || err "$f:1 <title> mancante o vuoto"
  grep -q '<meta name="description"' "$f" || err "$f:1 manca <meta name=\"description\">"
  h1=$(grep -o '<h1[ >]' "$f" | wc -l)
  [ "$h1" -eq 1 ] || err "$f:1 trovati $h1 <h1> (serve esattamente 1)"

  while IFS=: read -r ln _; do err "$f:$ln href=\"#\""; done < <(grep -n 'href="#"' "$f")

  # Links and anchors.
  while IFS=$'\t' read -r ln url; do
    if [ "${url:0:1}" = "#" ] && [ ${#url} -gt 1 ]; then
      grep -q "id=\"${url:1}\"" "$f" || err "$f:$ln ancora inesistente $url"
      continue
    fi
    is_local "$url" || continue
    p=$(clean "$url")
    if [ ! -f "$p" ]; then err "$f:$ln link rotto $url"; continue; fi
    case "$url" in *.html\#*) id=${url#*#}; [ -n "$id" ] && ! grep -q "id=\"$id\"" "$p" && err "$f:$ln ancora inesistente $url";; esac
  done < <(refs "$f")

  # Images.
  while IFS=: read -r ln tag; do
    for a in alt width height; do
      echo "$tag" | grep -qE "[[:space:]]$a=" || err "$f:$ln <img> senza $a="
    done
  done < <(awk '{ s = $0
      if (open) { i = index(s, ">"); if (i) { print start ":" tag " " substr(s, 1, i); open = 0; s = substr(s, i + 1) } else { tag = tag " " s; next } }
      while ((i = index(s, "<img")) > 0) {
        s = substr(s, i); j = index(s, ">")
        if (j) { print NR ":" substr(s, 1, j); s = substr(s, j + 1) } else { open = 1; start = NR; tag = s; next }
      } }' "$f")

  # Long dashes in visible text.
  while IFS=$'\t' read -r ln txt; do
    case "$txt" in *—*|*–*) err "$f:$ln trattino lungo nel testo";; esac
  done < <(visible "$f")

  # External font/script/css hosts.
  while IFS=: read -r ln _; do err "$f:$ln risorsa esterna (font/script/css)"; done < <(
    grep -nE 'fonts\.googleapis|fonts\.gstatic|//cdn\.|unpkg|jsdelivr|cdnjs|<script[^>]*src="(https?:)?//|<link[^>]*(stylesheet|preload)[^>]*href="(https?:)?//|<link[^>]*href="(https?:)?//[^"]*"[^>]*(stylesheet|preload)' "$f")

  # Placeholders.
  while IFS=: read -r ln _; do echo "INFO $f:$ln segnaposto QUI]"; done < <(grep -n 'QUI]' "$f")

  # Weight: page + local refs (+ url() inside linked CSS).
  files=$( { echo "$f"
    refs "$f" | cut -f2 | while read -r u; do is_local "$u" && echo "$(clean "$u")"; done
  } | sort -u)
  css=$(echo "$files" | grep '\.css$')
  for c in $css; do
    [ -f "$c" ] || continue
    d=$(dirname "$c")
    extra=$(grep -oE 'url\([^)]*\)' "$c" | sed -E "s/url\(['\"]?([^'\")]*)['\"]?\)/\1/" | while read -r u; do
      is_local "$u" && echo "$d/$(clean "$u")"; done)
    files=$(printf '%s\n%s\n' "$files" "$extra")
  done
  bytes=0
  while read -r x; do
    [ -n "$x" ] && [ -f "$x" ] || continue
    case "$x" in *.html) [ "$x" = "$f" ] || continue;; esac
    bytes=$((bytes + $(wc -c < "$x")))
  done < <(echo "$files" | sed 's#/\./#/#g; s#^\./##' | sort -u)
  KB[$f]=$bytes
  [ "$bytes" -lt "$LIMIT" ] || err "$f:1 peso $((bytes / 1024)) KB oltre 1024 KB"
done

echo
printf '%-30s %8s\n' "pagina" "KB"
for f in "${pages[@]}"; do printf '%-30s %8d\n' "$f" $(( (KB[$f] + 1023) / 1024 )); done
echo
echo "Pagine: ${#pages[@]}  Errori: $errors"
[ "$errors" -eq 0 ]
