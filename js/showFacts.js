let factsCount = 0;
var countries = ["Japan","Spain","Puerto Rico","Estonia","Mali","Germany","France","Denmark","United States of America","Norway","Sweden","United Kingdom"];

if (/Windows|Macintosh|Linux/.test(navigator.userAgent)) {
    validateCountryFacts(countries);
}

function validateCountryFacts(countries) {
	const ms = performance.now();

    window.__TEST_MODE__ = true;
    const expectedFacts = countries.length * 2; // Angenommen, 2 Fakten pro Land
    
    // Zeige alle Fakten für jedes Land an
    countries.forEach(country => {
        [0, 1].forEach(index => showFact(country, index));
    });
    
    // Überprüfe die Anzahl der angezeigten Fakten
    if (factsCount === expectedFacts) {
        console.log("Alle Fakten vorhanden.");
    } else {
        console.warn(`Erwartete Fakten: ${expectedFacts}. Aber es sind: ${factsCount}`);
    }

    // Gibt bei einem Test → Object.keys(facts) zurück.
    const factCountries = showFact(countries[0], 0);
    const missingCountries = factCountries.filter(country => !countries.includes(country));

    if (missingCountries.length > 0) {
        console.warn("Fehlende Länder, die in `facts` vorhanden sind, aber nicht in `countries`:");
        missingCountries.forEach(country => console.warn(`- ${country}`));
    } else {
        console.log("Alle Länder in `facts` sind in der `countries`-Liste enthalten.");
    }
    
    window.__TEST_MODE__ = false;

	console.log(`Tested in ${(performance.now() - ms).toFixed(1)} ms`);
}

// Funktion, um Fakten für ein bestimmtes Land und Index anzuzeigen
function showFact(country, index) {
    // Definiere die Fakten direkt in der Funktion
    const facts = {
        "Japan": [
            { q: "Japan’s pop culture powerhouse — J-Pop, anime soundtracks, and idol groups — has shaped global music tastes and created exportable pop aesthetics." },
            { q: "Not eligible for Eurovision, Japan instead shines through huge music festivals, anime music fame, and internationally loved artists and producers." }
        ],
        "Spain": [
            { q: "Spain has a long Eurovision history and a strong pop tradition that blends flamenco, Latin rhythms, and contemporary pop production." },
            { q: "Spanish-language music — from flamenco virtuosity to modern pop and indie scenes — regularly influences trends across Europe and Latin America." }
        ],
        "Puerto Rico": [
            { q: "Puerto Rico is a global hotspot for Caribbean genres — salsa, reggaetón and Latin trap — and has produced artists who reshaped contemporary Latin pop." },
            { q: "Puerto Rico does not compete in Eurovision; its musical impact is felt worldwide through chart-topping Latin hits and influential producers." }
        ],
        "Estonia": [
            { q: "Estonia punches above its weight in Eurovision and modern pop — the country mixes Baltic folk colors with polished pop production." },
            { q: "A vibrant electronic and choral tradition gives Estonia a distinctive soundscape that often translates well to international song contests." }
        ],
        "Mali": [
            { q: "Mali is famed for its rich musical heritage — the kora, desert blues, and melodic traditions have inspired global world-music audiences." },
            { q: "While not part of Eurovision, Mali’s musicians have achieved international acclaim and heavily influenced guitar-based and folk fusion genres." }
        ],
        "Germany": [
            { q: "Germany combines a huge pop and electronic scene with a long Eurovision presence — from schlager and pop to pioneering electronic music." },
            { q: "Germany’s music industry is influential in Europe, producing successful pop acts and a thriving club/electronic culture that shapes dance music globally." }
        ],
        "France": [
            { q: "France’s chanson tradition and contemporary pop/hip-hop scenes coexist — French songwriting and production have a distinct lyrical and stylistic identity." },
            { q: "France participates actively in Eurovision and also exports influential pop, electronic and world-music producers and artists." }
        ],
        "Denmark": [
            { q: "Denmark has a strong pop and indie output and a notable Eurovision track record, often emphasizing catchy, well-crafted songs." },
            { q: "Danish producers and songwriters are prominent in Scandinavian pop circles, contributing polished productions across Europe." }
        ],
        "United States of America": [
            { q: "The USA is not a Eurovision participant, but it is the global epicenter of many genres — jazz, rock, hip-hop, R&B, pop — shaping worldwide music culture." },
            { q: "American record labels, producers, and streaming trends heavily influence global pop production and the international music business." }
        ],
        "Norway": [
            { q: "Norway blends Nordic folk influences with modern pop and electronic music and has cultivated memorable Eurovision entries." },
            { q: "Norwegian songwriters and producers are sought after internationally for their melodic sensibility and polished pop craftsmanship." }
        ],
        "Sweden": [
            { q: "Sweden is a Eurovision powerhouse and global pop factory — from ABBA’s legacy to contemporary hitmakers, it consistently produces memorable, catchy songs." },
            { q: "Swedish songwriters and producers (a tiny but prolific industry) have written mega-hits worldwide, making Sweden hugely influential in global pop." }
        ],
        "United Kingdom": [
            { q: "The UK has a long and storied Eurovision history and a massive pop legacy — from iconic rock bands to chart-dominating pop stars." },
            { q: "British music scenes (pop, rock, electronic) and songwriting traditions have shaped global trends and continue to feed international charts." }
        ]
    };

    const countryFacts = facts[country];
    
    // Fehlerbehandlung für ungültiges Land
    if (!countryFacts) {
        console.error(`Country ${country} not found`);
        return;
    }
    
    // Fehlerbehandlung für ungültigen Index
    if (index < 0 || index >= countryFacts.length) {
        console.error('Index out of bounds');
        return;
    }

    // Bei einem Test die Länder der Fakten zurückgeben
    if (window.__TEST_MODE__) {
        factsCount++;
        return Object.keys(facts);
    }

    // Fakt anzeigen, wenn alle Prüfungen bestanden sind
    Swal.fire({
        title: "Did you know?",
        text: countryFacts[index].q,
        icon: 'info',
        confirmButtonText: 'OK',
        background: '#0070c0',
        didOpen: () => {
            document.querySelector('.swal2-title').style.color = "yellow";
        }
    });
}
