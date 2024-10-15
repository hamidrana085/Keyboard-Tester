const inputEl = document.querySelector(".input");
const bodyEl = document.querySelector("body");
const circleEl = document.querySelector(".circle");
const cursorInnerEl = document.querySelector(".cursor-inner");
const cursorOuterEl = document.querySelector(".cursor-outer");

inputEl.checked = JSON.parse(localStorage.getItem("dark-mode"));

updateBodyOnLoad();

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
function updateBody() {
	if (inputEl.checked) {
		circleEl.style.animation = "toggleOn 0.4s forwards";
		bodyEl.style.backgroundColor = "black";
		cursorInnerEl.style.backgroundColor = "white";
		cursorOuterEl.style.outlineColor = "rgba(255, 255, 255, 0.5)";
		if (memoryModeOn) {
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
			for (i = 0; i < pressedButtons.length; i++) {
				const styleEl = document.querySelector(`${pressedButtons[i]}`);
				lightMode(styleEl);
			}
		}
	}
}
function playSound() {
	const pressedSound = new Audio("button-press.mp3");
	pressedSound.play();
}
function darkMode(pressedEl) {
	pressedEl.style.color = "black";
	pressedEl.style.backgroundColor = "white";
	pressedEl.style.borderColor = "white";
}
function lightMode(pressedEl) {
	pressedEl.style.color = "white";
	pressedEl.style.backgroundColor = "black";
	pressedEl.style.borderColor = "black";
}
function updateLocalStorage() {
	localStorage.setItem("dark-mode", JSON.stringify(inputEl.checked));
	localStorage.setItem("memory-mode", JSON.stringify(inputMemoryEl.checked));
}

inputEl.addEventListener("input", () => {
	updateBody();
	updateLocalStorage();
});

const inputMemoryEl = document.querySelector(".input-memory");
const circleMemoryEl = document.querySelector(".circle-memory");

inputMemoryEl.checked = JSON.parse(localStorage.getItem("memory-mode"));

updateBodyOnLoadMemory();

function updateBodyOnLoadMemory() {
	if (inputMemoryEl.checked) {
		circleMemoryEl.style.transform = "translateX(40px)";
		memoryModeOn = true;
	} else {
		circleMemoryEl.style.transform = "translateX(0)";
		memoryModeOn = false;
	}
}
function updateBodyMemory() {
	if (inputMemoryEl.checked) {
		circleMemoryEl.style.animation = "toggleOn 0.4s forwards";
		memoryModeOn = true;
	} else {
		circleMemoryEl.style.animation = "toggleOff 0.4s forwards";
		memoryModeOn = false;
	}
}

inputMemoryEl.addEventListener("input", () => {
	updateBodyMemory();
	updateLocalStorage();
	for (i = 0; i < pressedButtons.length; i++) {
		const removeEl = document.querySelector(`${pressedButtons[i]}`);
		removeStyles(removeEl);
	}
});

const pressedButtons = [];

document.addEventListener("keydown", (event) => {
	playSound();
	const key = CSS.escape(event.code).toLowerCase();
	if (
		key === "f1" ||
		key === "f3" ||
		key === "f5" ||
		key === "f6" ||
		key === "f10" ||
		key === "f11" ||
		key === "f12" ||
		key === "tab"
	) {
		event.preventDefault();
	}
	const pressedEl = document.querySelector(`.class-${key}`);
	if (inputEl.checked) {
		darkMode(pressedEl);
	} else {
		lightMode(pressedEl);
	}

	const keyReleased = (e) => {
		if (e.code === event.code) {
			if (!memoryModeOn) {
				setTimeout(() => {
					removeStyles(pressedEl);
				}, 150);
			} else if (!pressedButtons.includes(`.class-${key}`)) {
				pressedButtons.push(`.class-${key}`);
			}
		}
	};
	window.addEventListener("blur", () => {
		removeStyles(pressedEl);
	});

	document.addEventListener("keyup", keyReleased);
});

document.addEventListener("contextmenu", (menu) => {
	menu.preventDefault();
});

function removeStyles(pressedEl) {
	pressedEl.style.color = "";
	pressedEl.style.backgroundColor = "";
	pressedEl.style.borderColor = "";
}

const pageEl = document.querySelector("*");
const cursorEl = document.querySelector(".cursor");

pageEl.addEventListener("mouseenter", () => {
	cursorEl.classList.remove("hidden");
});
pageEl.addEventListener("mouseleave", () => {
	cursorEl.classList.add("hidden");
});

pageEl.addEventListener("mousemove", (cursor) => {
	const xPos = cursor.clientX;
	const yPos = cursor.clientY;

	cursorEl.style.left = xPos + "px";
	cursorEl.style.top = yPos + "px";
});
