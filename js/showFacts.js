let factsCount = 0;
var countries = ["Cuba", "USA", "Sweden", "Serbia", "United Kingdom", "Japan", "Spain", "Netherlands"];

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
    /*
    const facts = {
        "Cuba": [
            { q: "Cuba is the birthplace of Son Cubano, a music genre that blends Spanish and African influences and is considered a precursor to salsa." },
            { q: "The famous band Buena Vista Social Club made traditional Cuban music popular worldwide and won a Grammy in 1998." }
        ],
        "USA": [
            { q: "Jazz, an important music genre, emerged in the early 20th century in New Orleans, Louisiana. Artists like Louis Armstrong and Duke Ellington were key figures in its development." },
            { q: "The music television channel MTV was founded in 1981 and revolutionized the music market by broadcasting music videos. Stars like Madonna and Michael Jackson benefited from it." }
        ],
        "Sweden": [
            { q: "ABBA is one of the most successful bands of all time and comes from Sweden. The group became world-famous in the 1970s and is known for hits such as 'Dancing Queen', 'Mamma Mia', and 'Waterloo'." },
            { q: "Swedish music producers like Max Martin have written numerous international pop hits, including for Britney Spears, Taylor Swift, and The Weeknd." }
        ],
        "Serbia": [
            { q: "The Serbian band 'Balkanika' represented Serbia at the Eurovision Song Contest 2018 with the song 'Nova deca'." },
            { q: "Goran Bregović is an internationally known Serbian musician and composer, famous for his film music and for blending Balkan folk with modern music." }
        ],
        "United Kingdom": [
            { q: "The Beatles, one of the most influential bands in music history, hail from Liverpool, England. They revolutionized pop music in the 1960s." },
            { q: "The Glastonbury Festival, founded in 1970 in Somerset, is one of the largest and best-known music festivals in the world." }
        ],
        "Japan": [
            { q: "J-Pop stands for Japanese pop music and has been a dominant genre in Japan since the 1990s." },
            { q: "Taiko (太鼓) are traditional Japanese drums used in both classical and modern Japanese music." }
        ],
        "Spain": [
            { q: "Flamenco is a traditional music and dance style from Andalusia and is considered a symbol of Spanish culture worldwide." },
            { q: "The Spanish singer Rosalía combines modern pop with traditional flamenco elements and has received international awards." }
        ],
        "Netherlands": [
            { q: "The Netherlands is known for its electronic dance music (EDM) and has produced famous DJs like Tiësto, Armin van Buuren, and Martin Garrix." },
            { q: "The Amsterdam Dance Event (ADE) is one of the world's largest festivals and conferences for electronic music." }
        ]
    };*/
    
    const facts = {
      "Cuba": [
        { q: "Imagine the narrow streets of Havana where Spanish guitar meets African drums: this is where Son Cubano was born, a vibrant blend of melodies and rhythms that laid the foundation for salsa and continues to captivate listeners around the world!" },
        { q: "In the late 1990s, a group of veteran musicians dusted off their instruments and sparked a global sensation: their debut album and Oscar-nominated documentary swept through the music scene, won a Grammy in 1998, and reignited passion for traditional Son, Danzón, and Bolero." }
      ],
      "USA": [
        { q: "At the turn of the 20th century, New Orleans buzzed with creativity as blues, ragtime, and African percussion fused into jazz—a revolutionary sound carried to the world by Louis Armstrong’s jubilant trumpet and Duke Ellington’s sophisticated big-band magic." },
        { q: "In 1981, MTV changed the game by making music videos the heart of pop culture. Icons like Madonna in her bold fashions and Michael Jackson with his moonwalk transformed how we see and feel music forever." }
      ],
      "Sweden": [
        { q: "Decked out in flared trousers and unforgettable harmonies, Agnetha, Björn, Benny, and Anni-Frid shot ABBA to the top in the 1970s. Songs like “Dancing Queen” became global disco anthems, keeping dance floors alive with glittering energy!" },
        { q: "Behind countless chart-toppers is Swedish hitmaker Max Martin: his knack for crafting irresistible hooks produced megahits for Britney Spears, Taylor Swift, and The Weeknd—melodies that worm their way into your mind and never let go." }
      ],
      "Serbia": [
        { q: "With “Nova deca,” Balkanika transported Europe into a sonic universe of traditional chants, brass fanfares, and danceable Balkan rhythms. Their 2018 Eurovision performance breathed fresh air into the contest by fusing modern staging with centuries-old heritage." },
        { q: "As the mastermind behind scores for films like “Arizona Dream” and “Underground,” and leader of his Wedding and Funeral Orchestra, Goran Bregović blends lush Balkan folk with rock, jazz, and classical elements—his live shows are a stomping celebration of world music." }
      ],
      "United Kingdom": [
        { q: "From their skiffle roots in the Cavern Club to groundbreaking studio experiments at Abbey Road, The Beatles redefined pop music in the 1960s. With songs like “Hey Jude,” they didn’t just top charts—they rewrote the rules of what a band could be." },
        { q: "Since 1970, the Glastonbury Festival has turned Somerset into a sprawling wonderland of tents, stages, and boundless energy. Whether it’s rock, folk, indie, or electronica, each performance becomes part of a collective musical pilgrimage." }
      ],
      "Japan": [
        { q: "Bursting onto the scene in the 1990s, J-Pop’s colorful idol groups and high-energy productions have dominated Japan’s charts and influenced fashion and pop culture worldwide—from Tokyo’s neon streets to global stages." },
        { q: "When the powerful Taiko drums thunder, the ground and your soul vibrate in unison. Whether in ancient rituals or modern ensembles, these drums deliver a visual and auditory spectacle that’s nothing short of electrifying." }
      ],
      "Spain": [
        { q: "Flamenco’s passionate guitar riffs, haunting vocals, and rhythmic handclaps tell stories of love, pain, and pride. Whether in an intimate tablao or a grand theater, its raw emotion transports you straight to the heart of Andalusia." },
        { q: "With her album “El Mal Querer,” Rosalía bridged centuries by fusing trap beats with traditional flamenco chants. Her groundbreaking videos and international awards prove that flamenco is alive and evolving in the 21st century." }
      ],
      "Netherlands": [
        { q: "From Tiësto’s festival-filling sets in the 2000s to Armin van Buuren’s epic trance journeys and Martin Garrix’s chart-topping youth anthem “Animals,” the Netherlands has shaped the EDM landscape and fueled rave culture worldwide." },
        { q: "Every October, Amsterdam Dance Event transforms the city into a pulsating epicenter of electronic music: conferences, club nights, panels, and DJ sets draw over 400,000 fans and industry insiders celebrating the future of dance music." }
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
