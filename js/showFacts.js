let factsCount = 0;
var countries = ["Netherlands", "Germany", "Sweden", "China", "Canada", "USA", "Brazil", "Spain", "Italy", "Switzerland", "France", "United Kingdom"];

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
    factsCount--;
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
        "Netherlands": [
            { q: "The Netherlands is known for producing world-famous DJs such as Armin van Buuren, Martin Garrix, and Tiësto, making it one of the biggest electronic music hubs in the world." },
            { q: "Dutch artists have achieved remarkable Eurovision success, with the country winning the contest multiple times and consistently delivering memorable performances." }
        ],
        "Germany": [
            { q: "Germany is home to legendary composers like Beethoven and Bach, while also leading modern genres such as electronic music, metal, and techno." },
            { q: "Berlin is considered one of the world's electronic music capitals, attracting DJs and music fans from across the globe." }
        ],
        "Sweden": [
            { q: "Sweden is one of the world's largest exporters of pop music, producing global stars like ABBA, Zara Larsson, and countless hit songwriters." },
            { q: "Many international chart hits have been written or produced by Swedish songwriters, giving the country an outsized influence on modern pop." }
        ],
        "China": [
            { q: "China's music scene combines thousands of years of traditional instruments with a rapidly growing modern pop industry." },
            { q: "Although not part of Eurovision, Chinese artists are gaining international attention through streaming platforms and global collaborations." }
        ],
        "Canada": [
            { q: "Canada has produced global superstars including Celine Dion, Justin Bieber, The Weeknd, and Drake." },
            { q: "The country is known for its diversity, which has helped shape a music scene spanning pop, rock, hip-hop, country, and electronic music." }
        ],
        "USA": [
            { q: "The United States is the birthplace of influential genres such as jazz, blues, rock 'n' roll, hip-hop, and country music." },
            { q: "American artists and producers continue to dominate global music charts and shape worldwide music trends." }
        ],
        "Brazil": [
            { q: "Brazil is famous for vibrant musical styles like samba and bossa nova, which have influenced musicians around the world." },
            { q: "Music plays a central role in Brazilian culture, especially during Carnival, one of the world's biggest musical celebrations." }
        ],
        "Spain": [
            { q: "Spain has a long Eurovision history and a strong pop tradition that blends flamenco, Latin rhythms, and contemporary pop production." },
            { q: "Spanish-language music — from flamenco virtuosity to modern pop and indie scenes — regularly influences trends across Europe and Latin America." }
        ],
        "Italy": [
            { q: "Italy's Sanremo Music Festival inspired the creation of the Eurovision Song Contest and remains one of Europe's most prestigious music competitions." },
            { q: "Italian music blends classical heritage with modern pop, opera, rock, and internationally successful artists." }
        ],
        "Switzerland": [
            { q: "Switzerland hosted the very first Eurovision Song Contest in 1956 and remains an important part of Eurovision history." },
            { q: "Its multilingual culture inspires a diverse music scene spanning German, French, Italian, and Romansh influences." }
        ],
        "France": [
            { q: "France is internationally celebrated for chanson, electronic music, and influential artists across many generations." },
            { q: "French producers and DJs have helped shape modern electronic music, with acts like Daft Punk achieving worldwide success." }
        ],
        "United Kingdom": [
            { q: "The United Kingdom has produced some of the most influential artists in history, including The Beatles, Queen, Adele, and Ed Sheeran." },
            { q: "British music has played a defining role in the global evolution of rock, pop, punk, and electronic music." }
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
