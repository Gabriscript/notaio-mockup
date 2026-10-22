# Studio Notarile Napolitano & Caricato, mock-up sito

Anteprima grafica del rifacimento di https://www.notaionapolitano.it/ (stessi contenuti, stessa navigazione, grafica nuova). Statico: HTML, CSS e JS senza dipendenze.

Anteprima locale, dalla cartella `notaio`:

```bash
npx --yes http-server . -p 5300 -c-1
```

Poi aprire http://localhost:5300/. Controllo automatico: `bash check-site.sh`.

## Direzione

Editoriale sobrio da registro notarile. Titoli in Literata, testo in Hanken Grotesk (entrambi OFL, auto-ospitati in `assets/fonts/`). Colori: carta calda, inchiostro, rosso del logo come unico accento. Le uniche foto sono le 3 del sito attuale; il logo è quello attuale, non ritoccato. Dettagli di design in `docs/SPEC.md`.

## Pagine

index, i-notai, orari-ufficio, attivita-studio (le 7 attività in una pagina con sezioni ancorate), richiesta-copia-atti, richiesta-preventivo, documenti, contatti. Le voci del menu sono quelle del sito attuale.

## Cosa è simulato (non funziona davvero)

- I moduli di copia atti e preventivo non inviano nulla: mostrano una conferma di anteprima.
- La procedura guidata di preventivo è una proposta grafica a 3 passi: va collegata al sistema attuale dello studio.
- Le "News giuridiche" sono 3 titoli copiati dal feed attuale, senza link.

## Fonti dei contenuti (lette il 22/10/2026)

Tutto da notaionapolitano.it (testi, sedi, orari, notai, elenco documenti, notizie dal Notariato). Elenco completo in `docs/CONTENT.md`. I PDF dei documenti NON sono copiati: i link puntano ai PDF del sito attuale. Privacy, Cookie Policy e Sitemap linkano ai testi esistenti: nel mock-up non ci sono testi legali nostri.
Il mock-up non usa cookie né servizi di terzi (niente mappe incorporate, analytics, font da CDN), quindi non ha banner cookie.

## Da chiedere al cliente

- Telefono e fax di Romano di Lombardia sono identici a quelli di Melegnano sul sito attuale: confermare.
- Come raggiungere la sede di Romano di Lombardia: nel sito attuale non c'è. Nel mock-up resta il segnaposto `[COME RAGGIUNGERE ROMANO DI LOMBARDIA QUI]`.
- Logo in formato vettoriale (SVG o PDF): il PNG attuale è 339x112 con sfondo bianco, a schermi ad alta densità è morbido.
- Foto: servono altre foto? Il cliente ha detto di no. Le foto sono piccole (sala riunioni 1026x450, volumi 580x300): non reggono un uso a tutta larghezza. Confermare che ritraggono lo studio e le didascalie (alt) scritte da noi.
- Testi del sito (titoli, sottotitoli, introduzioni, "Di cosa ci occupiamo", "Tre notai, tre sedi", ecc.) scritti da noi: da approvare. Le descrizioni di una riga delle attività sono sintesi dei testi esistenti.
- Refusi nel sito attuale, corretti nel mock-up: "cessione perequative" diventa "cessioni perequative", "accettazione di eredità con pura e semplice" diventa "accettazione di eredità pura e semplice".
- Orari: il sito attuale indica solo lunedì-venerdì. Sabato e domenica non sono menzionati.
- Le mail dei tre notai sono su notariato.it e sono le stesse per tutte e tre le sedi.
- Una pagina per ogni attività (come oggi) o una sola pagina con sezioni, come qui? Per la SEO, 7 pagine distinte danno più superfici.
- Struttura di produzione: il mock-up ha `robots noindex`; da togliere in produzione, con titoli e meta rivisti.

## Note tecniche

- `backup/`: un hook dell'ambiente copia lì i file modificati. È in `.gitignore`: da non pubblicare.
- `_originali/`: foto e logo scaricati dal sito attuale (una foto pesa 1.9 MB). Non pubblicare: si usano i WebP in `assets/img/`.
- Non verificato: Safari/iOS e screen reader reali; Lighthouse; test su telefoni fisici.
