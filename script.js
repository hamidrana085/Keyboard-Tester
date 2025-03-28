// Variables
const inputEl = document.querySelector(".input"); // Dark mode toggle
const bodyEl = document.querySelector("body");
const circleEl = document.querySelector(".circle"); // Dark mode toggle circle
const cursorInnerEl = document.querySelector(".cursor-inner");
const cursorOuterEl = document.querySelector(".cursor-outer");

// Reading dark mode status from localstorage
inputEl.checked = JSON.parse(localStorage.getItem("dark-mode"));

// For updating the styles and memory mode when the page loads
updateBodyOnLoad();

// For updating the styles based on the dark-mode status
function updateBodyOnLoad() {
	if (inputEl.checked) {
		circleEl.style.transform = "translateX(40px)";
		bodyEl.style.backgroundColor = "black";
		cursorInnerEl.style.backgroundColor = "white";
		cursorOuterEl.style.outlineColor = "rgba(255, 255, 255, 0.5)";
	} else {
		circleEl.style.transform = "translateX(0)";
		bodyEl.style.backgroundColor = "white";
		cursorInnerEl.style.backgroundColor = "rgb(58, 58, 58)";
		cursorOuterEl.style.outlineColor = "rgba(90, 90, 90, 0.5)";
	}
}

// For updating the body everytime the user toggles the dark mode
function updateBody() {
	if (inputEl.checked) {
		circleEl.style.animation = "toggleOn 0.4s forwards";
		bodyEl.style.backgroundColor = "black";
		cursorInnerEl.style.backgroundColor = "white";
		cursorOuterEl.style.outlineColor = "rgba(255, 255, 255, 0.5)";
		if (memoryModeOn) {
			// This is so that the buttons that are clicked while the memory mode is on, also changes styles
			for (i = 0; i < pressedButtons.length; i++) {
				const styleEl = document.querySelector(`${pressedButtons[i]}`);
				darkMode(styleEl);
			}
		}
	} else {
		circleEl.style.animation = "toggleOff 0.4s forwards";
		bodyEl.style.backgroundColor = "white";
		cursorInnerEl.style.backgroundColor = "rgb(58, 58, 58)";
		cursorOuterEl.style.outlineColor = "rgba(90, 90, 90, 0.5)";
		if (memoryModeOn) {
			// Same as above
			for (i = 0; i < pressedButtons.length; i++) {
				const styleEl = document.querySelector(`${pressedButtons[i]}`);
				lightMode(styleEl);
			}
		}
	}
}

// Click sound function
function playSound() {
	const pressedSound = new Audio("button-press.mp3");
	pressedSound.play();
}

// Individual button dark mode function
function darkMode(pressedEl) {
	pressedEl.style.color = "black";
	pressedEl.style.backgroundColor = "white";
	pressedEl.style.borderColor = "white";
}

// Individual button light mode function
function lightMode(pressedEl) {
	pressedEl.style.color = "white";
	pressedEl.style.backgroundColor = "black";
	pressedEl.style.borderColor = "black";
}

// LocalStorage function
function updateLocalStorage() {
	localStorage.setItem("dark-mode", JSON.stringify(inputEl.checked));
	localStorage.setItem("memory-mode", JSON.stringify(inputMemoryEl.checked));
}

// Upon clicking the dark mode toggle, this updates the styles and localstorage
inputEl.addEventListener("input", () => {
	updateBody();
	updateLocalStorage();
});

// Memory mode toggle variables
const inputMemoryEl = document.querySelector(".input-memory");
const circleMemoryEl = document.querySelector(".circle-memory");

// Reading memory mode status from localstorage
inputMemoryEl.checked = JSON.parse(localStorage.getItem("memory-mode"));

// This is so that the toggle circle position stays as "ON" if the memory toggle is checked when the page loads
function updateBodyOnLoadMemory() {
	if (inputMemoryEl.checked) {
		circleMemoryEl.style.transform = "translateX(40px)";
		memoryModeOn = true;
	} else {
		circleMemoryEl.style.transform = "translateX(0)";
		memoryModeOn = false;
	}
}

// Memory toggle circle animation
function updateBodyMemory() {
	if (inputMemoryEl.checked) {
		circleMemoryEl.style.animation = "toggleOn 0.4s forwards";
		memoryModeOn = true;
	} else {
		circleMemoryEl.style.animation = "toggleOff 0.4s forwards";
		memoryModeOn = false;
	}
}

updateBodyOnLoadMemory();

// Toggle listener of memory mode
inputMemoryEl.addEventListener("input", () => {
	updateBodyMemory();
	updateLocalStorage();
	removeAllStyles();
});

// For storing all the button keycodes that are clicked when memory mode is "ON"
let pressedButtons = [];

function removeAllStyles() {
	for (i = 0; i < pressedButtons.length; i++) {
		const removeEl = document.querySelector(`${pressedButtons[i]}`); // Stores each of the keys that were clicked when memory mode was "ON"
		removeStyles(removeEl); // Removes styles from every one of them
	}
	pressedButtons = []; // Clears the array
}

// Checking for key events on the body. The main function of the tester
document.addEventListener("keydown", (event) => {
	playSound(); // To the click sound each time a key is pressed
	const key = CSS.escape(event.code).toLowerCase();
	if (
		key === "f1" ||
		key === "f3" ||
		key === "f5" ||
		key === "f6" ||
		key === "f7" ||
		key === "f10" ||
		key === "f11" ||
		key === "f12" ||
		key === "tab" ||
		key === "altleft" ||
		key === "altright"
	) {
		event.preventDefault(); // Preventing those keys to act like they were intended to
	}
	const pressedEl = document.querySelector(`.class-${key}`);
	// To invert the styles of the pressed key. That's what happens when you click a key
	if (inputEl.checked) {
		darkMode(pressedEl);
	} else {
		lightMode(pressedEl);
	}

	const keyReleased = (e) => {
		if (e.code === event.code) {
			// Checking if the key we're working with has been released
			if (!memoryModeOn) {
				// If memory mode is "OFF", remove the styles after 150ms
				setTimeout(() => {
					removeStyles(pressedEl);
				}, 150);
			} else if (!pressedButtons.includes(`.class-${key}`)) {
				pressedButtons.push(`.class-${key}`); // Else if, the clicked button already doesn't exist inside the "pressedButtons" array, push this button to the array
			}
		}
	};
	window.addEventListener("blur", () => {
		removeStyles(pressedEl); // To remove the styles from the pressed buttons, if used to change tab or window. CTRL+Tab for example.
		pressedButtons = []; // To clear the array
	});
	document.addEventListener("keyup", keyReleased);
});

// To remove the styles from an individual button
function removeStyles(pressedEl) {
	pressedEl.style.color = "";
	pressedEl.style.backgroundColor = "";
	pressedEl.style.borderColor = "";
}

// To disable right click context menu
document.addEventListener("contextmenu", (menu) => {
	menu.preventDefault();
});

// Cursor variables
const pageEl = document.querySelector("*");
const cursorEl = document.querySelector(".cursor");

// To show the custom cursor when the system enters the viewport
pageEl.addEventListener("mouseenter", () => {
	cursorEl.classList.remove("hidden");
});
// To hide the custom cursor when the system leaves the viewport
pageEl.addEventListener("mouseleave", () => {
	cursorEl.classList.add("hidden");
});

// To make the cursor element follow the system cursor
pageEl.addEventListener("mousemove", (cursor) => {
	const xPos = cursor.clientX;
	const yPos = cursor.clientY;

	cursorEl.style.left = xPos + "px";
	cursorEl.style.top = yPos + "px";
});
