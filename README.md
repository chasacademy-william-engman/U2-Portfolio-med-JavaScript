# U2-Portfolio-med-JavaScript

**Publicerad sida:** https://chasacademy-william-engman.github.io/U2-Portfolio-med-JavaScript/

## Reflektion

### Datans väg

Fetchen skickar en HTTP GET-request till GitHub API-URL:en från en async-funktion, så att sidan inte fryser medan den väntar. Svaret är ett `Response`-objekt med statuskod, headers och en body. Först kollar jag `response.ok` för att se att anropet lyckades. Bodyn är JSON-text, så `response.json()` gör om den till en JavaScript-array som jag loopar igenom och där använder jag t.ex. `name`, `description` och `languages_url`. Innan något syns sparas datan i `localStorage` med en tidsstämpel, eftersom GitHub bara tillåter 60 anrop i timmen utan inloggning och sedan svarar med 403 (Forbidden). Är den sparade datan yngre än en timme används den i stället för ett nytt anrop.

### Två datakällor

CV:t är en lokal fil som jag själv skrivit, så den har inga anropsgränser och jag vet exakt vilka fält som finns. Går något fel är det nästan alltid fel sökväg eller ett skrivfel i JSON. GitHub kan vara långsamt, nere eller stoppa mig, och skickar dessutom mycket data jag inte behöver. Därför har `github-api.js` mer skyddskod: `AbortSignal`, cache och fler felmeddelanden. Jag valde att inte slå ihop de två fetch-funktionerna, eftersom en gemensam funktion hade behövt extra parametrar för att stänga av cache och timeout för CV:t, vilket hade gjort koden svårare att läsa.

### DOM och händelser

Data från API:et sätts med `textContent`, som alltid behandlas som text och aldrig som HTML. `innerHTML` skulle kunna göra koden sårbar för XSS-attacker (Cross-Site Scripting). När datan har kommit skapar jag alla element och lägger in dem med en enda `append`. Filtret hämtar korten först när `change` sker, eftersom korten inte finns förrän GitHub har svarat. Jag lyssnar på `click` på temaknappen i `script.js`, eftersom knappen finns på alla sidor och skriptet laddas överallt. Då räcker det att skriva lyssnaren en gång.

### Markup du inte skrivit för hand

Det jag gjorde var att jag studerade koden som jag skrev i U1 och skrev in exakt samma element och klasser i JavaScript med `append`, vilket gav samma semantiska struktur. Sen så dubbelkollade jag när de hade renderats med WAVE-pluginet och validatorn som flaggade 0 errors. Figma kallade taggarna knappar, men eftersom de inte gör något när man klickar valde jag `<span>` och behöll utseendet med CSS.

### Temaväxlingen

För mörkt och ljust läge använde jag samma princip som U1 med färgerna i `:root` och ändrade dem i `.darkmode`. Jag lade däremot till klassen `darkmode` på `<html>` som sparades i `localStorage` så att jag kunde toggla. Däremot stötte jag på ett problem med att när jag bytte sida så blinkade sidan vit innan det ändrades då skripten väntade på att alla element hade renderats. Det löste jag genom att göra ett nytt skript, `theme.js`, som körs innan alla element och som säger om ett tema är sparat, eller om det inte är det så kollar det användarens `prefers-color-scheme`. Det som hade blivit svårare med JavaScript hade varit om jag velat ändra färger på specifika klasselement, vilket också skulle göra att mängden kod hade ökat. Det är lättare att bara ändra variabler som många element använder än att leta på flera ställen.

### När det inte går som tänkt

Om GitHub svarar långsamt visas en spinner så att besökaren ser att något laddar. Om GitHub svarar med en felkod, till exempel 403, blir `response.ok` false. Då kastar `getJson` ett fel som fångas i `catch` i `renderRepos`, och besökaren får ett meddelande om att projekten inte kunde laddas. Om GitHub inte svarar alls avbryter `AbortSignal` anropet efter 8 sekunder och koden hamnar i samma `catch`. Är listan tom visas "No projects yet" i stället för ett fel. Misslyckas bara språkanropet för ett repo fångar `getTechStack` felet och kortet visar "Unknown", så resten av korten visas ändå. I CV:t visar varje sektion "No entries yet." om just den är tom, och om filen inte kan laddas ser besökaren ett begripligt meddelande medan det tekniska felet loggas i konsolen.

### Styrkor och brister

Det som blev bra var felhanteringen. Alla tre lägena syns för besökaren, och ett enskilt fel stoppar inte hela listan. `createCareerItem` och `renderSection` används för både `education` och `workExperience`, eftersom jag gav dem samma nycklar i JSON.

Med mer tid skulle jag använda gammal cache som reserv när GitHub är nere. I `getJson` skulle jag då returnera den sparade datan om fetch misslyckas, även om den är äldre än en timme, så att besökaren ser projekten i stället för ett fel. Jag skulle också hämta språken parallellt, eftersom anropen nu görs ett i taget i `for...of`-loopen och spinnern kan synas länge på en långsam anslutning. Det skulle kunna gå att lösa med `Promise.all`, som vi inte gått igenom än. Till sist skulle jag bygga navigationen med JavaScript, eftersom samma header nu är kopierad i alla fem HTML-filer.

### Tillgänglighetstest

- **Tangentbord:** Jag tabbade igenom alla sidor i mobil- och desktopläge. Fokus följer sidan i logisk ordning och fokusmarkeringen syns i båda temana.
- **Kontrast:** Jag kontrollerade kontrasten i båda temana med WAVE som gav 0 kontrastfel. Gradienttext kan WAVE inte mäta, så den kontrollerade jag med WebAIM Contrast Checker. Det rosa gav 4.22:1 i mörkt läge, vilket räcker för stora rubriker men inte för footern och kontaktlänkarna på mobil, så jag ändrade det till `#f033b8`.
- **Felfall:** Jag testade offline-läge och felaktig URL i DevTools och kontrollerade att besökaren ser ett meddelande i stället för en tom yta.

### AI-verktyg

Jag använde AI för att skapa JSON-listan och bygga `createElement`-strukturen, som var repetitivt arbete jag förstår men som tar tid. Jag ändrade den genom att bryta ut `createProjectCards` från render-funktionen så att den blev lättare att läsa.

Jag har inte tagit förslagen rakt av. När `AbortSignal` föreslogs frågade jag om inte `async` redan räckte, men `async` hindrar bara sidan från att frysa och bestämmer inte hur länge den väntar. För spinnern föreslogs `.visually-hidden`, men jag valde `role` och `aria-label` för att slippa extra CSS. Jag använde också AI för att granska koden mot kriterierna. Den hittade att ett misslyckat språkanrop tömde hela projektsidan, vilket jag åtgärdade. Lösningen med `Promise.all` valde jag bort eftersom vi inte gått igenom det, och använde `try/catch` i `getTechStack` i stället.
