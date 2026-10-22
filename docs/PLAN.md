# PLAN: mock-up sito Napolitano & Caricato

Ogni worker legge: `CLAUDE.md`, `docs/SPEC.md` (sezioni indicate), `docs/CONTENT.md`, `filemap.md`. Aggiorna `filemap.md` per i file che crea. Non tocca file di altri task. Non committa (commit li fa l'orchestratore).

## T1 Asset (Medium)
Dipende da: nulla.
Crea `assets/img/*.webp`, `assets/logo/logo-napolitano-caricato.png`, `assets/fonts/*.woff2` come da SPEC "Immagini" e "Tipografia". Strumenti: Node 24 è installato; NON installare dipendenze dentro `notaio/` (usa una cartella temporanea fuori dal progetto, es. quella di scratchpad, per `sharp` o simile). Non modificare `_originali/`.
Fatto quando: (1) esistono cortile-1600.webp, cortile-900.webp, sala-riunioni.webp, repertori.webp, il logo PNG e i woff2 di Literata e Hanken Grotesk; (2) dimensioni in pixel esatte come da SPEC, peso totale di `assets/` sotto 650 KB; (3) scrivi `assets/README.md` con licenza dei font (OFL), fonte (nome pacchetto e versione) e comando usato per le immagini; (4) verifica che i font contengano i glifi à è é ì ò ù « » € (elenca come hai verificato); (5) `_originali/` intatta.
Report: tabella file / dimensioni px / KB, esito verifica glifi.

## T2 Fondamenta e home (Careful)
Dipende da: T1.
Scrive `css/style.css`, `js/site.js`, `index.html` e `docs/shell.html` (frammento canonico con header, nav, barra mobile, footer, fascia "Preventivo" e commenti che dicono cosa cambiare per pagina). Implementa SPEC per intero: Direzione, token, tipografia (@font-face con i woff2 di T1), componenti condivisi, Home sezioni 1-8, motion firma, SEO/JSON-LD di index.html.
Vincoli: nessuna libreria; leggibile senza JS (classe `js` aggiunta da uno script inline minimo nell'head); senza `href="#"`; tutti i link a pagine interne puntano ai file indicati in SPEC "Stack e struttura" anche se non esistono ancora; testi dei notai, sedi, link: solo CONTENT.md. Lascia in `style.css` NESSUN codice per le pagine interne oltre ai componenti condivisi.
Verifica: avvia l'anteprima (vedi CLAUDE.md), controlla a 375px e 1280px che non ci sia scroll orizzontale, che nav (desktop e mobile), tendine, tastiera (Tab, Esc) e barra mobile funzionino; console senza errori; peso della home sotto 1 MB; contrasto delle coppie token AA (calcolalo).
Report: cosa hai fatto, cosa hai verificato e come, deviazioni dallo SPEC con motivo.

## T3 Pagine informative (Medium)
Dipende da: T2 accettato.
Crea `i-notai.html`, `orari-ufficio.html`, `contatti.html`, `documenti.html` e `css/info.css` secondo SPEC "Pagine interne". Copia header/footer/barra/fascia da `docs/shell.html` identici (cambia solo `aria-current`, title, meta description, breadcrumb). Riusa i componenti di `style.css`; se ti serve un nuovo stile va in `css/info.css`, non modificare `style.css`. Non toccare `js/`.
Verifica: a 375px e 1280px nessuno scroll orizzontale; nessun link morto (le pagine di T4 possono non esistere ancora); tutti i dati confrontati con CONTENT.md riga per riga (tel, indirizzi, mail, orari, 10 URL PDF).
Report: come T2.

## T4 Pagine con moduli (Medium)
Dipende da: T2 accettato. Parallelo a T3.
Crea `attivita-studio.html`, `richiesta-copia-atti.html`, `richiesta-preventivo.html`, `css/forms.css`, `js/forms.js` secondo SPEC "Pagine interne" e "Moduli simulati". Stessi vincoli di T3 su shell e `style.css`. Non toccare `js/site.js`. Accessibilità dei moduli: label sopra ogni campo, errori associati con `aria-describedby`, focus gestito, navigazione da tastiera completa, funziona la procedura guidata anche con la sola tastiera. Senza JS i moduli restano visibili e compilabili (non inviano nulla: `action` assente, aggiungi nota `<noscript>` che spiega che è un'anteprima).
Verifica: prova nel browser invio valido e non valido di ogni modulo, il flusso guidato avanti/indietro, le ancore dell'indice di attività-studio (scroll-margin con header sticky), 375px e 1280px.
Report: come T2.

## T5 Controllo sito (Light)
Dipende da: nulla (si può lanciare a pagine incomplete).
Scrive `check-site.sh` (bash, fine riga LF, nessuna dipendenza oltre a grep/sed/awk/find/node se serve) che da `notaio/` controlla: ogni `*.html` in radice ha `lang="it"`, `<title>`, meta description, un solo `<h1>`; nessun `href="#"`; i link relativi (href/src) puntano a file esistenti (le ancore `pagina.html#id` verificano anche che l'id esista); ogni `<img>` ha `alt`, `width` e `height`; nessun trattino lungo (— o –) nel testo visibile; nessun URL a domini esterni di font/script (solo notaionapolitano.it, notariato.it, google.com/maps come href); elenca i segnaposto `QUI]`; peso per pagina (HTML + CSS + JS + immagini e font referenziati) sotto 1 MB. Esce 0 se tutto ok, 1 altrimenti, stampando una riga per problema.
Fatto quando: lanciato su `notaio/` (anche con 0 pagine) non si blocca, e lo provi su una pagina HTML di prova con difetti noti creata e poi cancellata (fuori da `notaio/` oppure rimossa).
Report: come lanciarlo, elenco controlli, esito dei test.

## Chiusura (orchestratore)
Revisione del diff e delle pagine nel browser (375px e 1280px), `check-site.sh`, `README.md` con fonti, segnaposto e cose da chiedere al cliente, voce in `MHW/.claude/launch.json`, commit.
