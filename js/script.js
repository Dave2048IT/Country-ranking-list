window.addEventListener('load', async () => {
	const startLoadTime = performance.now();
	const reqMS = document.getElementById('reqMS');

	// Test the connection speed after a delay of 500 milliseconds
	setTimeout(async () => {
		const pageLoadTimeMS = performance.now() - startLoadTime;
		reqMS.textContent = Math.floor(pageLoadTimeMS);

		try {
		const speed = await testConnectionSpeed.test();
		console.log(speed);
		} catch (error) {
		console.error(error);
		}
	}, 500);
});

// Bevor die Seite geschlossen wird
window.addEventListener("beforeunload", function (event) {
	if (!("ctry_scores" in localStorage)) {
		// Wird anders angezeigt
		event.returnValue = "You have unsaved changes. If you leave now, your progress will be lost. Are you sure you want to leave?";
	}
	if (autosave1) {
		this.localStorage.setItem("ctry_timestamp", Date.now());
		saveScores();
	}
});

const testConnectionSpeed = {
	sourceAddr: "https://cdn.jsdelivr.net/npm/sweetalert2@11.0.19/dist/sweetalert2.all.min.js",
	downloadSize: 18501,

	// Function to test connection speed
	test: async function() {
		try {
			const startTime = performance.now();
			const response = await fetch(this.sourceAddr, { method: 'GET' });
			const totalSize = parseInt(response.headers.get('content-length')) || this.downloadSize;
			const endTime = performance.now();
			const speedMbps = ((totalSize * 8) / ((endTime - startTime) / 1000)) / 1000000;
			// Set the download speed in the span element on the page
			document.getElementById("downMb").textContent = speedMbps.toFixed(2);
			
			return speedMbps;
		} catch (error) {
			alert(error);
		}
	}
};

function rankCountries(op = 1) {
	const ms = performance.now();
	
	document.querySelectorAll(".rating-label").forEach(a=>a.style.display = "initial");
	const myNameInputs = document.querySelectorAll(".myNameInputs");
	const myScoreInputs = document.querySelectorAll(".myScoreInputs");
	const ranking = document.getElementById("ranking");

	const countries = [];
	for (let [i, input] of myNameInputs.entries()) {
		const { value: name } = input;
		const { value: score } = myScoreInputs[i];
		if (name && !isNaN(score)) {
			countries.push({ name, score: parseInt(score) });
		}
	}

	// op 2 => for autosaving (faster)
	if (op === 2)
		return countries;

	const len = countries.length;
	const original = [...countries];

	const duplicates = findDuplicateIndexes(countries);

	const rankedCountries = countries.sort((a, b) => b.score - a.score)
		.map(({ name, score }, i) =>
		`<span>${i + 1}<sup>${getOrdinal(i + 1)}</sup> : ${name} (${score}) -> ${i < 10 ? `${[12, 10, 8, 7, 6, 5, 4, 3, 2, 1][i]}` : 0} P.</span>`
	);

	let idx = 0;
	let ctry = null;
	let sumOfScores = 0;

	try {
		sumOfScores = rankedCountries.reduce(
			(accumulator, currentValue) => {
				ctry = countries[idx++];
				const score = currentValue.match(/\((-?\d+)\)/)[1];
				return accumulator + parseInt(score);
			},
			0 // initial value for accumulator
		);
		rankedCountries.splice(10, 0, null);
	} catch (error) {
		Swal.fire({
			title: "Oooh... A rare error!",
			icon: "error",
			text: 'It seems that one of your scores is empty. '+
				'If you see NaN, it means: Not a Number.',
			footer: `At ${ctry.name} -> ${ctry.score}`,
			background: "indianred",
			didOpen: () => {
				document.querySelector(".swal2-title").style.color = "white";
			},
		});
		idx = -1;
	}

	if (idx != -1 && countries[len - 2].score === 0) {
		Swal.fire({
		title: "Please give points to all countries except yours.",
		icon: "warning",
		background: "darkgoldenrod",
		didOpen: () => {
			document.querySelector(".swal2-title").style.color = "white";
		},
		});
	}

	if (idx != -1 && duplicates.length > 0) {
		const indexes = duplicates
			.map((index) => index + 1).join(", ");
		Swal.fire({
			title: "Warning",
			text: `Duplicate scores found for indexes: ${indexes}`,
			icon: "warning",
			background: "darkgoldenrod",
		});
	}

	const myText = rankedCountries.join("<br>");
	ranking.innerHTML = `My sum of all ${len} are: ${sumOfScores} P.<br><br>${myText}`;
	
	Swal.fire({
		title: "Successfully calculated.",
		text: "Scroll down to see more",
		icon: "success",
		didOpen: setPopupStyle("green")
	});

	duration.innerText = `In ${(performance.now() - ms).toFixed(1)} ms`;
	return original;
}

function findDuplicateIndexes(arr) {
	const duplicates = [];
	
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[i].score === arr[j].score) { // prüfen, ob Elemente gleich sind
				duplicates.push(i);
				duplicates.push(j);
			}
		}
	}
	// entfernen Sie Duplikate aus dem Ergebnisarray und sortieren Sie es aufsteigend
	return [...new Set(duplicates)].sort((a, b) => a - b);
}

function getOrdinal(n) {
	return (n === 11 || n === 12 || n === 13) ? "th" :
		(n % 10 === 1) ? "st" :
		(n % 10 === 2) ? "nd" :
		(n % 10 === 3) ? "rd" :
		"th";
}

function hasDuplicates(array) {
	return (new Set(array)).size !== array.length;
}

function myCreateCountry(i) {
	if (i === two_thirds_of_ctrys || i === (two_thirds_of_ctrys / 2 | 0)) {
		const breakDiv = document.createElement('div');
		breakDiv.className = 'intvActs';
		breakDiv.textContent = "Interval Act (5 Min. Break) 🎸🍵🫖";
		myMenu.appendChild(document.createElement('hr'));
		myMenu.appendChild(breakDiv);
	}

	const countryDiv = document.createElement('div');
	countryDiv.id = `countryDiv${i}`;
	countryDiv.classList.add('ctryDivs');
	countryDiv.style.backgroundImage = `url(https://cdn.countryflags.com/thumbs/${ctry_names[i]}/flag-3d-250.png)`;
	
	const nameInput = createInputElement('name', i, 'text', countries[i]);
	const scoreInput = createInputElement('score', i, 'number', 0, 10);
	nameInput.classList.add('myNameInputs');
	scoreInput.classList.add('myScoreInputs');

	const plusBtn = createButtonElement('plus', i, '↑');
	const minusBtn = createButtonElement('minus', i, '↓');
	// const inticks = createInticksElement([minusBtn, plusBtn]);

	const textArea = createTextAreaElement(`Memo ${i+1}:`);

	myMenu.append(document.createElement('hr'), `Country ${i + 1}:`, nameInput,
		countryDiv, scoreInput, ' Points', document.createElement('br'), minusBtn, textArea, plusBtn);
}

function createInputElement(name, id, type, value, step) {
	const input = document.createElement('input');
	input.id = `${name}${id}`;
	input.type = type;
	input.value = value;

	if (type === 'number') {
		input.step = step;
	}

	return input;
}

function createButtonElement(className, value, innerHTML) {
	const button = document.createElement('button');
	button.classList.add('tickBtns', className);
	button.value = value;
	button.innerHTML = innerHTML;
	return button;
}

function createInticksElement(children) {
	const inticks = document.createElement('p');
	inticks.classList.add('inticks');
	children.forEach(child => inticks.appendChild(child));
	return inticks;
}

function createTextAreaElement(placeholder) {
	const textArea = document.createElement('textarea');
	textArea.placeholder = placeholder;
	return textArea;
}

myMenu.addEventListener('click', function(e) {
	const i = e.target.value;
	if (e.target.matches('.minus')) {
		window[`score${i}`].value -= 1;
	} else if (e.target.matches('.plus')) {
		window[`score${i}`].value -= -1;
	}
	if (autosave1)
		saveScores(2);
});

/**
 * 
 * @param {number} op 1 => normal / 2 => for autosaving (faster) 
 */
function saveScores(op = 1) {
	try {
		let countries = rankCountries(op);
		localStorage.setItem("ctry_scores", JSON.stringify(
			countries.map(item => ({name: item.name, score: item.score}))
		));
		localStorage.setItem("ctry_timestamp", Date.now());
		
		if (op === 1) {
			Swal.fire({
				title: "Score saved",
				text: "Your scores have been saved to local storage.",
				icon: "success",
				didOpen: setPopupStyle("orange")
			});
		}
	} catch (error) {
		Swal.fire({
			title: "Failed to save score",
			text: error.message,
			icon: "error",
			didOpen: setPopupStyle("darkred")
		});
	}
}

function loadScores() {
	try {
		const storedScores = JSON.parse(localStorage.getItem("ctry_scores"));

		if (!storedScores) {
			Swal.fire({
				title: "No scores found",
				text: "There are no scores to load from local storage.",
				icon: "warning",
				didOpen: setPopupStyle("darkred")
			});

			return null;
		}
		
		let a, b;
		for (a = b = 0; a < countryCount; a++) {
			
			// if (a + 1 == localStorage.getItem("ctry_id")) {
			// 	b++;
			// 	continue;
			// }

			try {
				const nameInput = window["name" + a];
				const scoreInput = window["score" + a];
				const {name: nameValue = "", score: scoreValue = 0} = storedScores[b] || {};
				nameInput.value = nameValue;
				scoreInput.value = scoreValue;
				b++;
			} catch (error) {
				console.log("Error at Country Nr.", a+1, " -> ", error);
			}
		}
		
		Swal.fire({
			title: "Scores loaded successfully",
			icon: "success",
			didOpen: setPopupStyle("blue")
		});

		return storedScores;
	} catch (error) {
		Swal.fire({
			title: "Failed to load scores",
			text: error.message,
			icon: "error",
			didOpen: setPopupStyle("darkred")
		});

		return null;
	}
}

function randomPoints() {
	console.log("This is just for testing!");

	Swal.fire({
		icon: "warning",
		title: "This button will randomize the points.",
		didOpen: setPopupStyle("darkred")
	})
	
	for (let i = 0; i < countryCount; i++) {
		try {
			const scoreInput = window["score" + i];
			scoreInput.value = Math.random() * 110 | 0;
		} catch (error) {
			console.log("Error at Country Nr.", i+1, " -> ", error);
		}
	}
}

function setPopupStyle(bgColor) {
	return () => {
		document.querySelector(".swal2-popup").style.backgroundColor = bgColor;
		document.querySelector(".swal2-title").style.color = "white";
	};
}

function resetScores() {
	localStorage.removeItem("ctry_scores");

	Swal.fire({
		title: "Scores reset successful",
		text: "The scores have been removed from your device.",
		icon: "info",
		didOpen: setPopupStyle("darkslategrey")
	});
}

function setFallbackZeroClipboard(text) {
	if (ZeroClipboard.isFlashUnusable()) {
		Swal.fire({
			icon: 'error',
			title: 'Please try again',
			text: 'Flash is not installed or disabled in your browser...',
			footer: 'But anyway. If in doubt, hold and drag the text and select Copy.',
		});
	}

	const onCopy = function(e) {
		e.clipboardData.setData("text/plain", text);
		Swal.fire({
			icon: 'success',
			title: 'Text copied to clipboard!',
			text: 'Finally, now you can send it to Franz ;-)',
		});
	};

	const onError = function(e) {
		console.error(`Failed to load ZeroClipboard: ${e.name}`);
		Swal.fire({
			icon: 'error',
			title: 'Error copying text',
			text: `Sorry, there was an error copying the text to clipboard because: ${e.name}`,
			footer: 'Please hold and drag the text.',
		});
	};

	const clip = new ZeroClipboard(document.getElementById("btnTop10"));
	clip.on(`ready`, function(e) {
		clip.on(`copy`, onCopy);
		clip.on(`error`, onError);
	});
}

function copyTextWithCustomModal(text) {
	const textField = document.createElement('textarea');
	textField.textContent = text;
	textField.style.position = 'fixed';
	textField.style.opacity = 0;
	document.body.appendChild(textField);

	textField.select();
	
	try {
		const successful = document.execCommand('copy');

		if (successful) {
		Swal.fire({
			icon: "success",
			title: "1st Workaround -> Successful!",
			text: "Top 10 was copied. Now you can send it to Franz ;-)",
			confirmButtonText: "OK",
			didOpen: setPopupStyle("green")
		});
		return true;
		} else {
		throw new Error('1st Workaround -> Copy failed');
		}
	} catch (err) {
		const errorMsg = err.message || 'Unknown error occurred';
		Swal.fire({
		icon: "error",
		title: errorMsg,
		confirmButtonText: "OK",
		didOpen: setPopupStyle("darkred")
		}).then(() => {
		return false;
		});
	} finally {
		textField.remove();
	}
}

function copyToClipboard() {
	const rankingText = rankingEl.innerText.trim();
	const isRankingEmpty = !rankingText;

	if (isRankingEmpty) {
		Swal.fire({
		title: "Ranking calculation",
		text: `Oh, you forgot to calculate.`,
		icon: "warning",
		didOpen: setPopupStyle("darkorchid")
		});
		return;
	}

	let textToCopy = `My Country is: ${countries[selectNumber.value - 1] || "just a guest"}\n\n${rankingText.split('11th')[0].trim()}\n\n`
	if (ratingShow.value - 0)
		textToCopy += `I gave the Show: ${ratingShow.value} / 5 Stars.\n`;
	
	if (ratingSite.value - 0)
		textToCopy += `I gave David's Website: ${ratingSite.value} / 5 Hearts.\n`;

	if (navigator.clipboard) {
		navigator.clipboard.writeText(textToCopy)
		.then(() => {
			Swal.fire({
			title: "Success!",
			text: "Top 10 was copied. Now you can send it to Franz ;-)",
			icon: "success",
			didOpen: setPopupStyle("green")
			});
		})
		.catch((err) => {
			console.error(err);
			Swal.fire({
			title: "Oops...",
			text: "Clipboard API failed. Trying workaround...",
			icon: "warning",
			background: "coral"
			}).then(() => {
			if (!copyTextWithCustomModal(textToCopy)) {
				console.info("Hmmm. Another fallback please ...");
				setFallbackZeroClipboard(textToCopy);
			}
			});
		});
	} else {
		Swal.fire({
		title: "Oops...",
		text: "Clipboard API not supported. Trying workaround...",
		icon: "error"
		}).then(() => {
		if (!copyTextWithCustomModal(textToCopy)) {
			console.info("Ouch. Another fallback please ...");
			setFallbackZeroClipboard(textToCopy);
		}
		});
	}
}

const rankingEl = document.querySelector('#ranking');

let countryCount = countries.length;
if (!navigator.onLine)
	alert("Sorry, without internet you can't use the page, because I built in libraries to make the whole page more beautiful. ;-)");

function autoload() {
	if ("ctry_scores" in localStorage) {
		Swal.fire({
			title: "Savedata found. Do you want to load it?",
			text: "If you're unsure, click No.",
			footer: `From ${new Date(localStorage.getItem("ctry_timestamp") - 0).toLocaleString()}`,
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Yes",
			cancelButtonText: "No",
			didOpen: setPopupStyle("darkcyan"),
		}).then(function(isConfirm) {
			if (!isConfirm.isConfirmed) {
				Swal.fire({
					title: "Do you want to erase it?",
					text: "By clicking Yes, the site will reload.",
					icon: "question",
					showCancelButton: true,
					confirmButtonText: "Yes",
					cancelButtonText: "No",
					didOpen: setPopupStyle("darkred"),
				}).then(function(isConfirm) {
					if (isConfirm.isConfirmed) {
						resetScores();
						location.reload();
					}
				})
				return false;
			}
			// isConfirm.isConfirmed == true
			loadScores();
			setTimeout(() => {
				show3rdSwalPopup();
			}, 2000);
		})
		return true;
	}
	return false;
}

function show1stSwalPopup() {
	if (autoload())
		return;

	Swal.fire({
		title: 'Score Default Value',
		text: 'The number you enter here will be the default value for all scores. If you\'re unsure, leave it at 0.',
		input: 'number',
		inputValue: 0,
		confirmButtonText: 'Set Default',
		background: 'cornflowerblue',
		customClass: {
			input: 'swal2-input-modified',
		},
		inputValidator: (value) => {
			return value ? undefined : 'Please enter a valid score!';
		}
	}).then((result) => {
		if (result.isConfirmed && result.value !== "0") {
			const defaultScore = Number.parseInt(result.value) || 0;
			Array.from(document.getElementsByClassName('myScoreInputs')).forEach(input => {
				input.value = defaultScore;
			});
			console.log(`Selected score value is ${defaultScore}`);
		}
		show2ndSwalPopup();
	});
}

function show2ndSwalPopup() {
	const bgColor = navigator.onLine ? "#2196F3" : "darkblue";
	Swal.fire({
		title: `There are ${countryCount} countries participating today. Who will win this time?`,
		text: 'Good luck ;-)',
		icon: 'info',
		customClass: {
			popup: 'custom-swal-popup',
			title: 'custom-swal-title'
		},
		didOpen: setPopupStyle(bgColor),
		didClose: () => {
			show3rdSwalPopup();
		}
	});
}

function show3rdSwalPopup() {
	Swal.fire({
		title: "Do you want to enable autosave?",
		text: "If you're unsure, click Yes.",
		footer: "It saves your points automatically when you close the page (even by accident).",
		icon: "question",
		showCancelButton: true,
		confirmButtonText: "Yes",
        cancelButtonText: "No",
		didOpen: setPopupStyle("#808000"),
	}).then(function(isConfirm) {
		autosave1 = isConfirm.isConfirmed;
		if (autosave1) {
			window.addEventListener('input', function (evt) {
				saveScores(2);
			});			
		}
	})
}

if (!navigator.onLine) {
	Swal.fire({
		title: "No internet connection",
		text: "For the full experience, please turn on your internet to see the flags.",
		icon: "warning",
		customClass: {
			popup: 'custom-swal-popup',
			title: 'custom-swal-title'
		},
		didOpen: setPopupStyle("darkblue")
	});
}

const ctry_names = [];
const ctry_scores = [];
const two_thirds_of_ctrys = countryCount < 15 ? countryCount : countryCount / 3 * 2 | 0;

var autosave1 = false;
var select = document.getElementById("selectNumber");

// The actual countries array can be found in the file countries.js
countries.push("I'm just a guest. LOL");
for(var i = 0; i < countryCount + 1; i++) {
    var opt = countries[i];
    var el = document.createElement("option");
    el.textContent = `${(i + 1)}: ${opt}`;
    el.value = i + 1;
    select.appendChild(el);
}
countries.pop();

var os_platform = navigator.platform || "mystery device";
if (/android/i.test(os_platform)) {
	console.log("Der Browser wird auf einem Android-Gerät ausgeführt.");
} else if (/iPad|iPhone|iPod/.test(os_platform)) {
	console.log("Der Browser wird auf einem iOS-Gerät ausgeführt.");
}

function generateCountries() {
	if (!(selectNumber.value | 0)) {
		alert("Please choose your Country.");
		return;
	}
	var ms = performance.now();
	selectArea.style.display = "none";

	for (let i = 0; i < countryCount; i++) {
		const country = countries[i];
		const name = country === 'USA' ? 'united-states-of-america' : country.toLowerCase().replace(/ /g, '-');
	
		ctry_names.push(name);
		ctry_scores.push([country, 0]);

		if (i === selectNumber.value - 1) {
			const countryDiv = document.createElement('div');
			countryDiv.textContent = "So now you just listen, because only the others can vote. For 🎸 " + countries[i];
			myMenu.appendChild(document.createElement('hr'));
			myMenu.appendChild(countryDiv);
			continue;
		}
		myCreateCountry(i);
	}
	show1stSwalPopup();
	btnRank.style.display = "inline";
	btnTop10.style.display = "inline";

	console.log(ms = performance.now() - ms);
	duration.innerText = `In ${ms.toFixed(1)} ms`;
}

function healthyAdvice() {
	let foods = ['🍎 Apple', '🍐 Pear', '🍊 Tangerine', '🍋 Lemon', '🍌 Banana', '🍉 Watermelon', '🍇 Grapes', '🍓 Strawberries', '🫐 Blueberries', '🍈 Melon', '🍒 Cherries', '🍑 Peach', '🥭 Mango', '🍍 Pineapple', '🥥 Coconut', '🥝 Kiwi', '🍆 Aubergine', '🥑 Avocado', '🥦 Broccoli', '🥬 Leafy Vegetables', '🥒 Cucumber', '🌶 Chilli', '🥕 Carrots', '🫒 Olives', '🥚 Eggs', '🥗 Green Salad', '🍛 Curried Rice', '🌰 Chestnut', '🍵 Herbal Tea', '🍯 Honey'];
	Swal.fire({
		title: 'Healthy Advice!',
		text: `Have you ever tried ${foods[Math.random() * foods.length | 0]}?`,
		footer: `A good diet, physical activity and sleep are important.<br><br> And take good care of your ${os_platform} ;-)`,
		icon: 'info',
		confirmButtonText: 'OK',
		background: '#0070c0',
		didOpen: () => {
			document.querySelector('.swal2-title').style.color = "lime";
		}
	})
}

function showFacts() {
	let facts = [
		{
			q: "How many people are living in Sweden?",
			a: "10,551,707 (December 31, 2023)"
		},
		{
			q: "Who is the current Head of state in Japan?",
			a: "Tennō Naruhito (Emperor)"
		},
		{
			q: "How big is Switzerland in km² ?",
			a: `• Total 41,285 km² (15,940 mi²)
			<br>(Rank 132nd)
			<br>• Water 4.34 % -> 691.8 mi²`
		},
		{
			q: "In Paris, there is only one stop sign, but there is also a Statue of Liberty and you can marry dead people and the Eiffel Tower. But by law you can't call your pig Napoleon."
		},
		{
			q: "The longest word ever published in German is: Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft."
		},
		{
			q: "Finland: The amount of the fine depends on the driver's income if the speed limit is exceeded by 20 km/h or more. In Finland, this can sometimes lead to five-figure fines."
		},
		{
			q: "Romania: Here you will find the waterfall that is considered by many to be the most beautiful waterfall in the world: Cascada Bigar. The village of Sâpânta in the Romanian region of Maramures is also home to what is probably the world's most colorful cemetery."
		},
		{
			q: "There is an almost 500-year-old statue in Switzerland that shows the fountain figure eating children: the Kindlifresserbrunnen. The figure was once used to intimidate disobedient children."
		},
		{
			q: `In Hong Kong, you can study "Bra Studies" - i.e. BH sciences.`
		},
		{
			q: "Spain has the oldest existing lighthouse, the Tower of Hercules."
		},
		{
			q: `Australia is both a country and a continent.
			Its unique distinction as the smallest continent and a major country offers a variety of natural wonders.`
		},
		{
			q: "Japan has the highest density of vending machines."
		},
		{
			q: `Italy boasts the highest number of UNESCO World Heritage Sites, a testament to its rich historical and cultural legacy.
			These sites range from ancient Roman ruins to Renaissance art, reflecting Italy's profound impact on world history and culture.`
		},
		{
			q: "How many countries are there in South America?",
			a: `It comprises 12 countries.
			<br>Exploring this diverse continent offers a range of experiences, from the Amazon rainforest to the Andes Mountains.`
		},
		{
			q: "How many countries are there in the world?",
			a: `Currently, there are 195 countries in the world. This includes recognized sovereign states with distinct territories, governments, and populations.`
		}
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

var itv1 = null;
const INTERVAL_DURATION = 10 * 60 * 1000;

// Erstellen einer Funktion, die das erste Interval-Set auslöst
function setFirstInterval() {
	setTimeout(() => {
		showFacts();
		itv1 = setInterval(showFacts, INTERVAL_DURATION);
	}, INTERVAL_DURATION - (Date.now() % INTERVAL_DURATION));
}

setFirstInterval();