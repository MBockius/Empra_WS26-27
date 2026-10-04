
(() => {

document.body.classList.add('custom-styles');

// Define Trial Frame
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
weiterButton.style.display = 'none'; // Button verstecken
weiterButton.addEventListener('click', function() {
    $('form').submit(); // wenn der Button intern geklickt wird, wird das Formular abgeschickt
});

// Hide Language Button
document.getElementById('dropdownMenuDivider')?.style?.setProperty('display', 'none'); // Menue ausblenden, wenn existent 
                                                                                                                                                         // ?. weiter ohne Fehler
// Hide Header
const quesionproHeader = document.querySelector('.take-survey-header');
quesionproHeader.style.display = 'none';

// Survey Submit Wrapper
const quesionproSurveySubmitWrapper = document.querySelector('.survey-submit-wrapper');
quesionproSurveySubmitWrapper.style.display = 'none';

/******** TRIAL CODE ********/

let measurementAllowed = false;
let videoStartTime = null;  //  ?
let keyDownTime = null;    //  ?
let measurementDone = false;
let isKeyDown = false;
let videoReady = false;
const recordedDurations = []; // ?
const watchedVideos = []; //  ?
let stepCounter = 0; // Zustandszähler
let endReached = false;   // Ende der Übungsphase erreicht?
let skipAllowed = false;    // darf man mit Enter den nächsten Step starten?
let experimentActive = true;


// Steuert, ob Startzustand (gelber Rahmen) erreicht ist,
// ob Video schon gestartet wurde
// und ob gerade aktiv gemessen wird
let readyToStart = false;        
let started = false;             
let measurementRunning = false;  
let pressStartTime = null;       
let heldDuration = null;         // ?

// ended-Handler 
let currentVideoEndedHandler = null; // für jedes Video ein gültiger ended- Handler

const exercise2VideoUrl =
    window.empraConfig.exercise2VideoUrl;

const exercise3VideoUrl =
    window.empraConfig.exercise3VideoUrl;

/******** UI ELEMENTS ********/

// Border Elements
var frameTop = document.createElement("div");
frameTop.id = "frameTop";
frameTop.className = "frame";
frameTop.style.top = 0;
frameTop.style.left = 0;
frameTop.style.width = "100vw";
frameTop.style.height = "1cm";
trialFrame.appendChild(frameTop);

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

const frameElements = trialFrame.getElementsByClassName('frame'); // alle Elemente der Klasse frame sammeln zum 
                                                                                                                     // gemeinsamen Formatieren
for (let i = 0; i < frameElements.length; i++) {
    frameElements[i].style.zIndex = 15;
    frameElements[i].style.position = "fixed";
    frameElements[i].style.pointerEvents = "none";
    frameElements[i].style.backgroundColor = 'grey';
    // frameElements[i].style.position = "block";
    frameElements[i].style.display = "block";
}

// Hilfsfunktion, zum setzen der Rahmenfarbe

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

// Fixationskreuz
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

// Next-Video-Instruction (Instruktion zwischen den Übungen)
const nextVideoInst = document.createElement('div');
nextVideoInst.id = "nextVideoInst";
nextVideoInst.style.zIndex = 5;
nextVideoInst.textContent = "";
trialFrame.appendChild(nextVideoInst);

// Mid-Video-Instruction
const midVideoInst = document.createElement('div');
midVideoInst.id = "midVideoInst";
midVideoInst.style.zIndex = 5;
midVideoInst.style.position = 'fixed';
midVideoInst.style.top = '50%';
midVideoInst.style.left = '50%';
midVideoInst.style.transform = 'translate(-50%, -50%)';
midVideoInst.textContent = "Enter drücken, um das Video abzuspielen.";
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

// Video element
const video = document.createElement('video');
video.id = 'video';
video.autoplay = false;
video.muted = true;
video.playsInline = true;
video.controls = false;
video.preload = "auto";

// Video ist am Anfang unsichtbar (gelbwerden des Rahmens)

video.style.display = "none";

video.style.position = "fixed";
video.style.zIndex = 50;
video.style.top = '0';
video.style.left = '0';
video.style.width = '100%';
video.style.height = '100%';
video.style.objectFit = 'cover';
trialFrame.appendChild(video);

// Anlegen der Videoquelle
const source = document.createElement('source');
source.type = 'video/mp4';
source.src = exercise2VideoUrl;
video.appendChild(source);

/******** INSTRUCTION TEXTS ********/

const instruction1aElement = document.querySelector('.Instruction1a'); // HTML-Element .Instrukttion1a suchen
const instruction1a = instruction1aElement.innerHTML;  // auslesen und in instruction1a speichern
nextVideoInst.innerHTML = instruction1a;                        // in Anzeigeelement nextVideoInst schreiben (ANzeigen) 

const instruction1bElement = document.querySelector('.Instruction1b');
const instruction1b = instruction1bElement.innerHTML;
nextVideoInst.innerHTML = instruction1b;    // überschreibt intruktion1a direkt wieder!?!

const instruction2Element = document.querySelector('.Instruction2');
const instruction2 = instruction2Element.innerHTML;

const instruction3Element = document.querySelector('.Instruction3');
const instruction3 = instruction3Element.innerHTML;

const instruction4Element = document.querySelector('.Instruction4');
const instruction4 = instruction4Element.innerHTML;

/******** HELFER ********/

function instruction1NextPage(event) {  // Wenn Enter Inst1a durch Inst1b ersetzen
    if (!experimentActive) return;

    if (event.key === 'Enter') {
        nextVideoInst.innerHTML = instruction1b;
        skipAllowed = true;  // weiter mit Enter zulassen
        document.removeEventListener('keydown', instruction1NextPage); // Handler entfernen sonst immer Inst1b bei Return
    }
}

function resetState() {  // Buttons nach hinten schieben
    buttonContainer.style.zIndex = 10;
    endReached = false;
}

// Funktion setzt alle Zustände zurück, die für die neue Videomesslogik gebraucht werden.
function resetMeasurementState() {   // Messlogik zurücksetzen
    readyToStart = false;
    started = false;
    measurementRunning = false;
    pressStartTime = null;
    heldDuration = null;

    measurementAllowed = false;
    measurementDone = false;
    isKeyDown = false;

    videoStartTime = null;
    keyDownTime = null;
    videoReady = false;

    video.pause();
    video.currentTime = 0;

    // Video versteckt, bis mit Space gestartet wird.
    video.style.display = "none";

    setFrameColor('grey');
}

// entfernen alter ended-Handler um stapeln zu vermeiden
function clearEndedHandler() {
    if (currentVideoEndedHandler) {
        video.removeEventListener('ended', currentVideoEndedHandler);
        currentVideoEndedHandler = null;
    }
}

// Jeder Videotrial erhält einen ended-Handler.
function attachEndedHandler() {
    clearEndedHandler();

    currentVideoEndedHandler = function() {
  //     if ((stepCounter === 5 || stepCounter === 8) && !measurementDone) { // AUSKOMMENTIEREN WENN VIDEO WEITERLAUFEN 
                                                                                                                             // SOLL
 if (stepCounter === 5 || stepCounter === 8) { // KOMMENTIERUNG ENTFERNEN; WENN VIDEO WEITERLAUFEN SOLL
            setFrameColor('grey');
            measurementRunning = false;
            readyToStart = false;
            started = false;
            measurementDone = true;

            // Video nach Ende weg
            video.style.display = "none";

            stepCounter = (stepCounter < 9) ? stepCounter + 1 : 0;   // wenn Stepcounter kleiner als 9, gehe eins weiter sonst springe 0

            setTimeout(() => {  // kurze Pause nach Videoende
                if (!endReached) {
                    experiment(stepCounter);
                }
            }, 2000);
        }
    };

    video.addEventListener('ended', currentVideoEndedHandler);  // Handler an Video hängen
}

// Funktion entfernt alte ended Logik; setzt Zustände zurück; setzt Videoquelle; zeigt Fixationskreuz; lädt Video vor, es bleibt unsichtbar, Rahmen erst gelb wenn Video bereit!

function VideoReadyCheck(videourl) {
    clearEndedHandler();  // eventuelle ended-Handler entfernen
    resetMeasurementState();  // alle Zustände der Messlogik zurücksetzen

    source.src = videourl;  
    video.load(); // Laden aktiv anstoßen

    nextVideoInst.textContent = ""; // Text in nextVideoInst geleert
    midVideoInst.style.zIndex = 10;  // mid Inst nach hinten
    fix.style.zIndex = 70; // Kreuz nach vorne
    whiteOverlay.style.zIndex = 20;

    const onReady = () => {  // sobald Video bereit ist
        videoReady = true;
        fix.style.zIndex = 10;

        if (stepCounter === 5) {  // Nur für Step 5 relevant
            midVideoInst.style.zIndex = 70;
            midVideoInst.textContent = "Beobachten Sie den Rahmen.";
           // midVideoInst.style.border = "2px solid gray";
          // midVideoInst.style.backgroundColor = "lightgrey";
         //  midVideoInst.style.padding = "1rem";
        }

        if (stepCounter === 8) {  // nur für 8 relevant
            midVideoInst.style.zIndex = 70;
            midVideoInst.textContent = "";
        }

        // Übung 3 bekommt nur 500 ms grauen Rahmen,
        // Übung 2 behält die normale Wartezeit von 1000 ms.
        const delayToYellow = (stepCounter === 8) ? 500 : 2000;

        //  Erst wenn das Video bereit ist wird Start freigegeben
        setTimeout(() => {
            readyToStart = true;
            setFrameColor('yellow');
            midVideoInst.style.zIndex = 70;
            midVideoInst.textContent = "Der Rahmen ist jetzt gelb! Drücken und halten Sie die Leertaste, um zu starten.";
        }, delayToYellow);
    };

    if (video.readyState >= 4) {  // wenn Video ausreichend geladen Funktion on Ready() ausführen ansonsten warten auf canplay..
        onReady();
    } else {
        video.addEventListener('canplaythrough', onReady, { once: true });  // Handler wird nach dem ersten Auslösen automatisch..                                   
    }
}

// Startlogik
// Mit Space-Down startet.....
// 1. das Sichtbarwerden des Videos
// 2. das Video selbst
// 3. die Messung
function startVideoAndMeasurement() {
    if (!readyToStart || started || !videoReady) return;  // Rahmen gelb?; Video läuft schon?; Video fertig vorbereitet?

    started = true;  // Video gilt als gestartet
    readyToStart = false;  // kein neuerlicher Start möglich
    measurementRunning = true;
    measurementDone = false;

    // Video sichtbar 
    video.style.display = "block";

    midVideoInst.style.zIndex = 10;
// Messlogik !?!
    videoStartTime = Date.now();
    pressStartTime = Date.now();
    keyDownTime = pressStartTime;

    setFrameColor('green');

    attachEndedHandler(); // ended-Handler an Video hängen

    video.play().catch(() => { // Video starten, wenn fehlschlägt -> catch()
        started = false; // Startstatus zurücksetzen
        measurementRunning = false; // Messung zurücksetzen
        pressStartTime = null; // Startzeitpunkt löschen
        keyDownTime = null;

        // Falls Abspielen fehlschlägt -> Video verstecken
        video.style.display = "none";

        setFrameColor('yellow');  // Rahmen auf gelb und erneut versuchen
        readyToStart = true;

        midVideoInst.style.zIndex = 70;
        midVideoInst.textContent = "Bitte einmal klicken und dann Leertaste drücken und halten.";
    });
}

/******** EXPERIMENT ********/

function experiment(step) {
    switch (step) {   // vergleiche den Wert von step und springe zum passenden Case
        case (0): // Instruction 1 anzeigen
            nextVideoInst.innerHTML = instruction1a;
            document.addEventListener('keydown', instruction1NextPage); 
            skipAllowed = false;
            whiteOverlay.style.zIndex = 60;
            fix.style.zIndex = 10; // Fixationskreuz verstecken
            for (let i = 0; i < frameElements.length; i++) {  // alle Rahmenelemente nach hinten legen
                frameElements[i].style.zIndex = 10;
            }
            nextVideoInst.style.zIndex = 70; // Instruktionsfeld zeigen
            break; // case endet

        case (1): // Preparation 1
            nextVideoInst.style.zIndex = 20;
            skipAllowed = false;
            midVideoInst.style.zIndex = 70;
            midVideoInst.innerHTML = "";  // aktuellen Inhalt leeren 
            midVideoInst.textContent = "Enter drücken, um die Übung zu starten.";  // und neuen Inhalt rein
            skipAllowed = true;
            break;

        case (2): // Fixation Cross & Exercise 1
            skipAllowed = false;
            for (let i = 0; i < frameElements.length; i++) {  // alle Rahmenelemente nach vorne holen
                frameElements[i].style.zIndex = 70;
            }
            midVideoInst.textContent = "Beobachten Sie den Rahmen.";
            measurementDone = false; // Messstatus zurücksetzen

            setTimeout(() => {
               // skipAllowed = true; // ??
                measurementAllowed = true;
                setFrameColor('yellow');
                midVideoInst.textContent = "Der Rahmen ist jetzt gelb! Drücken und halten Sie die Leertaste für 4 Sekunden.";
            }, 2000);
            break;

        case (3): // Instruction 2
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
            midVideoInst.textContent = "Enter drücken, um die Übung zu starten!";
            skipAllowed = true;
            break;

        case (5): // Fixation Cross & Exercise 2
            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 70;
            }
            skipAllowed = false;

            // Video vorbereiten (nicht gleich starten!)
            VideoReadyCheck(exercise2VideoUrl); // zweites Video auswählen; alles zurücksetzen; Video laden ; warten; mit gelb frei...
            break;

        case (6): // Instruction 3
            skipAllowed = false;
            nextVideoInst.style.zIndex = 70;
            midVideoInst.style.zIndex = 10;
            midVideoInst.style.border = "";  // Sondergestaltung von step 5 zurücksetzen
            midVideoInst.style.backgroundColor = "";
            midVideoInst.style.padding = "";
            whiteOverlay.style.zIndex = 60;
            fix.style.zIndex = 10;
            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 10;
            }
            nextVideoInst.innerHTML = instruction3; // Anzeigen des dritten Instruktionstextes
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

        case (8): // Fixation Cross & Exercise 3
            for (let i = 0; i < frameElements.length; i++) {
                frameElements[i].style.zIndex = 70;
            }
            skipAllowed = false;
            midVideoInst.style.zIndex = 10;

            // Video vorbereiten (nicht gleich starten!)
            VideoReadyCheck(exercise3VideoUrl);  // Analog zu Case (5)
            break;

        case (9): // Endeseite der  Übungsphase
            skipAllowed = false;
            whiteOverlay.style.zIndex = 60;
            nextVideoInst.style.zIndex = 70;
            endReached = true;  // das Ende ist erreicht!
            nextVideoInst.innerHTML = instruction4; // Abschlussinstruktion anzeigen
            buttonContainer.style.zIndex = 90; // Button Container hervorholen ("Weiter" und "Wiederholen")

            buttonRepeat.addEventListener("click", function(event) {
                event.preventDefault();
                resetState();
                stepCounter = 0;
                skipAllowed = true;
                experiment(stepCounter);
            });

            buttonContinue.addEventListener("click", function(event) {
                event.preventDefault();
                experimentActive = false;
                resetState();
                weiterButton.click();
            });

            whiteOverlay.style.zIndex = 70;
            nextVideoInst.style.zIndex = 70;
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

    // Rahmen-Übung unverändert
    if (event.code === "Space" && stepCounter === 2 && measurementAllowed && !measurementDone && !isKeyDown) {
        setFrameColor('green');
        midVideoInst.textContent = "Der Rahmen bleibt grün, so lange Sie die Leertaste gedrückt halten.";
        isKeyDown = true;
    }

    //  Leertaste startet jetzt  Video und Messung gemeinsam.
    if (event.code === "Space" && (stepCounter === 5 || stepCounter === 8) && readyToStart && !started) {
        startVideoAndMeasurement(); // aufrufen der Startfunktion
        return;
    }

    // Enter-Steuerung (wurde Enter gedrückt? und war es erlaubt? dann weiter)
    if (event.code === "Enter" && skipAllowed) {
        stepCounter = (stepCounter < 9) ? stepCounter + 1 : 0;
        if (!endReached) { //Starten des nächsten Schrittes so lange Ende nicht erreicht
            experiment(stepCounter);
        }
    }
});

/******** KEYUP ********/

document.addEventListener("keyup", function(event) { // Globaler Handler für Loslassen einer Taste
    if (!experimentActive) return;

    if (event.code === "Space" && stepCounter === 2 && measurementAllowed && !measurementDone && isKeyDown) {
        setFrameColor('grey');
        measurementDone = true;
        measurementAllowed = false;
        isKeyDown = false;

        if (stepCounter === 2 || stepCounter === 5 || stepCounter === 8) {
            midVideoInst.style.zIndex = 10;
            skipAllowed = true;
        }

        if (skipAllowed === true) {
            stepCounter = (stepCounter < 9) ? stepCounter + 1 : 0;
        }

        setTimeout(() => {
            if (!endReached) {
                experiment(stepCounter);
            }
        }, 2000);
    }

    // Space-Up beendet die neue Messlogik.
  
    if (event.code === "Space" && (stepCounter === 5 || stepCounter === 8) && measurementRunning) {
        heldDuration = Date.now() - pressStartTime;

        measurementRunning = false;
        measurementDone = true;
        started = false;
        readyToStart = false;

        setFrameColor('grey');

        // Nach dem Loslassen verschwindet das Video ! AB HIER AUSKOMMENTIEREN; WENN VIDEO WEITERLAUFEN SOLL
    //   video.style.display = "none";

    //   midVideoInst.style.zIndex = 10;
   //  skipAllowed = true;

   //  video.pause();

   //   stepCounter = (stepCounter < 9) ? stepCounter + 1 : 0;

  //   setTimeout(() => {
  //      if (!endReached) {
  //           experiment(stepCounter);
//          }
//     }, 2000); // BIS HIERHIN AUSKOMMENTIEREN
    }
});

/******** START ********/

experiment(stepCounter);
})();
