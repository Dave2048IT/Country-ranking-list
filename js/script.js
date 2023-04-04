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


const testConnectionSpeed = {
	sourceAddr: "https://cdn.jsdelivr.net/npm/sweetalert2@11.0.19/dist/sweetalert2.all.min.js",
	downloadSize: 18501,

	// Function to test connection speed
	test: async function() {
		try {
			const startTime = performance.now();
			const response = await fetch(this.sourceAddr, { method: 'HEAD', mode: 'no-cors' });
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

function calc() {
	const ms = performance.now();
	const ordinalEnds = ["st", "nd", "rd"];
	const pts = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
	const clones = [];
	let myText = "";
	let cloned = false;
	
	Array.from({ length: countryCount }).forEach((_, i) => {
		ctry_scores[i][0] = window[`name${i}`].value;
		ctry_scores[i][1] = parseInt(window[`score${i}`].value);
	});
	
	const sorted = [...ctry_scores].sort((a, b) => b[1] - a[1]);
	const ranks = sorted.map(v => ctry_scores.indexOf(v) + 1);
	
	console.log("sorted", sorted);
	console.log("ranks", ranks);
	
	sorted.forEach((country, i) => {
		if (!cloned && i < countryCount - 1 && country[1] == sorted[i + 1][1]) {
			clones.push(ranks[i], ranks[i + 1]);
		}
		if (i === 10) {
			myText += "<br>";
		}
		myText += `<span>${i + 1}${(i < 3 ? ordinalEnds[i] : "th")} (${(pts[i] || 0)})\t: ${country[0]} ->\t ${country[1]} P.</span><br>`;
	});
	
	if (clones.length > 0) {
		const uniqueClones = [...new Set(clones)].sort((a, b) => a - b).join(", ");
		Swal.fire({
			title: "Countries with same score",
			text: uniqueClones,
			icon: "warning",
			background: "indianred",
			didOpen: () => {
				document.querySelector('.swal2-title').style.color = "white";
			}
		});
	}

	if (sorted[countryCount - 2][1] === 0) {
		Swal.fire({
			title: "Please give points to all countries except yours.",
			icon: "warning",
			background: "darkgoldenrod",
			didOpen: () => {
				document.querySelector('.swal2-title').style.color = "white";
			}
		});
	}
	
	ranking.innerHTML = myText;
	duration.innerText = `In ${(performance.now() - ms).toFixed(1)} ms`;
}

function hasDuplicates(array) {
	return (new Set(array)).size !== array.length;
}

function myCreateCountry(i) {
	const countryDiv = document.createElement('div');
	countryDiv.id = `countryDiv${i}`;
	countryDiv.classList.add('ctryDivs');
	countryDiv.style.backgroundImage = `url(https://cdn.countryflags.com/thumbs/${ctry_names[i]}/flag-3d-250.png)`;
	
	const nameInput = createInputElement('name', i, 'text', countries[i]);
	const scoreInput = createInputElement('score', i, 'number', 0, 10);
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
	calc();
	try {
		localStorage.setItem("ctry_scores", JSON.stringify(ctry_scores));
		Swal.fire({
			title: "Score saved",
			text: "Your scores have been saved to local storage.",
			icon: "success",
			didOpen: () => {
				document.querySelector('.swal2-popup').style.backgroundColor = "orange";
				document.querySelector('.swal2-title').style.color = "white";
			}
		});
	} catch (error) {
		Swal.fire({
			title: "Failed to save score",
			text: error.message,
			icon: "error",
			didOpen: () => {
				document.querySelector('.swal2-popup').style.backgroundColor = "darkred";
				document.querySelector('.swal2-title').style.color = "white";
			}
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
			didOpen: () => {
				document.querySelector('.swal2-popup').style.backgroundColor = "darkred";
				document.querySelector('.swal2-title').style.color = "white";
			}
			});

			return null;
		}

		for (let i = 0; i < countryCount; i++) {
			window[`name${i}`].value = storedScores[i]?.[0] || "";
			window[`score${i}`].value = storedScores[i]?.[1] || 0;
		}

		Swal.fire({
			title: "Scores loaded successfully",
			icon: "success",
			didOpen: () => {
				document.querySelector('.swal2-popup').style.backgroundColor = "blue";
				document.querySelector('.swal2-title').style.color = "white";
			}
		});

		calc();

		return storedScores;
	} catch (error) {
		Swal.fire({
			title: "Failed to load scores",
			text: error.message,
			icon: "error",
			didOpen: () => {
				document.querySelector('.swal2-popup').style.backgroundColor = "darkred";
				document.querySelector('.swal2-title').style.color = "white";
			}
		});

		return null;
	}
}

function resetScores() {
	localStorage.removeItem("ctry_scores");

	Swal.fire({
		title: "Scores reset successful",
		text: "The scores have been removed from your device.",
		icon: "info",
		didOpen: () => {
			document.querySelector('.swal2-popup').style.backgroundColor = "darkslategrey";
			document.querySelector('.swal2-title').style.color = "white";
		}
		
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
			title: 'Copying not possible',
			text: 'Because Flash is not installed or disabled in your browser...',
			footer: 'But anyway. Please try again. If in doubt, hold and drag the text and select Copy.',
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
			didOpen: () => {
			const popupEl = document.querySelector('.swal2-popup');
			const titleEl = document.querySelector('.swal2-title');
			popupEl.style.backgroundColor = "green";
			titleEl.style.color = "white";
			}
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
		didOpen: () => {
			const popupEl = document.querySelector('.swal2-popup');
			const titleEl = document.querySelector('.swal2-title');
			popupEl.style.backgroundColor = "darkred";
			titleEl.style.color = "white";
		}
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
		didOpen: () => {
			const popupEl = document.querySelector('.swal2-popup');
			const titleEl = document.querySelector('.swal2-title');
			popupEl.style.backgroundColor = "darkorchid";
			titleEl.style.color = "white";
		}
		});
		return;
	}

	const textToCopy = `My Country: ${countryPutEl.value}\n\n${rankingText.split('11th')[0].trim()}`;

	if (navigator.clipboard) {
		navigator.clipboard.writeText(textToCopy)
		.then(() => {
			Swal.fire({
			title: "Success!",
			text: "Top 10 was copied. Now you can send it to Franz ;-)",
			icon: "success",
			didOpen: () => {
				const popupEl = document.querySelector('.swal2-popup');
				const titleEl = document.querySelector('.swal2-title');
				popupEl.style.backgroundColor = "green";
				titleEl.style.color = "white";
			}
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
	text: 'Whatever number you like',
	input: 'number',
	inputValue: 0,
	confirmButtonText: 'Set Default',
	background: 'cornflowerblue',
	customClass: {
		input: 'swal2-input-modified'
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
		didOpen: () => {
			document.querySelector('.custom-swal-popup').style.backgroundColor = bgColor;
			document.querySelector('.custom-swal-title').style.color = "white";
		},
		timer: 4000
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
		didOpen: () => {
			document.querySelector('.custom-swal-popup').style.backgroundColor = "darkblue";
			document.querySelector('.custom-swal-title').style.color = "white";
		}
	});
}

var ms = performance.now();

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

function remindToDrink() {
	Swal.fire({
		title: 'Tea time!',
		text: 'Did you drink enough herbal tea or water?',
		footer: `And have fun with your ${os_platform} device ;-)`,
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
		remindToDrink();
		setInterval(remindToDrink, INTERVAL_DURATION);
	}, INTERVAL_DURATION - (Date.now() % INTERVAL_DURATION));
}

setFirstInterval(); // Aufruf, um den gesamten Prozess zu starten