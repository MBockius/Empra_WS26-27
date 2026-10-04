(() => {
    //
document.body.classList.add('custom-styles');

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

const weiterButton =
    document.getElementById("SurveySubmitButtonElement");

weiterButton.style.display = 'none';

document
    .getElementById('dropdownMenuDivider')
    ?.style?.setProperty('display', 'none');

const videolist = [
    { videoURL: window.empraConfig.video1,  originalIndex: 1,  videoName: "videoA_033", duration: null },
    { videoURL: window.empraConfig.video2,  originalIndex: 2,  videoName: "videoA_050", duration: null },
    { videoURL: window.empraConfig.video3,  originalIndex: 3,  videoName: "videoA_100", duration: null },
    { videoURL: window.empraConfig.video4,  originalIndex: 4,  videoName: "videoA_200", duration: null },
    { videoURL: window.empraConfig.video5,  originalIndex: 5,  videoName: "videoA_300", duration: null },

    { videoURL: window.empraConfig.video6,  originalIndex: 6,  videoName: "videoB_033", duration: null },
    { videoURL: window.empraConfig.video7,  originalIndex: 7,  videoName: "videoB_050", duration: null },
    { videoURL: window.empraConfig.video8,  originalIndex: 8,  videoName: "videoB_100", duration: null },
    { videoURL: window.empraConfig.video9,  originalIndex: 9,  videoName: "videoB_200", duration: null },
    { videoURL: window.empraConfig.video10, originalIndex: 10, videoName: "videoB_300", duration: null },

    { videoURL: window.empraConfig.video11, originalIndex: 11, videoName: "videoC_033", duration: null },
    { videoURL: window.empraConfig.video12, originalIndex: 12, videoName: "videoC_050", duration: null },
    { videoURL: window.empraConfig.video13, originalIndex: 13, videoName: "videoC_100", duration: null },
    { videoURL: window.empraConfig.video14, originalIndex: 14, videoName: "videoC_200", duration: null },
    { videoURL: window.empraConfig.video15, originalIndex: 15, videoName: "videoC_300", duration: null },

    { videoURL: window.empraConfig.video16, originalIndex: 16, videoName: "videoD_033", duration: null },
    { videoURL: window.empraConfig.video17, originalIndex: 17, videoName: "videoD_050", duration: null },
    { videoURL: window.empraConfig.video18, originalIndex: 18, videoName: "videoD_100", duration: null },
    { videoURL: window.empraConfig.video19, originalIndex: 19, videoName: "videoD_200", duration: null },
    { videoURL: window.empraConfig.video20, originalIndex: 20, videoName: "videoD_300", duration: null },

    { videoURL: window.empraConfig.video21, originalIndex: 21, videoName: "videoA_still", duration: null },
    { videoURL: window.empraConfig.video22, originalIndex: 22, videoName: "videoB_still", duration: null },
    { videoURL: window.empraConfig.video23, originalIndex: 23, videoName: "videoC_still", duration: null },
    { videoURL: window.empraConfig.video24, originalIndex: 24, videoName: "videoD_still", duration: null }
];

function valuesOfKey(dict, key) {
    return Object.values(dict)
        .filter(item => key in item)
        .map(item => item[key]);
}

function shuffleVideoList(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j =
            Math.floor(Math.random() * (i + 1));

        [list[i], list[j]] =
            [list[j], list[i]];
    }

    return list;
}

const shuffledVideolist =
    shuffleVideoList(videolist);

$survey.updateCustomVariable(
    4,
    JSON.stringify(
        valuesOfKey(
            shuffledVideolist,
            'videoName'
        )
    )
);

let loopNo = 1;
const loopMax = shuffledVideolist.length;

let measurementDone = false;
let videoReady = false;
let selectedVideoOriginalIndex;
let startVideoLoad = false;
let readyToStart = false;
let started = false;
let measurementRunning = false;
let pressStartTime = null;
let currentVideoEndedHandler = null;
let currentTrialTimeout = null;
let currentReadyTimeout = null;
let currentCanPlayThroughHandler = null;
let experimentActive = true;

var frameTop =
    document.createElement("div");

frameTop.id = "frameTop";
frameTop.className = "frame";
frameTop.style.top = 0;
frameTop.style.left = 0;
frameTop.style.width = "100vw";
frameTop.style.height = "1cm";

trialFrame.appendChild(frameTop);

var frameBottom =
    document.createElement("div");

frameBottom.id = "frameBottom";
frameBottom.className = "frame";
frameBottom.style.bottom = 0;
frameBottom.style.left = 0;
frameBottom.style.width = "100vw";
frameBottom.style.height = "1cm";

trialFrame.appendChild(frameBottom);

var frameLeft =
    document.createElement("div");

frameLeft.id = "frameLeft";
frameLeft.className = "frame";
frameLeft.style.top = 0;
frameLeft.style.left = 0;
frameLeft.style.width = "1cm";
frameLeft.style.height = "100vh";

trialFrame.appendChild(frameLeft);

var frameRight =
    document.createElement("div");

frameRight.id = "frameRight";
frameRight.className = "frame";
frameRight.style.top = 0;
frameRight.style.right = 0;
frameRight.style.width = "1cm";
frameRight.style.height = "100vh";

trialFrame.appendChild(frameRight);

const frameElements =
    trialFrame.getElementsByClassName('frame');

for (
    let i = 0;
    i < frameElements.length;
    i++
) {
    frameElements[i].style.zIndex = 15;
    frameElements[i].style.position = "fixed";
    frameElements[i].style.pointerEvents = "none";
    frameElements[i].style.backgroundColor = 'grey';
}

function setFrameColor(color) {
    for (
        let i = 0;
        i < frameElements.length;
        i++
    ) {
        frameElements[i].style.backgroundColor =
            color;
    }
}

const whiteOverlay =
    document.createElement('div');

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

const fix =
    document.createElement('div');

fix.id = 'fix';

const img =
    document.createElement('img');

img.src =
    'https://fernuni-hagen.sciebo.de/s/bnfSkMaKDTCAPjZ/download';

img.alt = 'Fixationskreuz';

fix.appendChild(img);

fix.style.zIndex = 20;
fix.style.position = 'fixed';
fix.style.top = '50%';
fix.style.left = '50%';
fix.style.transform =
    'translate(-50%, -50%)';

fix.style.display = 'block';

trialFrame.appendChild(fix);

const nextVideoInst =
    document.createElement('div');

nextVideoInst.id = "nextVideoInst";
nextVideoInst.style.zIndex = 5;
nextVideoInst.textContent =
    "Enter drücken, um den nächsten Durchgang zu starten.";

nextVideoInst.style.position = 'fixed';
nextVideoInst.style.top = '50%';
nextVideoInst.style.left = '50%';
nextVideoInst.style.transform =
    'translate(-50%, -50%)';

nextVideoInst.style.display = 'block';

trialFrame.appendChild(nextVideoInst);

const video =
    document.createElement('video');

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

const source =
    document.createElement('source');

source.type = 'video/mp4';

video.appendChild(source);

function resetTrialState() {
    readyToStart = false;
    started = false;
    measurementRunning = false;
    pressStartTime = null;
    measurementDone = false;
    videoReady = false;

    video.pause();
    video.currentTime = 0;
    video.style.display = "none";

    setFrameColor('grey');
}

function clearEndedHandler() {
    if (currentVideoEndedHandler) {
        video.removeEventListener(
            'ended',
            currentVideoEndedHandler
        );

        currentVideoEndedHandler = null;
    }
}

function clearTrialTimeout() {
    if (currentTrialTimeout) {
        clearTimeout(currentTrialTimeout);
        currentTrialTimeout = null;
    }
}

function clearReadyTimeout() {
    if (currentReadyTimeout) {
        clearTimeout(currentReadyTimeout);
        currentReadyTimeout = null;
    }
}

function clearCanPlayThroughHandler() {
    if (currentCanPlayThroughHandler) {
        video.removeEventListener(
            'canplaythrough',
            currentCanPlayThroughHandler
        );

        currentCanPlayThroughHandler = null;
    }
}

function cleanupExperiment() {
    experimentActive = false;

    document.removeEventListener(
        "keydown",
        handleKeyDown
    );

    document.removeEventListener(
        "keyup",
        handleKeyUp
    );

    clearEndedHandler();
    clearTrialTimeout();
    clearReadyTimeout();
    clearCanPlayThroughHandler();

    try {
        video.pause();
        video.currentTime = 0;
        video.removeAttribute("src");
        source.removeAttribute("src");
        video.load();
    } catch (e) {}

    frameTop.remove();
    frameBottom.remove();
    frameLeft.remove();
    frameRight.remove();
    whiteOverlay.remove();
    fix.remove();
    nextVideoInst.remove();
    video.remove();

    document.body.classList.remove(
        'custom-styles'
    );

    weiterButton.style.display = '';
}

function finishTrialAndLoadNext() {
    clearEndedHandler();
    clearTrialTimeout();
    clearReadyTimeout();
    clearCanPlayThroughHandler();

    for (
        let i = 0;
        i < frameElements.length;
        i++
    ) {
        frameElements[i].style.zIndex = 70;
        frameElements[i].style.backgroundColor =
            'grey';
    }

    readyToStart = false;
    started = false;
    measurementRunning = false;
    pressStartTime = null;
    measurementDone = false;
    videoReady = false;

    video.style.display = "none";
    video.pause();
    video.currentTime = 0;

    loopNo++;
    loadNewVideo();
}

function attachEndedHandler() {
    clearEndedHandler();

    currentVideoEndedHandler = function() {
        if (
            measurementRunning &&
            !measurementDone
        ) {
            shuffledVideolist[
                loopNo - 1
            ].duration = -2;

            measurementDone = true;
            measurementRunning = false;
            started = false;
            readyToStart = false;
        }

        $survey.updateCustomVariable(
            selectedVideoOriginalIndex + 4,
            shuffledVideolist[
                loopNo - 1
            ].duration
        );

        currentTrialTimeout =
            setTimeout(() => {
                finishTrialAndLoadNext();
            }, 2000);
    };

    video.addEventListener(
        'ended',
        currentVideoEndedHandler
    );
}

function prepareVideo() {
    clearEndedHandler();
    clearTrialTimeout();
    clearReadyTimeout();
    clearCanPlayThroughHandler();
    resetTrialState();

    video.load();

    fix.style.zIndex = 70;
    nextVideoInst.style.zIndex = 10;
    whiteOverlay.style.zIndex = 60;

    const onReady = () => {
        currentCanPlayThroughHandler = null;
        videoReady = true;

        fix.style.zIndex = 10;
        whiteOverlay.style.zIndex = 60;

        for (
            let i = 0;
            i < frameElements.length;
            i++
        ) {
            frameElements[i].style.zIndex = 70;
        }

        currentReadyTimeout =
            setTimeout(() => {
                readyToStart = true;
                setFrameColor('yellow');
            }, 500);
    };

    if (video.readyState >= 4) {
        onReady();
    } else {
        currentCanPlayThroughHandler =
            onReady;

        video.addEventListener(
            "canplaythrough",
            currentCanPlayThroughHandler,
            { once: true }
        );
    }
}

function startVideoAndMeasurement() {
    if (
        !readyToStart ||
        started ||
        !videoReady
    ) {
        return;
    }

    started = true;
    readyToStart = false;
    measurementRunning = true;
    measurementDone = false;

    video.style.display = "block";
    nextVideoInst.style.zIndex = 10;
    whiteOverlay.style.zIndex = 40;

    pressStartTime = Date.now();

    setFrameColor('green');
    attachEndedHandler();
    video.play();
}

function handleKeyDown(event) {
    if (!experimentActive) return;

    if (
        event.code === "Space" ||
        event.code === "Enter"
    ) {
        event.preventDefault();
    }

    if (
        event.code === "Space" &&
        readyToStart &&
        !started
    ) {
        startVideoAndMeasurement();
        return;
    }

    if (
        event.code === "Enter" &&
        startVideoLoad
    ) {
        prepareVideo();
        startVideoLoad = false;
    }
}

document.addEventListener(
    "keydown",
    handleKeyDown
);

function handleKeyUp(event) {
    if (!experimentActive) return;

    if (event.code === "Space") {
        event.preventDefault();
    }

    if (
        event.code === "Space" &&
        measurementRunning &&
        !measurementDone
    ) {
        setFrameColor('grey');

        const keyUpTime = Date.now();
        const duration =
            keyUpTime - pressStartTime;

        shuffledVideolist[
            loopNo - 1
        ].duration = duration;

        $survey.updateCustomVariable(
            selectedVideoOriginalIndex + 4,
            duration
        );

        measurementRunning = false;
        measurementDone = true;
        started = false;
        readyToStart = false;
    }
}

document.addEventListener(
    "keyup",
    handleKeyUp
);

function loadNewVideo() {
    if (loopNo <= loopMax) {
        resetTrialState();

        source.src =
            shuffledVideolist[
                loopNo - 1
            ].videoURL;
        alert(
    "Trial: " + loopNo +
    "\nVideo: " +
    shuffledVideolist[loopNo - 1].videoName +
    "\nURL: " + source.src
);

        selectedVideoOriginalIndex =
            shuffledVideolist[
                loopNo - 1
            ].originalIndex;

        fix.style.zIndex = 10;
        whiteOverlay.style.zIndex = 60;
        nextVideoInst.style.zIndex = 70;

        if (
            loopNo ===
            Math.ceil(loopMax / 2) + 1
        ) {
            nextVideoInst.innerHTML =
                "<p><strong>Hälfte ist geschafft</strong></p>" +
                "<p>Enter drücken, um den nächsten Durchgang zu starten.</p>";
        } else {
            nextVideoInst.innerHTML =
                "<p>Enter drücken, um den nächsten Durchgang zu starten.</p>";
        }

        startVideoLoad = true;
    } else {
        cleanupExperiment();
        weiterButton.click();
    }
}

loadNewVideo();
})();
