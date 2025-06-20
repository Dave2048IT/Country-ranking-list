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

	const original = [...countries];

	// Points assigned for each rank (1st to 10th place)
	const POINTS_FOR_RANK = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];

	const rankedCountries = countries
		.sort((a, b) => b.score - a.score)
		.slice(0, 12)
		.map(({ name, score }, i) =>
		`<span>${i + 1}<sup>${getOrdinal(i + 1)}</sup> : ${name} → ${i < POINTS_FOR_RANK.length ? POINTS_FOR_RANK[i] : 0} P.</span>`
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
		rankedCountries.splice(12, 0, null);
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

	if (idx != -1 && countries[countryCount - 2].score === 0) {
		Swal.fire({
		title: "Please give points to all countries except yours.",
		icon: "warning",
		background: "darkgoldenrod",
		didOpen: () => {
			document.querySelector(".swal2-title").style.color = "white";
		},
		});
	}

	const duplicatesText = findDuplicateIndexes(original);

	if (duplicatesText) {
		Swal.fire({
			title: "Warning",
			html: `Duplicate scores found for countries:<br>${duplicatesText}`,
			icon: "warning",
			background: "darkgoldenrod",
		});
	} else {
		Swal.fire({
			title: "Successfully calculated.",
			text: "Scroll down to see more",
			icon: "success",
			didOpen: setPopupStyle("green")
		});
	}

	const myText = rankedCountries.join("<br>");
	ranking.innerHTML = `${myText}`;
	console.log("Sum of all countries:", sumOfScores);
	console.log(`Ranked in ${(performance.now() - ms).toFixed(1)} ms`);
	return original;
}

function findDuplicateIndexes(arr) {
	const scoreMap = new Map();  // Map zum Speichern der Indizes für jeden Score
	let result = '';  // Variable für die formatierten Ergebnisse
	
	// Durchlaufe das Array und speichere die Indizes der Scores
	arr.forEach((item, index) => {
	  const score = item.score;
	  if (!scoreMap.has(score)) {
		scoreMap.set(score, [index + 1]);  // Initialisiere ein Array mit dem ersten Index
	  } else {
		scoreMap.get(score).push(index + 1);  // Füge zusätzliche Indizes hinzu
	  }
	});
  
	// Durchlaufe die Map und baue das Ergebnisstring nur für Duplikate
	scoreMap.forEach((indices, score) => {
	  if (indices.length > 1) {
		result += `Score: ${score} → No: ${indices.join(", No: ")}<br>`;
	  }
	});
  
	return result;
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

let saveTimeout;

function debounceAutosave(delay) {
    clearTimeout(saveTimeout); // Verhindert, dass ein vorheriger Timer ausgeführt wird
    saveTimeout = setTimeout(() => saveScores(2), delay); // Setzt einen neuen Timer
}

function myCreateCountry(i) {
	const flagDiv = document.createElement('div');
	flagDiv.id = `flagDiv${i}`;
	flagDiv.classList.add('ctryDivs');
	flagDiv.style.backgroundImage = `url(https://cdn.countryflags.com/thumbs/${ctry_names[i]}/flag-400.png)`;
	
	// const nameText = document.createElement('span');
    // nameText.innerText = countries[i]; // Setze den Namen des Landes als Text

	const nameInput = createInputElement('name', i, 'text', countries[i]);
	const scoreInput = createInputElement('score', i, 'number', 0, 10);
	const sliderInput = createInputElement('range', i, 'range', 0);
	nameInput.classList.add('myNameInputs');
	scoreInput.classList.add('myScoreInputs');
	sliderInput.classList.add('sliders');

	const syncInputs = (event) => {
		if (event.target === sliderInput) {
			scoreInput.value = sliderInput.value;
		} else {
			sliderInput.value = scoreInput.value;
		}
		if (autosave1) {
			debounceAutosave(2000);
		}
	};

	sliderInput.addEventListener('input', syncInputs);
	scoreInput.addEventListener('input', syncInputs);

	// Erstellen der Info-Knöpfe
	const createInfoButton = (country, fact) => {
		const button = document.createElement('button');
		button.innerHTML = '<i class="info-icon">i</i>';
		button.classList.add('info-button');
		button.addEventListener('click', () => showFact(country, fact));

		return button;
	};

	const infoButton1 = createInfoButton(countries[i], 0);
	const infoButton2 = createInfoButton(countries[i], 1);

	const countryDiv = document.createElement('div');
	const info_div = document.createElement('div');
	const hr = document.createElement('hr');
	const br1 = document.createElement('br');
	
	const label = document.createTextNode(`Country ${i + 1}: `);
	const textArea = createTextAreaElement(`Memo for ${countries[i]}:`);

	// Erstellen eines Containers für die Knöpfe
	const buttonContainer = document.createElement('div');
	buttonContainer.classList.add('button-container');
	info_div.append(infoButton1, br1, infoButton2);
	buttonContainer.append(flagDiv, info_div);

	const fragment = document.createDocumentFragment();
	fragment.append(hr, label, nameInput, buttonContainer, scoreInput, ' Points', sliderInput, textArea);

	countryDiv.appendChild(fragment);
	myMenu.appendChild(countryDiv);
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

/**
 * 
 * @param {number} op 1 => normal / 2 => for autosaving (faster) 
 */
function saveScores(op = 1) {
	console.log("Speichern ...", op);
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
		
		let scoreIndex = 0;

		for (let i = 0; i < countryCount; i++) {
			try {
				// Hole die entsprechenden Eingabefelder über IDs oder andere Selektoren
				const nameInput = document.getElementById(`name${i}`);
				const scoreInput = document.getElementById(`score${i}`);
				const sliderInput = document.getElementById(`range${i}`);
				
				// Sicherstellen, dass die Eingabefelder existieren
				if (!nameInput || !scoreInput || !sliderInput) {
					console.warn(`One or more elements for Country Nr. ${i + 1} are missing.`);
					continue; // Gehe zum nächsten Land, wenn eines der Elemente fehlt
				}

				if (scoreIndex >= storedScores.length) {
					console.warn(`No more scores available in storedScores.`);
					break; // Breche die Schleife ab, wenn keine weiteren Scores mehr verfügbar sind
				}		
				
				// Werte aus storedScores extrahieren
				const { name = "", score = 0 } = storedScores[scoreIndex] || {};
				
				// Setze die Werte für die Eingabefelder
				nameInput.value = name;
				scoreInput.value = score;
				sliderInput.value = score;
				
				scoreIndex++;
			}
			catch (error) {
				console.error(`Error at Country Nr. ${i + 1}:`, error);
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
			text: `Top ${topCountries} was copied. Now you can send it to Franz ;-)`,
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

	let textToCopy = `My Country is: ${selected_ctry}\n\n${rankingText.split('13th')[0].trim()}\n\n`
	if (ratingShow.value - 0)
		textToCopy += `I gave the Show: ${ratingShow.value} / 5 Stars.\n`;
	
	if (ratingSite.value - 0)
		textToCopy += `I gave David's Website: ${ratingSite.value} / 5 Hearts.\n`;

	if (navigator.clipboard) {
		navigator.clipboard.writeText(textToCopy)
		.then(() => {
			Swal.fire({
			title: "Success!",
			text: `Top ${topCountries} was copied. Now you can send it to Franz ;-)`,
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
				console.info("Hmmm, copying not possible ...");
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
			console.info("Ouch. Copying not possible ...");
		}
		});
	}
}

const rankingEl = document.querySelector('#ranking');

let countryCount = countries.length;
let topCountries = Math.min(countryCount - 1, 12);

if (!navigator.onLine)
	alert("Sorry, without internet you can't use the page, because I built in libraries to make the whole page more beautiful. ;-)");

function autoload() {
	// Wenn mehr als 1 Tag vergangen ist, dann nicht laden.
	if ("ctry_scores" in localStorage && Date.now() - localStorage.getItem("ctry_timestamp") < 86400000) {
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
			const defaultScore = Number(result.value) || 0; // Umwandlung in eine Zahl
			document.querySelectorAll('.myScoreInputs, .sliders').forEach(input => {
				input.value = defaultScore;
			});
			console.log(`Selected score value is ${defaultScore}`);
		}
		show2ndSwalPopup();
	});
}

function show2ndSwalPopup() {
	if (autoload())
		return;

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

let selected_ctry;
const ctry_names = [];
const ctry_scores = [];
const two_thirds_of_ctrys = countryCount < 15 ? countryCount : countryCount / 3 * 2 | 0;

var autosave1 = false;
generateFlags();

var os_platform = navigator.platform || "mystery device";
if (/android/i.test(os_platform)) {
	console.log("Der Browser wird auf einem Android-Gerät ausgeführt.");
} else if (/iPad|iPhone|iPod/.test(os_platform)) {
	console.log("Der Browser wird auf einem iOS-Gerät ausgeführt.");
}

function confirmSelection(countryIndex, countryName) {
    Swal.fire({
        title: `Do you want to choose ${countryName}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, choose!',
        cancelButtonText: 'No, cancel',
        background: 'darkgoldenrod',
		didOpen: () => {
			document.querySelector(".swal2-title").style.color = "white";
		}
    }).then((result) => {
        if (result.isConfirmed) {
			selected_ctry = countryName;
            console.log(`Selected country: ${countryName} (Index: ${countryIndex})`);
			generateCountries(countryIndex);
        }
    });
}

function generateFlags() {
	var flagSelection = document.getElementById("flagSelection");

	// Die Länder-Array-Liste wird hier angenommen
	countries.push("I'm just a guest");

	// for (var i = 0; i < countryCount + 1; i++) {
	countries.forEach((countryName, i) => {
		let ctry = countryName === 'USA' ? 'united-states-of-america' : countryName.toLowerCase().replace(/ /g, '-');

		// Erstelle das Flaggen-Container-Element
		var flagDiv = document.createElement("div");
		flagDiv.className = "flag";
		flagDiv.dataset.countryIndex = i + 1; // Speichert den Index im Data-Attribut

		if (countryName === "I'm just a guest") {
			// Nur Text für den letzten Eintrag
			flagDiv.classList.add('guest'); // Optional: für spezielles Styling
			flagDiv.innerHTML = `<span>${i + 1}: ${countryName}</span>`;
		} else {
			// Füge das Bild der Flagge hinzu
			var flagImg = document.createElement("img");
			flagImg.src = `https://cdn.countryflags.com/thumbs/${ctry}/flag-400.png`; // Verwende den formatierten Namen für die Bild-URL
			flagDiv.appendChild(flagImg);
	
			// Setze den Text mit Landname und Rang
			var flagText = document.createElement("span");
			flagText.innerHTML = `${i + 1}: ${countryName}`;
			flagDiv.appendChild(flagText);
		}	

		// Füge ein Klick-Event hinzu, das die Auswahl bestätigt
		flagDiv.onclick = function() {
			confirmSelection(this.dataset.countryIndex, countryName);
		};

		// Füge das Flaggen-Div in den Flaggen-Container ein
		flagSelection.appendChild(flagDiv);
	});

	countries.pop();
}

function generateCountries(countryIndex) {
	if (countryIndex === 0) {
		alert("Please choose your Country.");
		return;
	}
	var ms = performance.now();
	selectArea.style.display = "none";
	if (topCountries < 12)
		btnTop10.innerText = `Copy Top ${topCountries} Countries`;

	for (let i = 0; i < countryCount; i++) {
		const country = countries[i];
		const name = country === 'USA' ? 'united-states-of-america' : country.toLowerCase().replace(/ /g, '-');
	
		ctry_names.push(name);
		ctry_scores.push([country, 0]);

		if (i === two_thirds_of_ctrys || i === (two_thirds_of_ctrys / 2 | 0)) {
			const breakDiv = document.createElement('div');
			breakDiv.className = 'intvActs';
			breakDiv.textContent = "Interval Act (5 Min. Break) 🎸🍵🫖";
			myMenu.appendChild(document.createElement('hr'));
			myMenu.appendChild(breakDiv);
		}

		if (i === countryIndex - 1) {
			const flagDiv = document.createElement('div');
			flagDiv.textContent = "Now you just listen. For 🎸 " + countries[i];
			myMenu.appendChild(document.createElement('hr'));
			myMenu.appendChild(flagDiv);
			continue;
		}

		myCreateCountry(i);
	}
	show2ndSwalPopup();
	btnRank.style.display = "inline";
	btnTop10.style.display = "inline";

	console.log(`Generated in ${(performance.now() - ms).toFixed(1)} ms`);
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

function factsToArray(facts) {
	let output = "";
	facts.forEach((el, idx) => {
		if (facts[idx].startsWith("###"))
			output += `// ${el}\n`;
		else
			output += `{q: "${el}"},\n`;
	});
	console.log(output);
	return output;
}

var itv1 = null;
const INTERVAL_DURATION = 10 * 60 * 1000;

// Erstellen einer Funktion, die das erste Interval-Set auslöst
function setFirstInterval() {
	setTimeout(() => {
		showFact();
		itv1 = setInterval(showFact, INTERVAL_DURATION);
	}, INTERVAL_DURATION - (Date.now() % INTERVAL_DURATION));
}

// setFirstInterval();