# CLAUDE.md (notaio)

Mock-up statico del sito Studio Notarile Napolitano & Caricato (rifacimento di notaionapolitano.it). HTML/CSS/JS vanilla, nessun build, nessuna dipendenza. Lingua dei testi del sito: italiano. Codice, commenti e commit: inglese. Risposte all'utente: italiano.

Leggi prima: `docs/SPEC.md` (design e pagine), `docs/CONTENT.md` (unica fonte dei contenuti), `docs/PLAN.md` (task), `filemap.md` (dove sta cosa).

## Comandi
- Anteprima: dalla radice del progetto `npx --yes http-server . -p 5300 -c-1` (voce `notaio-static` in `MHW/.claude/launch.json`, porta 5300).
- Controllo: `bash check-site.sh` (deve uscire 0 prima di dire "fatto").
- Nessun lint, nessun test automatico oltre a check-site.sh.

## Regole che non si derivano dal codice
- Contenuti: SOLO quelli di `docs/CONTENT.md`. Dato mancante = segnaposto `[... QUI]`. Mai inventare prezzi, importi, orari, nomi, biografie, recensioni, testi legali, URL.
- Foto: SOLO le 3 del sito attuale (+ logo) in `_originali/`. Mai altre immagini, né stock né generate. Gli originali non si pubblicano: si usano i WebP in `assets/img/`.
- Il logo non si ridisegna né si ricolora. Colore accento = rosso del logo.
- Nessun servizio di terzi (font CDN, mappe incorporate, analytics, cookie). Font auto-ospitati in `assets/fonts/`.
- Moduli simulati: non inviano nulla, lo dicono in chiaro.
- Testo visibile: niente trattini lunghi (— –), frasi in sentence case, una sola etichetta per intento ("Richiedi un preventivo" ovunque).
- Niente `href="#"`. Link tra pagine con file relativi (`i-notai.html`). Link esterni: `target="_blank" rel="noopener"`.
- Header, nav, footer e barra mobile: copiare da `docs/shell.html`, non reinventare.
- Mobile-first da 360px. Un solo tema chiaro. Animazioni solo `transform`/`opacity`, rispettando `prefers-reduced-motion`.
- Il file system ha un hook che salva copie in `backup/`: ignorare, è in `.gitignore`, non va in produzione.
- Non cambiare i file di altri task (vedi `docs/PLAN.md`). Se aggiungi o sposti file, aggiorna `filemap.md`.
