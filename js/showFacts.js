let factsCount = 0;
var countries = ['USA', 'Iceland', 'United Kingdom', 'France', 'Sweden', 'Moldova', 'Japan', 'Germany'];

testFactDisplay(countries);

function testFactDisplay(countries) {
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
    const factCountries = showFact("Germany", 0);
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
        "Sweden": [
            { q: 'ABBA is one of the most successful bands of all time and comes from Sweden. The group became world-famous in the 1970s and is known for hits such as "Dancing Queen", "Mamma Mia" and "Waterloo". Their music and influence on pop music can still be felt today.' },
            { q: "Sweden has one of the most influential music industries in the world, especially in pop music. Swedish music production has spawned numerous international successes, including well-known songwriters and producers such as Max Martin, who has worked on hits for artists such as Britney Spears, Taylor Swift and The Weeknd." }
        ],
        "United Kingdom": [
            { q: "The Beatles, one of the most influential bands in music history, hail from Liverpool, England. They revolutionized pop music in the 1960s and influenced countless artists worldwide." },
            { q: "The Glastonbury Festival, which was founded in Somerset in 1970, is one of the largest and best-known music festivals in the world. It offers a wide range of musical styles, from rock to electronic music and world music." }
        ],
        "Iceland": [
            { q: "The singer and composer Björk, who was born in Reykjavik in 1965, is internationally renowned for her innovative musical style, which combines electronic, experimental and classical elements. She has won numerous awards and is one of the most distinctive figures in modern music." },
            { q: 'The Icelandic band Sigur Rós is known for its unique sound, which is often referred to as "post-rock". Their music is characterized by a melancholic atmosphere and the use of Icelandic language as well as a specially developed "Hopelandic" language.' }
        ],
        "Japan": [
            { q: "J-Pop is an abbreviation of Japanese pop music or Japan Pop and refers to a broad musical genre that established itself in the Japanese music world in the 1990s." },
            { q: "Taiko (太鼓) are a broad range of Japanese percussion instruments. In Japanese, the term taiko refers to any kind of drum, but outside Japan, it is used specifically to refer to any of the various Japanese drums called wadaiko (和太鼓, lit. 'Japanese drums') and to the form of ensemble taiko drumming more specifically called kumi-daiko (組太鼓, lit. 'set of drums')." }
        ],
        "France": [
            { q: 'Edith Piaf, known as "The Sparrow of Paris", was one of the most famous French chanson singers of the 20th century. Her best-known song, "La Vie en Rose", was published in 1947 and remains a timeless classic to this day.' },
            { q: 'The French duo Daft Punk, consisting of Thomas Bangalter and Guy-Manuel de Homem-Christo, is famous for its innovative contributions to electronic music. Their 2001 album "Discovery" significantly influenced the development of the house genre and electronic dance music.' }
        ],
        "USA": [
            { q: "Jazz, an important musical genre, emerged in the early 1900s in New Orleans, Louisiana. Artists such as Louis Armstrong and Duke Ellington contributed significantly to the development and popularization of this genre." },
            { q: "The music television channel MTV (Music Television) was founded in 1981 and revolutionized the way music is consumed. It was the first television channel to focus exclusively on music videos and helped to promote the careers of many artists, such as Madonna and Michael Jackson." }
        ],
        "Germany": [
            { q: "The band Kraftwerk from Düsseldorf is considered a pioneer of electronic music. Since their formation in the 1970s, they have made significant contributions to the development of techno and synthpop. Their influence is unmistakable in modern music, especially in electronic music." },
            { q: 'Beethoven, one of the greatest composers of the classical period, was born in 1770 in Bonn, which was then part of the Holy Roman Empire and is now part of Germany. His compositions, such as the "9th Symphony", have had a decisive influence on music history.' }
        ],
        "Moldova": [
            { q: 'Moldova has been taking part in the Eurovision Song Contest since 2005 and has put in several impressive performances since then. One of the most famous Moldovan Eurovision participations was in 2017 with the band SunStroke Project and their song "Hey Mamma". The song achieved third place, Moldova\'s best result in the history of the competition. The band is particularly known for the "Epic Sax Guy", a saxophonist whose performance achieved viral popularity.' },
            { q: 'This Moldovan band is one of the country\'s best-known music groups. Founded in 1994, Zdob și Zdub combines traditional Moldovan music with modern genres such as punk rock and hip-hop. They are popular not only in Moldova, but also in many other countries of the former Soviet Union and in Europe. The band represented Moldova at the Eurovision Song Contest in 2005 and 2011 and is known for its energetic performances and creative mix of different musical styles.' }
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
