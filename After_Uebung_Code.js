(() => {
    //
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

// Manipulate Submit-Button
const weiterButton = document.getElementById("SurveySubmitButtonElement");
weiterButton.style.display = 'none';
weiterButton.addEventListener('click', function() {
    $('form').submit();  // Button unsichtbar aber als Weiterleitungsmechanismus nutzbar
});

// Hide Language Button
document.getElementById('dropdownMenuDivider')?.style?.setProperty('display', 'none'); // Wenn Button existiert soll er ausgeblendet werden

// Hide Header
const quesionproHeader = document.querySelector('.take-survey-header');
quesionproHeader.style.display = 'none';

// Survey Submit Wrapper
const quesionproSurveySubmitWrapper = document.querySelector('.survey-submit-wrapper');
quesionproSurveySubmitWrapper.style.display = 'none';

/******** TRIAL CODE ********/

let measurementAllowed = false;
let measurementDone = false;
let isKeyDown = false;
let stepCounter = 0;
let endReached = false;
let skipAllowed = false;
let experimentActive = true;

let currentVideoEndedHandler = null;
let measurementStartTimeout = null;

const exercise2VideoUrl =
    window.empraConfig.exercise2VideoUrl;

const exercise3VideoUrl =
    window.empraConfig.exercise3VideoUrl;

// Border Elements
var frameTop = document.createElement("div");
frameTop.id = "frameTop";
frameTop.className = "frame"; // alle Elemente selbe Klasse um gleichzeitig zu manipulieren
frameTop.style.top = 0;
frameTop.style.left = 0;
frameTop.style.width = "100vw";
frameTop.style.height = "1cm";
trialFrame.appendChild(frameTop); // erzeugte Element in trialFrame einfügen

var frameBottom = document.createElement("div");
frameBottom.id = "frameBottom";
frameBottom.className = "frame";
frameBottom.style.bottom = 0;
frameBottom.style.left = 0;
frameBottom.style.width = "100vw";
frameBottom.style.height = "1cm";
trialFrame.appendChild(frameBottom);

var frameLeft = document.createElement("div");
frameLeft.id = "frameLeft";
frameLeft.className = "frame";
frameLeft.style.top = 0;
frameLeft.style.left = 0;
frameLeft.style.width = "1cm";
frameLeft.style.height = "100vh";
trialFrame.appendChild(frameLeft);

var frameRight = document.createElement("div");
frameRight.id = "frameRight";
frameRight.className = "frame";
frameRight.style.top = 0;
frameRight.style.right = 0;
frameRight.style.width = "1cm";
frameRight.style.height = "100vh";
trialFrame.appendChild(frameRight);

const frameElements = trialFrame.getElementsByClassName('frame'); // alle Elemente innerhalb von trialFrame suchen, die die Klasse frame haben
for (let i = 0; i < frameElements.length; i++) {  //Schleife über alle Rahmenelemente Positionieren; ignoriert Maus
    frameElements[i].style.zIndex = 15;
    frameElements[i].style.position = "fixed";
    frameElements[i].style.pointerEvents = "none";
    frameElements[i].style.backgroundColor = 'grey';
}

// Funktion um Farbe aller vier Balken gleichzeitig zu verändern
function setFrameColor(color) {
    for (let i = 0; i < frameElements.length; i++) {
        frameElements[i].style.backgroundColor = color;
    }
}

// White Overlay
const whiteOverlay = document.createElement('div');
whiteOverlay.id = 'whiteOverlay';
whiteOverlay.style.position = 'fixed';
whiteOverlay.style.top = '0';
whiteOverlay.style.left = '0';
whiteOverlay.style.width = '100%';
whiteOverlay.style.height = '100%';
whiteOverlay.style.backgroundColor = 'white';
whiteOverlay.style.zIndex = 10;
whiteOverlay.style.display = 'block';
trialFrame.appendChild(whiteOverlay);

// Fixation Cross
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
fix.style.display = 'block';
trialFrame.appendChild(fix);

// Next-Video-Instruction (allgemeines Instruktionsfeld zwischen den Schritten)
const nextVideoInst = document.createElement('div');
nextVideoInst.id = "nextVideoInst";
nextVideoInst.style.zIndex = 5;
nextVideoInst.textContent = "";
trialFrame.appendChild(nextVideoInst);

// Mid-Video-Instruction (mittige Hinweisanzeige während der Übung)
const midVideoInst = document.createElement('div');
midVideoInst.id = "midVideoInst";
midVideoInst.style.zIndex = 5;
midVideoInst.style.position = 'fixed';
midVideoInst.style.top = '50%';
midVideoInst.style.left = '50%';
midVideoInst.style.transform = 'translate(-50%, -50%)';
midVideoInst.textContent = "Enter drücken, um Video abzuspielen.";
trialFrame.appendChild(midVideoInst);

// Repeat & Continue Button
const buttonContainer = document.createElement('div');
buttonContainer.id = "buttonContainer";
buttonContainer.style.zIndex = 10;
buttonContainer.style.display = "flex";
buttonContainer.style.flexDirection = "row";
buttonContainer.style.position = "relative";
trialFrame.appendChild(buttonContainer);

const buttonRepeat = document.createElement('button');
buttonRepeat.id = "buttonRepeat";
buttonRepeat.style.margin = "10px";
buttonRepeat.style.padding = "5px";
buttonRepeat.innerText = "Wiederholen";
buttonContainer.appendChild(buttonRepeat);

const buttonContinue = document.createElement('button');
buttonContinue.id = "buttonContinue";
buttonContinue.style.margin = "10px";
buttonContinue.style.padding = "5px";
buttonContinue.innerText = "Weiter";
buttonContainer.appendChild(buttonContinue);

// Video element (Aufbau des Videoplayers)
const video = document.createElement('video');
video.id = 'video';
video.autoplay = false;
video.muted = true;
video.playsInline = true;
video.controls = false;
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

// Instruction Texts
const instruction1aElement = document.querySelector('.Instruction1a');
const instruction1a = instruction1aElement.innerHTML;
nextVideoInst.innerHTML = instruction1a;

const instruction1bElement = document.querySelector('.Instruction1b');
const instruction1b = instruction1bElement.innerHTML;

const instruction2Element = document.querySelector('.Instruction2');
const instruction2 = instruction2Element.innerHTML;

const instruction3Element = document.querySelector('.Instruction3');
const instruction3 = instruction3Element.innerHTML;

const instruction4Element = document.querySelector('.Instruction4');
const instruction4 = instruction4Element.innerHTML;

/******** HELFER ********/

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

    // Sicherheitsbereinigung: mittlere Hinweisnachricht entfernen
    midVideoInst.textContent = "";
    midVideoInst.innerHTML = "";
}

function clearEndedHandler() {
    if (currentVideoEndedHandler) {
        video.removeEventListener('ended', currentVideoEndedHandler);
        currentVideoEndedHandler = null;
    }
}

function finishVideoExercise() {
    measurementAllowed = true;
    measurementDone = false;
    isKeyDown = false;

    setFrameColor('yellow');

    midVideoInst.style.zIndex = 70;
    if (stepCounter === 5) {
        midVideoInst.textContent = "Der Rahmen ist jetzt gelb! Drücken und halten Sie die Leertaste für 4 Sekunden.";
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

        // Übung 3 bekommt nur 500 ms grauen Rahmen,
        // Übung 2 bekommt 2000 ms
        const delayToYellow = (stepCounter === 8) ? 500 : 2000;

        measurementStartTimeout = setTimeout(() => {
            finishVideoExercise();
        }, delayToYellow);
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

    for (let i = 0; i < frameElements.length; i++) {
        frameElements[i].style.zIndex = 70;
    }

    video.style.display = "block";
    attachEndedHandler();
    video.play();
}

/******** EXPERIMENT ********/

function experiment(step) {
    switch (step) {
        case (0): // Instruction 1
            nextVideoInst.innerHTML = instruction1a;
            document.addEventListener('keydown', instruction1NextPage);
            skipAllowed = false;
            whiteOverlay.style.zIndex = 60;
            fix.style.zIndex = 10;
            midVideoInst.style.zIndex = 10;
            midVideoInst.textContent = "";
            midVideoInst.innerHTML = "";
            setFrameColor('grey');
            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 10;
            }
            nextVideoInst.style.zIndex = 70;
            break;

        case (1): // Preparation 1
            nextVideoInst.style.zIndex = 20;
            skipAllowed = false;
            midVideoInst.style.zIndex = 70;
            midVideoInst.innerHTML = "";
            midVideoInst.textContent = "Enter drücken, um die Übung zu starten.";
            skipAllowed = true;
            break;

        case (2): // Exercise 1
            skipAllowed = false;
            midVideoInst.style.zIndex = 70;
            measurementDone = false;

            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 70;
            }

            midVideoInst.textContent = "Beobachten Sie den Rahmen.";

            setTimeout(() => {
                setFrameColor('yellow');
                midVideoInst.textContent = "Der Rahmen ist jetzt gelb! Drücken und halten Sie die Leertaste für 4 Sekunden.";
                measurementAllowed = true;
                skipAllowed = false;
            }, 2000);
            break;

        case (3): // Instruction 2
            // Wichtig: Hinweis aus dem ersten Übungsdurchgang sicher entfernen
            midVideoInst.textContent = "";
            midVideoInst.innerHTML = "";
            midVideoInst.style.zIndex = 10;

            skipAllowed = false;
            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 10;
            }
            nextVideoInst.style.zIndex = 70;
            nextVideoInst.innerHTML = instruction2;
            skipAllowed = true;
            break;

        case (4): // Preparation 2
            nextVideoInst.style.zIndex = 20;
            skipAllowed = false;
            midVideoInst.style.zIndex = 70;
            midVideoInst.innerHTML = "";
            midVideoInst.textContent = "Enter drücken, um die Übung zu starten.";
            skipAllowed = true;
            break;

        case (5): // Exercise 2
            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 70;
            }
            skipAllowed = false;
            midVideoInst.style.zIndex = 10;
            VideoReadyCheck(exercise2VideoUrl);
            break;

        case (6): // Instruction 3
            skipAllowed = false;
            nextVideoInst.style.zIndex = 70;
            midVideoInst.textContent = "";
            midVideoInst.innerHTML = "";
            midVideoInst.style.zIndex = 10;
            midVideoInst.style.border = "";
            midVideoInst.style.backgroundColor = "";
            midVideoInst.style.padding = "";
            whiteOverlay.style.zIndex = 60;
            fix.style.zIndex = 10;
            setFrameColor('grey');
            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 10;
            }
            nextVideoInst.innerHTML = instruction3;
            skipAllowed = true;
            break;

        case (7): // Preparation 3
            nextVideoInst.style.zIndex = 20;
            skipAllowed = false;
            midVideoInst.style.zIndex = 70;
            midVideoInst.innerHTML = "";
            midVideoInst.textContent = "Enter drücken, um die Übung zu starten.";
            skipAllowed = true;
            break;

        case (8): // Exercise 3
            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 70;
            }
            skipAllowed = false;
            midVideoInst.style.zIndex = 10;
            VideoReadyCheck(exercise3VideoUrl);
            break;

        case (9): // Ende Übungsphase
            skipAllowed = false;
            whiteOverlay.style.zIndex = 60;
            nextVideoInst.style.zIndex = 70;
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
            midVideoInst.textContent = "";
            midVideoInst.innerHTML = "";

            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 10;
            }
            break;
    }
}

/******** KEYDOWN ********/

document.addEventListener("keydown", function(event) {
    if (!experimentActive) return;

    if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
    }

    // Spacebar: erste Übung jetzt auch über den Rahmen
    if (event.code === "Space" && stepCounter === 2 && measurementAllowed && !measurementDone && !isKeyDown) {
        setFrameColor('green');
        midVideoInst.textContent = "Der Rahmen bleibt grün, so lange Sie die Leertaste gedrückt halten.";
        isKeyDown = true;
    }

    // Spacebar: Videoübungen nach dem Video
    if (event.code === "Space" && (stepCounter === 5 || stepCounter === 8) && measurementAllowed && !measurementDone && !isKeyDown) {
        setFrameColor('green');

        if (stepCounter === 5) {
            midVideoInst.textContent = "Der Rahmen bleibt grün, so lange Sie die Leertaste gedrückt halten.";
        } else {
            midVideoInst.textContent = "";
        }

        isKeyDown = true;
    }

    // Enter
    if (event.code === "Enter" && skipAllowed) {
        stepCounter = (stepCounter < 9) ? stepCounter + 1 : 0;
        if (!endReached) {
            experiment(stepCounter);
        }
    }
});

/******** KEYUP ********/

document.addEventListener("keyup", function(event) {
    if (!experimentActive) return;

    // Spacebar: erste Übung jetzt auch über den Rahmen
    if (event.code === "Space" && stepCounter === 2 && measurementAllowed && !measurementDone && isKeyDown) {
        setFrameColor('grey');

        // KORREKTUR:
        // Die Nachricht "Der Rahmen bleibt grün..." verschwindet jetzt
        // genau dann, wenn die Leertaste losgelassen wird.
        midVideoInst.textContent = "";
        midVideoInst.innerHTML = "";

        measurementDone = true;
        measurementAllowed = false;
        isKeyDown = false;
        skipAllowed = true;

        setTimeout(() => {
            if (skipAllowed === true) {
                stepCounter = (stepCounter < 9) ? stepCounter + 1 : 0;
                if (!endReached) {
                    experiment(stepCounter);
                }
            }
        }, 2000);
    }

    // Spacebar: Videoübungen nach dem Video
    if (event.code === "Space" && (stepCounter === 5 || stepCounter === 8) && measurementAllowed && !measurementDone && isKeyDown) {
        setFrameColor('grey');

        measurementDone = true;
        measurementAllowed = false;
        isKeyDown = false;
        skipAllowed = true;

        if (stepCounter === 5) {
            midVideoInst.textContent = "";
        } else {
            midVideoInst.textContent = "";
        }

        setTimeout(() => {
            if (skipAllowed === true) {
                stepCounter = (stepCounter < 9) ? stepCounter + 1 : 0;
                if (!endReached) {
                    experiment(stepCounter);
                }
            }
        }, 2000);
    }
});

// Start
experiment(stepCounter);
})();
