// content.js

let activeAudio = null;
let isPermissionGranted = false;
let isLooping = true;
function createPermissionButton() {
	const buttonDiv = document.createElement("div");
	buttonDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
    `;

	const permissionButton = document.createElement("button");
	permissionButton.textContent = "Enable Audio Alerts";
	permissionButton.style.cssText = `
        background: #ff4444;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

	permissionButton.onclick = async () => {
		isPermissionGranted = true;
		document.body.removeChild(buttonDiv);
		console.log("Audio permission granted");
	};

	buttonDiv.appendChild(permissionButton);
	document.body.appendChild(buttonDiv);
}

function createStopButton() {
	const buttonDiv = document.createElement("div");
	buttonDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
    `;

	const permissionButton = document.createElement("button");
	permissionButton.id = "STOP";
	permissionButton.textContent = "STOP ALARM";
	permissionButton.style.cssText = `
        background: #ff4444;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

	permissionButton.onclick = async () => {
		console.log("Button Stopped");
	};

	buttonDiv.appendChild(permissionButton);
	document.body.appendChild(buttonDiv);
}

async function playAlarm() {
	console.log("CALLED");
	if (!isPermissionGranted) return null;

	console.log("PLAYING");

	// Create new audio instance
	const audioURL = chrome.runtime.getURL("alarm.mp3");
	const audio = new Audio(audioURL);

	// Set up audio to loop on ended event
	createStopButton();
	audio.currentTime = 0;
	audio.loop = true;
	audio.play();
	const btn = document.getElementById("STOP");
	btn.addEventListener("click", () => {
		audio.loop = false; // End the loop
		audio.pause(); // Immediately stop the audio
		audio.currentTime = 0; // Optional: reset playback position
		btn.remove();
	});
	return;
}

let lastInnerHTML = null;

createPermissionButton();

const intervalId = setInterval(async () => {
	const targetElement = document.querySelector(
		"h1.component-response-header__title"
	);
	console.log("CHECKING");
	if (targetElement) {
		const currentInnerHTML = targetElement.innerHTML;

		if (lastInnerHTML === null || currentInnerHTML !== lastInnerHTML) {
			console.log("Content changed - triggering alarm");
			await playAlarm();
		}

		lastInnerHTML = currentInnerHTML;
	}
}, 2000);

window.addEventListener("unload", () => {
	clearInterval(intervalId);
});
