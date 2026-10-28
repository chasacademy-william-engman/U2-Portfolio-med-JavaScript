# U2-Portfolio-med-JavaScript

**Publicerad sida:** https://chasacademy-william-engman.github.io/U2-Portfolio-med-JavaScript/

## Reflektion

### Datans väg

Fetchen skickar en HTTP GET-request till GitHub API-URL:en från en async-funktion, så att sidan inte fryser medan den väntar. Responsen är ett objekt med statuskod, headers och en body. Först kollar jag `response.ok` för att se att anropet lyckades. Statuskoden borde vara 200. Bodyn är JSON-text, så `response.json()` gör om den till en JavaScript-array som jag kan loopa igenom. Till exempel så använder jag `name`, `description` och `languages_url`. Men innan något syns på skärmen sparas API-datan i `localStorage` då upprepad fetch varje gång man laddar sidan kan blockera användaren med 403 (Forbidden). Utan inloggning tillåter GitHub 60 anrop i timmen.

### Två datakällor

CV:t ligger som en lokal fil i mitt projekt vilket gör att den inte har några anropsgränser och där felet nästan alltid beror på att man skrivit fel sökväg. Jag vet också till skillnad från GitHub vilka fält som finns och vad jag måste leta efter. GitHub kan vara långsam eller nere eller stoppa mig, vilket är därför jag har mycket mer kod i den filen som t.ex. `AbortSignal`, cache och fler felmeddelanden. I CV:t har jag bara skapat JSON utifrån fält jag faktiskt vet att jag behöver, men GitHub skickar mycket data som jag inte ens behöver vilket gör det svårare att leta efter specifika saker.

### DOM och händelser

Data från API:et sätts med `textContent`, som alltid behandlas som text och aldrig som HTML. `innerHTML` skulle kunna göra koden sårbar för XSS-attacker (Cross-Site Scripting). När datan har kommit skapar jag alla element och lägger in dem med en enda `append`. Filtret hämtar korten först när `change` sker, eftersom korten inte finns förrän GitHub har svarat. Jag lyssnar på `click` på temaknappen i `script.js`, eftersom knappen finns på alla sidor och skriptet laddas överallt. Då räcker det att skriva lyssnaren en gång.

### Markup du inte skrivit för hand

Det var lätt att göra lika semantiskt renderade element med JavaScript som hårdkodat då jag använt DOM:ens `createElement`. Det jag gjorde var att jag studerade koden som jag skrev i U1 och skrev in exakta element och klasser i JavaScript med `append` så all struktur blev densamma. Sen så dubbelkollade jag när de hade renderats med WAVE-pluginet som flaggade 0 errors. Figma kallade taggarna knappar, men eftersom de inte gör något när man klickar valde jag `<span>` och behöll utseendet med CSS.

### Temaväxlingen

För mörkt och ljust läge använde jag samma princip som U1 med färgerna i `:root` och ändrade dem i `.darkmode`. Jag lade däremot till klassen `darkmode` som jag la på `<html>` och som sparades i `localStorage` så att jag kunde toggla. Däremot stötte jag på ett problem med att när jag bytte sida så blinkade sidan vit innan det ändrades då skripten väntade på att alla element hade renderats. Det löste jag genom att göra ett nytt skript, `theme.js`, som körs innan alla element och som säger om ett tema är sparat, eller om det inte är det så kollar det användarens `prefers-color-scheme`. Det som hade blivit svårare med JavaScript hade varit om jag velat ändra färger på specifika klasselement, vilket också skulle göra att mängden kod hade ökat. Det är lättare att bara ändra variabler som många element använder än att leta på flera ställen.

### När det inte går som tänkt

Om GitHub svarar långsamt så visas en spinner under hämtningsprocessen så användaren vet att den jobbar. Om GitHub svarar med en felkod, till exempel 403, blir `response.ok` false. Då kastar `getJson` ett fel som fångas i `catch` i `renderRepos`, och besökaren får ett meddelande om att projekten inte kunde laddas. Om GitHub mot förmodan inte svarar alls så låser sig inte programmet utan är byggt med `AbortSignal` som slutar försöka efter 8 sekunder, och koden hamnar i `catch`. Om den har lyckats få svar från GitHub men inte hittat några publika repon så visar koden "No projects yet" och inte något fel. Om CV-fetchen blir fel så svarar den också med ett felmeddelande och en statuskod så användaren förstår vad som hände och inte bara ser en tom lista.

### Styrkor och brister

Det som blev bra var alla laddningslägen kring fetch och att CV:t kunde bli en gemensam funktion för både `education` och `workExperience` då jag kunde sätta samma keys för båda i JSON. Temat blev också bra då jag lyckades lösa blinkningsproblemet och ha `prefers-color-scheme` som backup. Saker som går att bygga vidare på är till exempel att man kan ha en gammal cache som reserv för GitHub om den är nere. Jag skulle kunna bygga navigationen med JavaScript och `createElement` istället. Jag skulle också kunna lägga en `try/catch` runt `languages`-anropet i loopen och visa "Unknown" om det misslyckas, i stället för att hela listan stoppas.

### AI-verktyg

Jag använde AI för att skapa JSON-listan och för att bygga HTML-renderingen i JavaScript istället för att hålla på att skriva ut alla `document.createElement` osv. AI:n kollade igenom datan från GitHubs API för att kolla vad jag behövde. Det var repetitivt arbete som jag förstår men som tar tid. Den hjälpte till med viss felsökning, t.ex. att klassnamnet stavades olika i CSS och JS så att ikonen inte bytte, och den är ett jättebra granskningsverktyg för att jämföra koden med kriterierna. Jag fick förslag om `AbortSignal` och då frågade jag om den ens krävdes och om inte `async` redan löste det. Men `async` hindrar bara sidan från att frysa, den bestämmer inte hur länge den väntar. För skärmläsare föreslog AI:n `.visually-hidden` för spinnern, men det hade gjort att jag behövt mer CSS. Så jag frågade om det gick utan CSS och fick fram en enklare lösning med `aria-label` och `role`. AI:n gjorde själva `createElement`-strukturen, men jag ändrade den genom att göra en separat funktion, `createProjectCards`, utanför render-funktionen då det var lättare att läsa. Där sparade jag allt i en array, `articles`, som sedan returneras när allt är klart.
