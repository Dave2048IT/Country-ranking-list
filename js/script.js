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

window.addEventListener("beforeunload", function (event) {
	if (!("ctry_scores" in localStorage)) {
		event.returnValue = "You have unsaved changes. If you leave now, your progress will be lost. Are you sure you want to leave?";
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

function rankCountries() {
	const ms = performance.now();
	
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

	if (idx != -1 && rankedCountries[len - 2].score === 0) {
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
		myMenu.appendChild(breakDiv);
		myMenu.appendChild(document.createElement('hr'));
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
	const inticks = createInticksElement([minusBtn, plusBtn]);

	const textArea = createTextAreaElement(`Memo ${i+1}:`);

	countryDiv.append(`Country ${i + 1}:`, nameInput, scoreInput, ' Points', inticks, document.createElement('hr'));

	myMenu.append(textArea, countryDiv);
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
	if (e.target.matches('.minus')) {
		const i = e.target.value;
		window[`score${i}`].value -= 1;
	} else if (e.target.matches('.plus')) {
		const i = e.target.value;
		window[`score${i}`].value -= -1;
	}
});

function saveScores() {
	try {
		let countries = rankCountries();
		localStorage.setItem("ctry_scores", JSON.stringify(
			countries.map(item => ({name: item.name, score: item.score}))
		));
		
		Swal.fire({
			title: "Score saved",
			text: "Your scores have been saved to local storage.",
			icon: "success",
			didOpen: setPopupStyle("orange")
		});
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

		for (let i = 0; i < countryCount; i++) {
			const nameInput = window["name" + i];
			const scoreInput = window["score" + i];
			const {name: nameValue = "", score: scoreValue = 0} = storedScores[i] || {};
			nameInput.value = nameValue;
			scoreInput.value = scoreValue;
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

function tableCreate() {
	const body = document.body,
		tbl = document.createElement('table');
	tbl.id = "ranking_table";
	tbl.style = "margin: auto; text-align: end;";
	// tbl.style.width = '100px';
	tbl.style.border = '1px solid black';

	for (let i = 0; i < countryCount; i++) {
		const tr = tbl.insertRow();
		for (let j = 0; j < 4; j++) {
			const td = tr.insertCell();
			if (j == 2)
				td.style = "text-align: center;";
			// td.appendChild(document.createTextNode(`Cell I${i}/J${j}`));
			// td.style.border = '1px solid black';
		}
	}
	ranking.appendChild(tbl);
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
	const isCountryEmpty = !countryPutEl.value;

	if (isRankingEmpty || isCountryEmpty) {
		Swal.fire({
		title: "Ranking calculation",
		text: `Oh, you forgot to ${isRankingEmpty ? "calculate" : "enter your country"}.`,
		icon: "warning",
		didOpen: setPopupStyle("darkorchid")
		});
		return;
	}

	const textToCopy = `My Country is: ${countryPutEl.value}\n\n${rankingText.split('11th')[0].trim()}`;

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
const countryPutEl = document.querySelector('#country_put');

let countryCount = countries.length;
if (!navigator.onLine)
	alert("Sorry, without internet you can't use the page, because I built in libraries to make the whole page more beautiful. ;-)")

Swal.fire({
	title: 'Score Default Value',
	text: 'The number you enter here will be the default value for all scores.',
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
			testClipboard();
		}
	});
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

var ms = performance.now();
const two_thirds_of_ctrys = countryCount / 3 * 2 | 0;

// var ctry_obj = countries.reduce((acc,curr)=> (acc[curr]=0,acc),{});
const ctry_names = [];
const ctry_scores = [];

for (let i = 0; i < countryCount; i++) {
	const country = countries[i];
	const name = country === 'USA' ? 'united-states-of-america' : country.toLowerCase().replace(/ /g, '-');

	ctry_names.push(name);
	ctry_scores.push([country, 0]);
	const delayedCreateCountry = () => {
		myCreateCountry(i); 
	}
	setTimeout(delayedCreateCountry, 0);
}
console.log(ms = performance.now() - ms);
duration.innerText = `In ${ms.toFixed(1)} ms`;
delete countries;

var os_platform = navigator.platform;
if (/android/i.test(os_platform)) {
	console.log("Der Browser wird auf einem Android-Gerät ausgeführt.");
} else if (/iPad|iPhone|iPod/.test(os_platform)) {
	console.log("Der Browser wird auf einem iOS-Gerät ausgeführt.");
}

function testClipboard() {
	const text = 'Lets have fun ^^';

	// Create a temporary text field
	const textField = document.createElement('textarea');
	textField.value = text;
	document.body.appendChild(textField);

	// Select and copy the text from the text field
	textField.select();
	let isCopied = false;
	try {
		// Fails on iPhone
		isCopied = document.execCommand('copy');
		console.log(isCopied ? 'Text was copied to clipboard' : 'Let\'s hope that copying works.');
	} catch (err) {
		alert('Could not copy text', err);
	}

	// Remove the temporary text field
	document.body.removeChild(textField);

	// If the text was copied successfully, show a SweetAlert and prompt the user to paste it
	if (isCopied) {
		Swal.fire({
		title: `${text}`,
		html: '<input type="text"><br><br> The text has been copied. <br>'+
			'You don\'t have to write the title text, just paste it from the clipboard. Not like last time. ;-)',
		confirmButtonText: 'OK',
		didOpen: setPopupStyle("darkgoldenrod"),
		preConfirm: () => {
			const input = Swal.getPopup().querySelector('input');
			if (input.value !== text) {
				Swal.showValidationMessage('Please get the admin to you immediately, that is David.');
			}
			return { value: input.value };
		},
		})
		.then((result) => {
			if (! result.isConfirmed) {
				alert('Please reload the page to test Copying.');
			}
		})
		.catch((err) => {
			alert(err);
		});
	}
}

function healthyAdvice() {
	let foods = ['🍎 Apple', '🍐 Pear', '🍊 Tangerine', '🍋 Lemon', '🍌 Banana', '🍉 Watermelon', '🍇 Grapes', '🍓 Strawberries', '💙 Blueberries', '🍈 Melon', '🍒 Cherries', '🍑 Peach', '🥭 Mango', '🍍 Pineapple', '🥥 Coconut', '🥝 Kiwi', '🍆 Aubergine', '🥑 Avocado', '🥦 Broccoli', '🥬 Leafy Vegetables', '🥒 Cucumber', '🌶 Chilli', '🥕 Carrots', '🍸 Olives', '🥚 Eggs', '🥗 Green Salad', '🍛 Curried Rice', '🌰 Chestnut', '🍵 Herbal Tea', '🍯 Honey'];
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

const INTERVAL_DURATION = 30 * 60 * 1000;

// Erstellen einer Funktion, die das erste Interval-Set auslöst
function setFirstInterval() {
	setTimeout(() => {
		healthyAdvice();
		setInterval(healthyAdvice, INTERVAL_DURATION);
	}, INTERVAL_DURATION - (Date.now() % INTERVAL_DURATION));
}

setFirstInterval(); // Aufruf, um den gesamten Prozess zu starten