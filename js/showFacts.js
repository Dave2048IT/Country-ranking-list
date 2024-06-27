function showFacts() {
	let facts = [
		// General facts
		{
			q: "How many people are living in Sweden?",
			a: "10,551,707 (December 31, 2023)"
		},
		{
			q: "How big is Switzerland in km² ?",
			a: `• Total 41,285 km² (15,940 mi²)
			<br>(Rank 132nd)
			<br>• Water 4.34 % -> 691.8 mi²`
		},
		// ### Austria
		{ q: "Austria is the home of Viennese classical music, which was characterised by composers such as Wolfgang Amadeus Mozart, Ludwig van Beethoven and Joseph Haydn." },
		{ q: "The New Year's Concert of the Vienna Philharmonic Orchestra is a world-famous event that takes place every year on January 1st at the Vienna Musikverein." },
		// ### China
		{ q: "The Guqin, an ancient stringed instrument, has a history of over 3,000 years and is known as the instrument of the wise." },
		{ q: "The Peking Opera combines song, dance, mime and acrobatics and is one of the most important forms of traditional Chinese art." },
		// ### Colombia
		{ q: "**cumbia:** Colombia is the birthplace of cumbia, a form of music and dance that combines African, indigenous and Spanish influences." },
		{ q: "Shakira Isabel Mebarak Ripoll is a Colombian pop singer and songwriter. At the beginning of her career, she sang in Spanish and had her first successes in Latin America and Spain. Her first English-language album Laundry Service made her a global pop star in 2002." },
		// ### Finland
		{ q: "The Helsinki Festival is the biggest art festival in Finland." },
		{ q: "Finland has the highest number of heavy metal bands per capita worldwide." },
		{ q: "Finland: The amount of the fine depends on the driver's income if the speed limit is exceeded by 20 km/h or more. In Finland, this can sometimes lead to five-figure fines." },
		// ### France
		{ q: "Chanson is a traditional French song genre." },
		{ q: "The Fête de la Musique is always on June 21st and is a nationwide music festival." },
		{ q: "In Paris, there is only one stop sign, but there is also a Statue of Liberty and you can marry dead people and the Eiffel Tower. But by law you can't call your pig Napoleon." },
		// ### Germany
		{ q: "Krautrock is an experimental rock music with bands like Kraftwerk." },
		{ q: "The Bayreuther Festspiele is the opera festival honoring Wagner." },
		{ q: "The longest word ever published in German is: Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft." },
		// ### Italy
		{ q: "Now widely considered the ‘heir’ of Verdi, Puccini is known as one of the great composers of Italian opera. While his early work is traditional, late-19th-century Romantic Italian opera, Puccini became better known for writing in the verismo style – Italian for ‘realism’." },
		{ q: "The Festival “della Canzone Italiana” is a major music competition in the Ligurian city of Sanremo and is usually referred to as the Festival di Sanremo after its venue. It is the most important music competition in Italy and the oldest pop music competition in Europe. Founded in 1951, the festival was the inspiration for the organization of the Eurovision Song Contest." },
		// ### Japan
		{ q: "J-Pop is an abbreviation of Japanese pop music or Japan Pop and refers to a broad musical genre that established itself in the Japanese music world in the 1990s." },
		{ q: "Taiko (太鼓) are a broad range of Japanese percussion instruments. In Japanese, the term taiko refers to any kind of drum, but outside Japan, it is used specifically to refer to any of the various Japanese drums called wadaiko (和太鼓, lit. 'Japanese drums') and to the form of ensemble taiko drumming more specifically called kumi-daiko (組太鼓, lit. 'set of drums')." },
		// ### Netherlands
		{ q: "The Netherlands is known for electronic dance music with DJs like Tiësto." },
		{ q: "The Eurosonic Noorderslag is an important platform for European music." },
		// ### New Zealand
		{ q: "Haka is a traditional Maori war dance." },
		{ q: "Lorde [lɔːrd], real name Ella Marija Lani Yelich-O'Connor, is a New Zealand-Croatian singer and songwriter. The stage name Lorde is due to her interest in aristocracy and royalty." },
		// ### Portugal
		{ q: "Fado is a melancholy music genre from Lisbon." },
		{ q: "NOS Alive is one of Europe's largest music festivals." },
		// ### Puerto Rico
		{ q: "Reggaeton is a musical genre that has developed from reggae, hip-hop, merengue, Latin American music styles and electronic dance music." },
		{ q: "Ricky Martin is a Puerto Rican Latin pop singer and actor. He also holds Spanish citizenship." },
		// ### South Africa
		{ q: "Mbube is a form of South African vocal music, made famous by the South African group Ladysmith Black Mambazo. The word mbube means lion in Zulu. Mbube is the basis for 'The Lion Sleeps Tonight.'" },
		{ q: "Kwela is a music style with a tin whistle and jazz rhythms." },
		// ### Sweden
		{ q: "ABBA is one of the most successful bands and hails from Sweden." },
		{ q: "Sweden is home to about 221,800 islands, making it the country with the most islands in the world." },
		{ q: "Certain baked goods in Sweden have their own special days where they're celebrated. For instance, semla (Semmeln), kanelbulle (Zimtschnecken) and våffel (Waffles) are particularly popular and often consumed on these days." },
		// ### Eurovision Song Contest (ESC)
		{ q: "**Stage for talents:** The Eurovision Song Contest has given many artists their big break, including ABBA (Sweden, 1974) and Celine Dion (Switzerland, 1988)." },
		{ q: "With over 40 countries taking part and hundreds of millions of viewers worldwide, the ESC is the biggest music competition on the planet." }
	];
	let i = Math.random() * facts.length | 0;
	Swal.fire({
		title: facts[i].a ? "Question:" : "Did you know?",
		text: facts[i].q,
		// footer: facts[i].a,
		icon: 'info',
		confirmButtonText: 'OK',
		background: '#0070c0',
		didOpen: () => {
			document.querySelector('.swal2-title').style.color = "yellow";
		},
		didClose: () => {
			if (facts[i].a) {
				Swal.fire({
					text: 'The answer is ...',
					title: facts[i].q,
					footer: facts[i].a,
					icon: 'info',
					confirmButtonText: 'OK',
					background: 'purple',
					didOpen: () => {
						document.querySelector('.swal2-title').style.color = "gold";
					}
				});
			}
		}
	});
}
