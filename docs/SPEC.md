# SPEC: mock-up sito Studio Notarile Napolitano & Caricato

Mock-up statico (HTML/CSS/JS vanilla) per proporre il rifacimento di https://www.notaionapolitano.it/.
Contenuti e dati: SOLO `docs/CONTENT.md`. Foto: SOLO le 3 del sito attuale. Se manca qualcosa: segnaposto `[... QUI]`, mai inventare.

## Obiettivi
- Mostrare al cliente un sito più chiaro e curato, stesso contenuto e stessa struttura di navigazione del sito attuale.
- Un obiettivo di conversione: **Richiedi un preventivo**. Secondari: chiamare lo studio, richiedere copia atti.
- Funziona da 360px, mobile-first, leggibile senza JS, sotto 1 MB a pagina, accessibilità AA.

## Non-obiettivi
- Nessun backend: i moduli sono simulati (nessun dato inviato), nessuna procedura di preventivo reale.
- Nessun testo legale proprio, nessun prezzo, nessuna foto nuova, nessuna foto dei notai, nessuna biografia inventata.
- Nessun servizio di terzi: niente mappe incorporate, analytics, font da CDN, banner cookie. Mappa = solo link.
- Niente CMS, niente framework, niente build.

## Stack e struttura
HTML/CSS/JS vanilla, nessuna dipendenza. CSS: `css/style.css` (token, base, componenti condivisi, home) + un file per gruppo di pagine interne: `css/info.css` (i-notai, orari-ufficio, contatti, documenti) e `css/forms.css` (attivita-studio, richiesta-copia-atti, richiesta-preventivo). JS: `js/site.js` (menu, hero) + `js/forms.js` (moduli simulati, solo pagine con moduli). Ogni pagina carica `style.css` più, se serve, il suo file di gruppo. Header, footer e barra mobile sono duplicati in ogni pagina (nessun build): la versione canonica è `docs/shell.html`, ogni pagina la copia identica cambiando solo `aria-current` e il titolo.
Pagine (file piatti nella radice di `notaio/`):
| File | Voce di menu attuale | Contenuto |
|---|---|---|
| index.html | Home | vedi "Home" |
| i-notai.html | Lo studio > I Notai | 3 notai, foto sala riunioni |
| orari-ufficio.html | Lo studio > Orari Ufficio | orari per sede |
| richiesta-copia-atti.html | Servizi > Richiesta Copia atti | testo + modulo simulato |
| richiesta-preventivo.html | Servizi > Richiesta Preventivo | due strade: testo libero / guidata, simulate |
| attivita-studio.html | Attività studio > 7 voci | UNA pagina con 7 sezioni ancorate (#consulenza #immobiliare #famiglia #successioni #volontaria-giurisdizione #societa #varie). Le voci del menu puntano alle ancore. Nel sito reale si possono dividere in pagine. |
| documenti.html | Documenti | intro + 10 link PDF esterni |
| contatti.html | Contatti | 3 sedi, mail, come raggiungerci |
Le etichette del menu restano quelle del sito attuale (vedi CONTENT.md).

## Direzione
`Direzione: editoriale sobrio da registro notarile, Literata (titoli) + Hanken Grotesk (testo e interfaccia), carta calda / inchiostro / rosso del logo`

Lettura: sito di uno studio professionale (register: brand sobrio). Utenti: privati che comprano casa, ereditano, costituiscono una società, e imprenditori; arrivano per sapere dove, quando, quali documenti, come avere un preventivo. Scena: persona alla scrivania o al telefono di giorno, con un atto da preparare, vuole certezza e risposte veloci. Parole di voce: solido, chiaro, riservato.
Riferimento fisico: il frontespizio e il dorso dei repertori notarili (le foto stesse: volumi bordeaux con titolo in oro). La serif viene dall'atto stampato; il rosso viene dal logo dello studio.
Strategia colore: Restrained (neutri tinti + un accento ≤10%). Il dramma lo portano le foto, non la grafica.
Evitare: oro/blu navy da cliché notarile, gradienti, ombre, icone decorative, angoli arrotondati grandi, nuova identità inventata (il logo non si tocca).

### Token (in :root, OKLCH)
```
--paper:    oklch(0.975 0.004 45);   /* sfondo pagina */
--paper-2:  oklch(0.945 0.007 40);   /* fasce alternate, campi */
--ink:      oklch(0.23 0.018 25);    /* testo */
--ink-2:    oklch(0.42 0.02 25);     /* testo secondario (>= 7:1 su paper) */
--rule:     oklch(0.82 0.01 35);     /* filetti 1px */
--accent:   oklch(0.47 0.20 27);     /* rosso del logo (#B4000A circa), SOLO azione primaria, filetto logo, focus, link in hover */
--on-accent: oklch(0.985 0.004 45);  /* testo su accento */
```
Mai #000 né #fff. Un solo tema chiaro per tutto il sito (nessuna sezione scura). Verificare contrasto AA di ogni coppia usata.
Il PNG del logo ha sfondo bianco opaco: usare `mix-blend-mode: multiply` per fonderlo su `--paper`.

### Tipografia
- Titoli: **Literata** variabile (peso 500), auto-ospitata. Testo, UI, etichette: **Hanken Grotesk** variabile (pesi 400 e 600). Totale 3 pesi. Entrambe OFL. Niente italic nei titoli.
- Sorgente dei woff2: pacchetti npm `@fontsource-variable/literata` e `@fontsource-variable/hanken-grotesk` (file `latin-wght-normal.woff2`, scaricabili da `https://cdn.jsdelivr.net/npm/<pacchetto>/files/`). Subset latino, deve coprire à è é ì ò ù « » e il segno €. Se Literata variabile pesa >120 KB, usare l'istanza statica 500 o la variante senza asse opsz. `font-display: swap`, preload solo del font dei titoli. Fallback: `Georgia, serif` e `system-ui, sans-serif`.
- Corpo 1.0625rem/1.55 (17px). Scala rapporto 1.25: 0.9375 (meta) · 1.0625 · 1.3125 · 1.6875 · 2.125 · 2.625.
- H1 `clamp(2.5rem, 1.4rem + 5vw, 4.5rem)`, line-height 1.05, `text-wrap: balance`. H2 `clamp(1.75rem, 1.2rem + 2.2vw, 2.625rem)`, line-height 1.12. H3 1.3125rem. Paragrafi max 65ch.
- Etichette maiuscole tracciate: vietate come grammatica di sezione. Niente mono.

### Forme, spazio, griglia
- Raggio unico: **2px** ovunque (bottoni, campi, immagini). Nessuna ombra. Filetti 1px `--rule`.
- Scala spazi multipli di 8px: 8 16 24 32 48 72 112. Sezioni `padding-block: clamp(3rem, 8vw, 7rem)`.
- Contenitore max 1200px, gutter laterale 24px (16px sotto 400px). Desktop griglia 12 colonne, gap 32px.
- Pulsante primario: sfondo `--accent`, testo `--on-accent`, altezza min 48px, padding 0 28px, Hanken 600. Secondario: testo `--ink`, sottolineato 1px, hover sottolineatura `--accent`. Un solo primario per schermata.
- Focus visibile: outline 3px `--accent`, offset 3px, su tutto. Link "Vai al contenuto" in cima. Target tocco >= 44px.
- Nessun fade-up su sezioni. Transizioni solo `transform`/`opacity`, 150-400ms, una sola curva `cubic-bezier(0.16, 1, 0.3, 1)`. `prefers-reduced-motion` rispettato. I cambi di colore in hover sono istantanei.
- Momento firma (solo home hero): la foto del cortile entra con `opacity 0→1` e `scale(1.04→1)` in 1200ms; il filetto rosso sotto il titolo si disegna con `scaleX 0→1` in 400ms. Statico con reduced-motion e senza JS.

### Componenti condivisi (identici in ogni pagina)
**Header** (sticky, sfondo `--paper`, filetto inferiore): logo a sinistra (link a index.html; larghezza 220px desktop, 168px mobile; height auto; width/height attribute dal PNG 339x112), navigazione a destra. Niente pulsante CTA in header.
Nav desktop (>=900px): Home · Lo studio ▾ · Servizi ▾ · Attività studio ▾ · Documenti · Contatti. I gruppi sono `<details class="nav-group"><summary>` con `<ul>` a tendina assoluta sotto (sfondo `--paper`, filetto, nessuna ombra); si chiudono con Esc e click fuori (JS); funzionano anche senza JS (details nativo). Il chevron è un piccolo SVG inline (una famiglia di icone, tratto 1.5px), non un carattere. Voce corrente: `aria-current="page"` con filetto `--accent` 2px sotto.
Nav mobile (<900px): logo + pulsante testuale "Menu" (44px, `aria-expanded`, `aria-controls`). Il pannello occupa lo schermo sotto l'header (position fixed, `min-height: 100dvh` meno header, scroll interno), con i gruppi come `<details>` aperti dall'utente, voci grandi (min 48px). Senza JS il pulsante è nascosto (`html:not(.js)`) e la nav resta visibile impilata.
**Barra mobile fissa** (<900px, in basso): due azioni, "Chiama Milano" (`tel:+390276002588`, secondaria con filetto) e "Richiedi un preventivo" (primaria). Altezza 64px + `env(safe-area-inset-bottom)`, sfondo `--paper`, filetto superiore. `body` ha padding-bottom per non coprire il contenuto. Nascosta su richiesta-preventivo.html (`<body class="no-bar">`).
**Footer**: sfondo `--paper-2`. Colonne: logo (PNG, multiply) + "Studio Notarile Napolitano & Caricato" + P.IVA 08707430966; le 3 sedi (indirizzo, tel, link tel) con orari in una riga; link Sitemap / Privacy / Cookie Policy ai testi esistenti (URL in CONTENT.md, `target="_blank" rel="noopener"`); riga finale "© 2026 Studio Notarile Napolitano Caricato" e "Anteprima grafica realizzata da MadHat Works. Contenuti dal sito attuale." Mobile: colonne impilate.
**Intestazione pagina interna**: breadcrumb testuale ("Home / Lo studio / I Notai", link, separatore `/` come testo), H1, una frase di introduzione (sotto 25 parole). Niente banner immagine, salvo dove indicato.
**Fascia finale "Preventivo"** (tutte le pagine tranne richiesta-preventivo): su `--paper-2`, titolo H2 "Hai bisogno di un atto?" a sinistra, a destra il pulsante primario "Richiedi un preventivo". Su index.html NON c'è (la home ha già il CTA nel hero e nella barra).

### Immagini
Esportare da `_originali/` in `assets/img/` come WebP, qualità 78-82, con `width`/`height` sempre dichiarati, `decoding="async"`, `loading="lazy"` sotto la piega, hero con `fetchpriority="high"`. NON esportare e NON pubblicare l'originale da 1.9 MB. Non ingrandire oltre le dimensioni native (le foto 2 e 3 sono piccole: si mostrano al massimo a larghezza nativa).
| File | Origine | Dimensioni | Alt (italiano, descrittivo) |
|---|---|---|---|
| assets/img/cortile-1600.webp, cortile-900.webp | IMG_0417_2.JPG | 1600x1360, 900x765 | Cortile interno con facciate color terracotta visto da una finestra con telaio in ferro |
| assets/img/sala-riunioni.webp | foto_home_napolitanoUP1.jpg | 1026x450 | Sala riunioni con grande tavolo in legno, sedie in pelle e due ritratti fotografici alla parete |
| assets/img/repertori.webp | 13.jpg | 580x300 | Dorsi di volumi rilegati in pelle bordeaux con titoli in oro |
| assets/logo/logo-napolitano-caricato.png | logo_napolitano.png | 339x112 | Studio Notarile Napolitano & Caricato (alt del logo = nome) |
Le didascalie/alt delle foto vanno confermate dal cliente (README).

## Home (index.html), dall'alto
1. **Hero** (asimmetrico). Desktop: testo a sinistra (5 colonne, allineato in basso/centro), foto del cortile a destra (7 colonne, `aspect-ratio: 6/5`, `object-fit: cover`, altezza massima `calc(100dvh - 88px)`). H1: "Atti notarili a Milano, Melegnano e Romano di Lombardia". Sottotitolo (max 20 parole): "Immobiliare, famiglia, successioni, società: i nostri tre notai ti seguono dalla consulenza all'atto." CTA primario "Richiedi un preventivo" → richiesta-preventivo.html; link secondario "Orari e sedi" → #sedi. Sotto il titolo un filetto `--accent` di 64x2px (momento firma). Mobile: titolo, sottotitolo, CTA, poi foto a larghezza piena con `aspect-ratio: 4/3`.
2. **Attività studio** (id `attivita`): titolo H2 "Di cosa ci occupiamo". Elenco a due colonne di 7 voci (una riga per voce, filetto tra le righe): nome in Literata 1.3125rem + descrizione di una riga + link "Vedi i dettagli" a `attivita-studio.html#<ancora>`. Descrizioni di una riga, ricavate SOLO da CONTENT.md: Consulenza "Il primo incontro, per esporre il tuo caso"; Immobiliare "Vendite, mutui, donazioni, preliminari"; Famiglia "Fondo patrimoniale, patti di famiglia, passaggio generazionale"; Successioni "Testamenti, dichiarazioni, accettazione e rinunzia"; Volontaria giurisdizione "Ricorsi per minori e incapaci, autorizzazioni giudiziali"; Società "Costituzioni, modifiche di statuto, cessioni, fusioni"; Varie "Procure, quietanze, verbali di constatazione". Mobile: una colonna.
3. **Lo studio** (id `notai`): a sinistra H2 "Tre notai, tre sedi" e l'elenco tipografico dei notai (nome in Literata 1.6875rem, sotto "Esercita la professione dal 1984" in Hanken ink-2; senza foto), link "Conosci i notai" → i-notai.html. A destra la foto sala-riunioni a larghezza nativa massima (1026px), `aspect-ratio` nativo. Mobile: foto sopra, elenco sotto.
4. **Copia atti** (fascia su `--paper-2`): foto repertori a sinistra (max 580px, nativa), a destra H2 "Ti serve la copia di un atto?", frase tratta da CONTENT.md ("Chiunque, anche se non è parte o non è direttamente interessato all'atto, può richiedere al notaio il rilascio di una o più copie autentiche di un atto notarile pubblico, versando i relativi diritti."), CTA secondario "Richiedi una copia" → richiesta-copia-atti.html. Mobile: foto sopra.
5. **Documenti per la stipula** (id `documenti`): H2 "Documenti per la stipula", intro verbatim (CONTENT.md), poi i 10 link PDF in due colonne (filetto tra le righe, etichetta del tipo di atto a sinistra, "PDF" a destra, apertura in nuova scheda), link "Vedi tutti" → documenti.html. Mobile: una colonna.
6. **Sedi e orari** (id `sedi`): H2 "Dove siamo". Tabella a 3 colonne (Milano, Melegnano, Romano di Lombardia): indirizzo, telefono (link tel), "Lun-Ven 9:00-13:00 e 14:30-18:30" (testo lungo "Dal lunedì al venerdì: 9:00-13:00, 14:30-18:30"), link "Apri la mappa" (esterno). Mobile: tre blocchi impilati con filetti. Sotto: link "Come raggiungerci" → contatti.html.
7. **Notizie**: due colonne "Dal Notariato: famiglia" e "Dal Notariato: impresa" con 3 voci ciascuna (data in ink-2, titolo come link esterno a notariato.it, `target="_blank" rel="noopener"`), link "Archivio" per colonna. Sotto, "News giuridiche": 3 righe di testo semplice con data e categoria, nota "Esempio dal feed del sito attuale". Mobile: una colonna.
8. Footer. (Nessuna fascia "Preventivo" in home.)

## Pagine interne
- **i-notai.html**: intestazione; foto sala-riunioni (nativa, max 1026px); elenco dei 3 notai (nome H2 Literata, "Esercita la professione dal ...", mail come link `mailto:` mostrata anche come testo). Nessuna biografia, nessuna foto. Fascia "Preventivo".
- **orari-ufficio.html**: intestazione; per ogni sede un blocco (nome, indirizzo, giorni, due fasce orarie in due righe); sotto una nota con i recapiti. Sabato/domenica non menzionati. Fascia "Preventivo".
- **attivita-studio.html**: intestazione; su desktop indice laterale sticky (7 ancore) a sinistra (3 colonne) e le 7 sezioni a destra (9 colonne), ognuna con H2, testo verbatim, elenco puntato degli atti (con i refusi corretti come da CONTENT.md, segnalati nel README); su mobile indice orizzontale scrollabile in alto (scroll-snap) poi sezioni. `scroll-margin-top` per l'header sticky. Fascia "Preventivo".
- **richiesta-copia-atti.html**: intestazione; testo verbatim; foto repertori; modulo simulato: Nome e cognome*, Email*, Telefono, Sede (select: Milano, Melegnano, Romano di Lombardia, Non so), Atto richiesto* (testo breve: tipo, data, repertorio se noti), Numero di copie, consenso privacy* (link al testo esistente). Fascia "Preventivo".
- **richiesta-preventivo.html**: intestazione; due scelte affiancate come radio con aspetto di pulsante ("Testo libero" / "Procedura guidata"); inline (niente modale): Testo libero = Nome*, Email*, Telefono, Sede, Descrizione della richiesta* (textarea), consenso*. Procedura guidata = 3 passi reali (1 Tipo di atto: radio tra Compravendita immobiliare, Mutuo, Donazione, Successione, Costituzione di società, Cessione di quote o azioni, Cessione di azienda, Separazione dei beni, Fondo patrimoniale, Procura, Altro; 2 Sede e note; 3 Contatti e consenso) con indicatore "Passo 1 di 3", pulsanti Indietro/Avanti, riepilogo finale prima dell'invio. Nota visibile in riquadro tratteggiato: `[PROCEDURA GUIDATA: da collegare al sistema attuale dello studio]`. Nessun importo calcolato.
- **documenti.html**: intestazione; intro verbatim; i 10 link PDF come elenco largo (stessa grafica della home, una colonna con righe alte 56px). Fascia "Preventivo".
- **contatti.html**: intestazione; titolo "Studio Notarile Associato Napolitano Caricato"; tre blocchi sede (indirizzo, tel con link, fax come testo, mail dei tre notai come link `mailto:`, link "Apri la mappa"); sezione "Come raggiungerci" con i dati di CONTENT.md (Romano: segnaposto `[COME RAGGIUNGERE ROMANO DI LOMBARDIA QUI]` in riquadro tratteggiato). Fascia "Preventivo".

## Moduli simulati (js/site.js)
Validazione nativa del browser (`required`, `type=email`) più messaggi in italiano sotto il campo (`aria-describedby`, `aria-live="polite"`); nessun `alert`. Su invio valido: `preventDefault()`, il modulo viene sostituito inline da una conferma "Richiesta ricevuta. Questa è un'anteprima: nessun dato è stato inviato." (stato `role="status"`, focus spostato sul messaggio) e un pulsante "Compila di nuovo". Etichetta sopra ogni campo, mai solo placeholder. Campi obbligatori marcati "(obbligatorio)" nel testo dell'etichetta, non solo con asterisco.

## SEO e metadati (ogni pagina)
`<html lang="it">`, `<title>` univoco ("Nome pagina | Studio Notarile Napolitano & Caricato"), meta description (<160 caratteri, solo fatti reali), Open Graph title/description/type (niente og:image), `meta name="theme-color"`, `<link rel="icon" href="data:,">`, `meta name="robots" content="noindex"` (è un mock-up). JSON-LD `Notary` solo in index.html con i dati reali di CONTENT.md (nome, 3 sedi con indirizzo e telefono, orari). Un solo H1 per pagina, gerarchia dei titoli senza salti.

## Definizione di fatto (MVP)
- 8 pagine navigabili senza link morti (`href="#"` vietato), nav e footer identici a `docs/shell.html`.
- `bash check-site.sh` esce 0 (vedi PLAN.md T5).
- Controllato a 375px e 1280px nel browser: nessun scroll orizzontale, nessuna sovrapposizione, barra mobile non copre contenuto.
- Peso per pagina <1 MB (HTML+CSS+JS+font+immagini caricate nella pagina).
- Nessun `QUI]` rimasto senza essere elencato nel README; nessun trattino lungo (— –) nel testo visibile; nessuna parola inventata fuori da CONTENT.md.
