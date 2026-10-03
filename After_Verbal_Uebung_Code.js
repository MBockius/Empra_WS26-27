const trialFrame = document.getElementById("trial_frame");
trialFrame.style.top = '0';
trialFrame.style.left = '0';
trialFrame.style.width = "100%";
trialFrame.style.height = "100%";
trialFrame.style.display = "flex";
trialFrame.style.flexDirection = "column";
trialFrame.style.position = "relative";
trialFrame.style.textAlign = "center";
trialFrame.style.alignItems = "center";

const weiterButton = document.getElementById("SurveySubmitButtonElement");
weiterButton.style.display = 'none';
weiterButton.addEventListener('click', function() {
$('form').submit();
});

document.getElementById('dropdownMenuDivider')?.style?.setProperty('display', 'none');
document.querySelector('.take-survey-header').style.display = 'none';
document.querySelector('.survey-submit-wrapper').style.display = 'none';

let measurementAllowed = false;
let measurementDone = false;
let isKeyDown = false;
let stepCounter = 0;
let endReached = false;
let skipAllowed = false;
let experimentActive = true;
let verbalEstimateActive = false;
let currentVideoEndedHandler = null;
let measurementStartTimeout = null;

const exercise2VideoUrl = 'https://fernuni-hagen.sciebo.de/s/nRV15DpZcTs8DrY/download';
const exercise3VideoUrl = 'https://fernuni-hagen.sciebo.de/s/31DHAH2cVItybIb/download';

function addFrame(id, position) {
const frame = document.createElement("div");
frame.id = id;
frame.className = "frame";
Object.assign(frame.style, position);
trialFrame.appendChild(frame);
}

addFrame("frameTop", { top: 0, left: 0, width: "100vw", height: "1cm" });
addFrame("frameBottom", { bottom: 0, left: 0, width: "100vw", height: "1cm" });
addFrame("frameLeft", { top: 0, left: 0, width: "1cm", height: "100vh" });
addFrame("frameRight", { top: 0, right: 0, width: "1cm", height: "100vh" });

const frameElements = trialFrame.getElementsByClassName('frame');

for (let i = 0; i < frameElements.length; i++) {
frameElements[i].style.zIndex = 15;
frameElements[i].style.position = "fixed";
frameElements[i].style.pointerEvents = "none";
frameElements[i].style.backgroundColor = 'grey';
}

function setFrameColor(color) {
for (let i = 0; i < frameElements.length; i++) {
frameElements[i].style.backgroundColor = color;
}
}

function setFrameZIndex(zIndex) {
for (let i = 0; i < frameElements.length; i++) {
frameElements[i].style.zIndex = zIndex;
}
}

const whiteOverlay = document.createElement('div');
whiteOverlay.id = 'whiteOverlay';
whiteOverlay.style.position = 'fixed';
whiteOverlay.style.top = '0';
whiteOverlay.style.left = '0';
whiteOverlay.style.width = '100%';
whiteOverlay.style.height = '100%';
whiteOverlay.style.backgroundColor = 'white';
whiteOverlay.style.zIndex = 10;
trialFrame.appendChild(whiteOverlay);

const fix = document.createElement('div');
fix.id = 'fix';

const img = document.createElement('img');
img.src = 'https://fernuni-hagen.sciebo.de/s/bnfSkMaKDTCAPjZ/download';
img.alt = 'Fixationskreuz';
fix.appendChild(img);

fix.style.zIndex = 20;
fix.style.position = 'fixed';
fix.style.top = '50%';
fix.style.left = '50%';
fix.style.transform = 'translate(-50%, -50%)';
trialFrame.appendChild(fix);

const nextVideoInst = document.createElement('div');
nextVideoInst.id = "nextVideoInst";
nextVideoInst.style.zIndex = 5;
trialFrame.appendChild(nextVideoInst);

const midVideoInst = document.createElement('div');
midVideoInst.id = "midVideoInst";
midVideoInst.style.zIndex = 5;
midVideoInst.style.position = 'fixed';
midVideoInst.style.top = '50%';
midVideoInst.style.left = '50%';
midVideoInst.style.transform = 'translate(-50%, -50%)';
trialFrame.appendChild(midVideoInst);

const buttonContainer = document.createElement('div');
buttonContainer.id = "buttonContainer";
buttonContainer.style.zIndex = 10;
buttonContainer.style.display = "flex";
buttonContainer.style.position = "relative";
trialFrame.appendChild(buttonContainer);

const buttonRepeat = document.createElement('button');
buttonRepeat.id = "buttonRepeat";
buttonRepeat.style.margin = "10px";
buttonRepeat.innerText = "Wiederholen";
buttonContainer.appendChild(buttonRepeat);

const buttonContinue = document.createElement('button');
buttonContinue.id = "buttonContinue";
buttonContinue.style.margin = "10px";
buttonContinue.innerText = "Weiter";
buttonContainer.appendChild(buttonContinue);

const video = document.createElement('video');
video.id = 'video';
video.muted = true;
video.playsInline = true;
video.preload = "auto";
video.style.display = "none";
video.style.position = "fixed";
video.style.zIndex = 50;
video.style.top = '0';
video.style.left = '0';
video.style.width = '100%';
video.style.height = '100%';
video.style.objectFit = 'cover';
trialFrame.appendChild(video);

const source = document.createElement('source');
source.type = 'video/mp4';
video.appendChild(source);

const instruction1a = document.querySelector('.Instruction1a').innerHTML;
const instruction1b = document.querySelector('.Instruction1b').innerHTML;
const instruction2 = document.querySelector('.Instruction2').innerHTML;
const instruction3 = document.querySelector('.Instruction3').innerHTML;
const instruction4 = document.querySelector('.Instruction4').innerHTML;

function instruction1NextPage(event) {
if (!experimentActive) return;

if (event.key === 'Enter') {
nextVideoInst.innerHTML = instruction1b;
skipAllowed = true;
document.removeEventListener('keydown', instruction1NextPage);
}
}

function resetState() {
buttonContainer.style.zIndex = 10;
endReached = false;
}

function resetMeasurementState() {
verbalEstimateActive = false;
measurementAllowed = false;
measurementDone = false;
isKeyDown = false;

if (measurementStartTimeout) {
clearTimeout(measurementStartTimeout);
measurementStartTimeout = null;
}

video.pause();
video.currentTime = 0;
video.style.display = "none";
setFrameColor('grey');
midVideoInst.innerHTML = "";
}

function clearEndedHandler() {
if (currentVideoEndedHandler) {
video.removeEventListener('ended', currentVideoEndedHandler);
currentVideoEndedHandler = null;
}
}

function continueExperiment() {
stepCounter = (stepCounter < 9) ? stepCounter + 1 : 0;

if (!endReached) {
experiment(stepCounter);
}
}

function showVerbalEstimate() {
verbalEstimateActive = true;
skipAllowed = false;
midVideoInst.style.zIndex = 80;

midVideoInst.innerHTML =
'<p><strong>Wie lange dauerte das zuvor gesehene Video?</strong></p>' +
'<p>Bitte geben Sie die Dauer des Videos in Sekunden, auf eine Nachkommastelle genau, an.</p>' +
'<input id="practiceVerbalInput" type="text" inputmode="decimal" autocomplete="off" style="display:block;margin:12px auto;padding:10px;width:180px;font-size:22px;text-align:center">' +
'<p id="practiceVerbalError" style="color:#a11717;min-height:1.5em"></p>';

document.getElementById('practiceVerbalInput').focus();
}

function acceptVerbalEstimate() {
if (!verbalEstimateActive) return;

const input = document.getElementById('practiceVerbalInput');
const error = document.getElementById('practiceVerbalError');
const entry = input.value.trim();

if (!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(entry) ||
Number(entry.replace(',', '.')) <= 0) {
error.textContent = 'Bitte geben Sie eine Zahl größer als 0 ein.';
input.focus();
return;
}

verbalEstimateActive = false;
midVideoInst.innerHTML = '';
midVideoInst.style.zIndex = 10;
setTimeout(continueExperiment, 2000);
}

function finishVideoExercise() {
measurementAllowed = true;
measurementDone = false;
isKeyDown = false;
setFrameColor('yellow');
midVideoInst.style.zIndex = 70;

if (stepCounter === 5) {
midVideoInst.textContent =
"Der Rahmen ist jetzt gelb! Drücken und halten Sie die Leertaste für 4 Sekunden.";
} else {
midVideoInst.textContent = "";
}

skipAllowed = false;
}

function attachEndedHandler() {
clearEndedHandler();

currentVideoEndedHandler = function() {
video.style.display = "none";
whiteOverlay.style.zIndex = 60;
setFrameColor('grey');
midVideoInst.style.zIndex = 70;

if (stepCounter === 5) {
midVideoInst.textContent = "Beobachten Sie den Rahmen.";
} else {
midVideoInst.textContent = "";
}

const delayToYellow = (stepCounter === 8) ? 500 : 2000;
measurementStartTimeout = setTimeout(finishVideoExercise, delayToYellow);
};

video.addEventListener('ended', currentVideoEndedHandler);
}

function VideoReadyCheck(videourl) {
clearEndedHandler();
resetMeasurementState();

source.src = videourl;
nextVideoInst.textContent = "";
midVideoInst.style.zIndex = 10;
fix.style.zIndex = 70;
whiteOverlay.style.zIndex = 20;

video.load();
video.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
}

function onCanPlayThrough() {
fix.style.zIndex = 10;
whiteOverlay.style.zIndex = 40;
setFrameZIndex(70);
video.style.display = "block";
attachEndedHandler();
video.play();
}

function experiment(step) {
switch (step) {
case (0):
nextVideoInst.innerHTML = instruction1a;
document.addEventListener('keydown', instruction1NextPage);
skipAllowed = false;
whiteOverlay.style.zIndex = 60;
fix.style.zIndex = 10;
midVideoInst.style.zIndex = 10;
midVideoInst.innerHTML = "";
setFrameColor('grey');
setFrameZIndex(10);
nextVideoInst.style.zIndex = 70;
break;

case (1):
nextVideoInst.style.zIndex = 20;
midVideoInst.style.zIndex = 70;
midVideoInst.innerHTML = "";
midVideoInst.textContent = "Enter drücken, um die Übung zu starten.";
skipAllowed = true;
break;

case (2):
skipAllowed = false;
midVideoInst.style.zIndex = 70;
measurementDone = false;
setFrameZIndex(70);
midVideoInst.textContent = "Beobachten Sie den Rahmen.";

setTimeout(() => {
setFrameColor('yellow');
midVideoInst.textContent =
"Der Rahmen ist jetzt gelb! Drücken und halten Sie die Leertaste für 4 Sekunden.";
measurementAllowed = true;
}, 2000);
break;

case (3):
midVideoInst.innerHTML = "";
midVideoInst.style.zIndex = 10;
setFrameZIndex(10);
nextVideoInst.style.zIndex = 70;
nextVideoInst.innerHTML = instruction2;
skipAllowed = true;
break;

case (4):
nextVideoInst.style.zIndex = 20;
midVideoInst.style.zIndex = 70;
midVideoInst.innerHTML = "";
midVideoInst.textContent = "Enter drücken, um die Übung zu starten.";
skipAllowed = true;
break;

case (5):
setFrameZIndex(70);
skipAllowed = false;
VideoReadyCheck(exercise2VideoUrl);
break;

case (6):
nextVideoInst.style.zIndex = 70;
midVideoInst.innerHTML = "";
midVideoInst.style.zIndex = 10;
whiteOverlay.style.zIndex = 60;
fix.style.zIndex = 10;
setFrameColor('grey');
setFrameZIndex(10);
nextVideoInst.innerHTML = instruction3;
skipAllowed = true;
break;

case (7):
nextVideoInst.style.zIndex = 20;
midVideoInst.style.zIndex = 70;
midVideoInst.innerHTML = "";
midVideoInst.textContent = "Enter drücken, um die Übung zu starten.";
skipAllowed = true;
break;

case (8):
setFrameZIndex(70);
skipAllowed = false;
VideoReadyCheck(exercise3VideoUrl);
break;

case (9):
skipAllowed = false;
endReached = true;
nextVideoInst.innerHTML = instruction4;
buttonContainer.style.zIndex = 90;

buttonRepeat.onclick = function(event) {
event.preventDefault();
resetState();
resetMeasurementState();
clearEndedHandler();
stepCounter = 0;
skipAllowed = true;
experiment(stepCounter);
};

buttonContinue.onclick = function(event) {
event.preventDefault();
experimentActive = false;
resetState();
weiterButton.click();
};

whiteOverlay.style.zIndex = 70;
nextVideoInst.style.zIndex = 70;
midVideoInst.innerHTML = "";
setFrameZIndex(10);
break;
}
}

document.addEventListener("keydown", function(event) {
if (!experimentActive) return;

if (event.code === "Enter" && event.repeat) {
event.preventDefault();
return;
}

if (verbalEstimateActive) {
if (event.code === "Enter" || event.code === "Space") {
event.preventDefault();
}

if (event.code === "Enter") {
acceptVerbalEstimate();
}

return;
}

if (event.code === "Space" || event.code === "Enter") {
event.preventDefault();
}

if (
event.code === "Space" &&
stepCounter === 2 &&
measurementAllowed &&
!measurementDone &&
!isKeyDown
) {
setFrameColor('green');
midVideoInst.textContent =
"Der Rahmen bleibt grün, so lange Sie die Leertaste gedrückt halten.";
isKeyDown = true;
}

if (
event.code === "Space" &&
(stepCounter === 5 || stepCounter === 8) &&
measurementAllowed &&
!measurementDone &&
!isKeyDown
) {
setFrameColor('green');

if (stepCounter === 5) {
midVideoInst.textContent =
"Der Rahmen bleibt grün, so lange Sie die Leertaste gedrückt halten.";
} else {
midVideoInst.textContent = "";
}

isKeyDown = true;
}

if (event.code === "Enter" && skipAllowed) {
continueExperiment();
}
});

document.addEventListener("keyup", function(event) {
if (!experimentActive) return;

if (
event.code === "Space" &&
stepCounter === 2 &&
measurementAllowed &&
!measurementDone &&
isKeyDown
) {
setFrameColor('grey');
midVideoInst.innerHTML = "";
measurementDone = true;
measurementAllowed = false;
isKeyDown = false;
skipAllowed = true;

setTimeout(() => {
if (skipAllowed === true) {
continueExperiment();
}
}, 2000);
}

if (
event.code === "Space" &&
(stepCounter === 5 || stepCounter === 8) &&
measurementAllowed &&
!measurementDone &&
isKeyDown
) {
setFrameColor('grey');
measurementDone = true;
measurementAllowed = false;
isKeyDown = false;
showVerbalEstimate();
}
});

experiment(stepCounter);
