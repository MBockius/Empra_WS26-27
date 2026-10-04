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

const weiterButton = document.getElementById("SurveySubmitButtonElement");
weiterButton.style.display = 'none';

weiterButton.addEventListener('click', function() {
    $('form').submit();
});

document.getElementById('dropdownMenuDivider')?.style?.setProperty('display', 'none');

const videolist = [
    { videoURL: window.empraConfig.video1,  originalIndex: 1,  videoName: "videoA_033" },
    { videoURL: window.empraConfig.video2,  originalIndex: 2,  videoName: "videoA_050" },
    { videoURL: window.empraConfig.video3,  originalIndex: 3,  videoName: "videoA_100" },
    { videoURL: window.empraConfig.video4,  originalIndex: 4,  videoName: "videoA_200" },
    { videoURL: window.empraConfig.video5,  originalIndex: 5,  videoName: "videoA_300" },

    { videoURL: window.empraConfig.video6,  originalIndex: 6,  videoName: "videoB_033" },
    { videoURL: window.empraConfig.video7,  originalIndex: 7,  videoName: "videoB_050" },
    { videoURL: window.empraConfig.video8,  originalIndex: 8,  videoName: "videoB_100" },
    { videoURL: window.empraConfig.video9,  originalIndex: 9,  videoName: "videoB_200" },
    { videoURL: window.empraConfig.video10, originalIndex: 10, videoName: "videoB_300" },

    { videoURL: window.empraConfig.video11, originalIndex: 11, videoName: "videoC_033" },
    { videoURL: window.empraConfig.video12, originalIndex: 12, videoName: "videoC_050" },
    { videoURL: window.empraConfig.video13, originalIndex: 13, videoName: "videoC_100" },
    { videoURL: window.empraConfig.video14, originalIndex: 14, videoName: "videoC_200" },
    { videoURL: window.empraConfig.video15, originalIndex: 15, videoName: "videoC_300" },

    { videoURL: window.empraConfig.video16, originalIndex: 16, videoName: "videoD_033" },
    { videoURL: window.empraConfig.video17, originalIndex: 17, videoName: "videoD_050" },
    { videoURL: window.empraConfig.video18, originalIndex: 18, videoName: "videoD_100" },
    { videoURL: window.empraConfig.video19, originalIndex: 19, videoName: "videoD_200" },
    { videoURL: window.empraConfig.video20, originalIndex: 20, videoName: "videoD_300" },

    { videoURL: window.empraConfig.video21, originalIndex: 21, videoName: "videoA_still" },
    { videoURL: window.empraConfig.video22, originalIndex: 22, videoName: "videoB_still" },
    { videoURL: window.empraConfig.video23, originalIndex: 23, videoName: "videoC_still" },
    { videoURL: window.empraConfig.video24, originalIndex: 24, videoName: "videoD_still" }
];
function valuesOfKey(dict, key) {
    return Object.values(dict)
        .filter(item => key in item)
        .map(item => item[key]);
}

function shuffleVideoList(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }

    list.forEach((item, idx) => {
        item.shuffledIndex = idx + 1;
    });

    return list;
}

const shuffledVideolist = shuffleVideoList(videolist);

$survey.updateCustomVariable(
    4,
    JSON.stringify(valuesOfKey(shuffledVideolist, 'videoName'))
);

let loopNo = 1;
const loopMax = shuffledVideolist.length;

let measurementAllowed = false;
let prematureKeyPress = false;
let videoStartTime = null;
let keyDownTime = null;
let measurementDone = false;
let isKeyDown = false;
let selectedVideoOriginalIndex;
let startVideoLoad = false;
let currentVideoEndedHandler = null;
let measurementStartTimeout = null;
let experimentActive = true;
let verbalEstimateActive = false;

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

const nextVideoInst = document.createElement('div');
nextVideoInst.id = "nextVideoInst";
nextVideoInst.style.zIndex = 5;
nextVideoInst.textContent =
    "Enter drücken, um den nächsten Durchgang zu starten.";
nextVideoInst.style.position = 'fixed';
nextVideoInst.style.top = '50%';
nextVideoInst.style.left = '50%';
nextVideoInst.style.transform = 'translate(-50%, -50%)';
nextVideoInst.style.display = 'block';
trialFrame.appendChild(nextVideoInst);

const successMessage = document.createElement('div');
successMessage.id = "successMessage";
successMessage.style.position = 'fixed';
successMessage.style.top = '50%';
successMessage.style.left = '50%';
successMessage.style.transform = 'translate(-50%, -50%)';
successMessage.style.zIndex = 80;
successMessage.style.width = 'calc(100% - 80px)';
successMessage.style.maxWidth = '680px';
successMessage.style.fontSize = '20px';
successMessage.style.lineHeight = '1.5';
successMessage.style.display = 'none';
trialFrame.appendChild(successMessage);

successMessage.innerHTML =
    '<p><strong>Wie lange dauerte das zuvor gesehene Video?</strong></p>' +
    '<p>Bitte geben Sie die Dauer des Videos in Sekunden an.</p>' +
    '<input id="verbalEstimateInput" type="text" inputmode="decimal" autocomplete="off" style="display:block;margin:12px auto;padding:10px;width:180px;font-size:22px;text-align:center">' +
    '<p id="verbalEstimateError" style="color:#a11717;min-height:1.5em"></p>';

const verbalEstimateInput =
    document.getElementById('verbalEstimateInput');

const verbalEstimateError =
    document.getElementById('verbalEstimateError');

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

function clearEndedHandler() {
    if (currentVideoEndedHandler) {
        video.removeEventListener(
            'ended',
            currentVideoEndedHandler
        );

        currentVideoEndedHandler = null;
    }
}

function clearMeasurementTimeout() {
    if (measurementStartTimeout) {
        clearTimeout(measurementStartTimeout);
        measurementStartTimeout = null;
    }
}

function resetTrialState() {
    verbalEstimateActive = false;
    measurementAllowed = false;
    prematureKeyPress = false;
    keyDownTime = null;
    measurementDone = false;
    isKeyDown = false;

    clearEndedHandler();
    clearMeasurementTimeout();

    successMessage.style.display = "none";

    video.pause();
    video.currentTime = 0;
    video.style.display = "none";

    setFrameColor('grey');
}

function finishAndPrepareNextTrial() {
    resetTrialState();
    loopNo++;

    if (loopNo === Math.ceil(loopMax / 2) + 1) {
        nextVideoInst.innerHTML =
            "<p><strong>Hälfte ist geschafft</strong></p><p>Enter drücken, um den nächsten Durchgang zu starten.</p>";
    } else {
        nextVideoInst.innerHTML =
            "<p>Enter drücken, um den nächsten Durchgang zu starten.</p>";
    }

    loadNewVideo();
}

function showVerbalEstimate() {
    verbalEstimateInput.value = '';
    verbalEstimateError.textContent = '';
    verbalEstimateActive = true;
    successMessage.style.display = 'block';
    verbalEstimateInput.focus();
}

function acceptVerbalEstimate() {
    if (!verbalEstimateActive) return;

    const entry =
        verbalEstimateInput.value.trim();

    if (
        !/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(entry)
    ) {
        verbalEstimateError.textContent =
            'Bitte geben Sie eine Zahl größer als 0 ein.';

        verbalEstimateInput.focus();
        return;
    }

    const seconds =
        Number(entry.replace(',', '.'));

    if (seconds <= 0) {
        verbalEstimateError.textContent =
            'Bitte geben Sie eine Zahl größer als 0 ein.';

        verbalEstimateInput.focus();
        return;
    }

    verbalEstimateActive = false;

    $survey.updateCustomVariable(
        selectedVideoOriginalIndex + 28,
        seconds
    );

    successMessage.style.display = 'none';

    setTimeout(function() {
        finishAndPrepareNextTrial();
    }, 2000);
}

function attachEndedHandler() {
    clearEndedHandler();

    currentVideoEndedHandler = function() {
        video.style.display = "none";
        whiteOverlay.style.zIndex = 60;

        setFrameColor('grey');

        for (
            let i = 0;
            i < frameElements.length;
            i++
        ) {
            frameElements[i].style.zIndex = 70;
        }

        measurementStartTimeout =
            setTimeout(() => {
                measurementAllowed = true;
                setFrameColor('yellow');
            }, 500);
    };

    video.addEventListener(
        'ended',
        currentVideoEndedHandler
    );
}

function prepareAndStartVideo() {
    resetTrialState();

    fix.style.zIndex = 70;
    nextVideoInst.style.zIndex = 10;
    whiteOverlay.style.zIndex = 60;

    for (let i = 0; i < frameElements.length; i++) {
        frameElements[i].style.zIndex = 70;
    }

    video.load();

    const onReady = function() {
        fix.style.zIndex = 10;
        whiteOverlay.style.zIndex = 40;

        video.style.display = "block";
        videoStartTime = Date.now();

        attachEndedHandler();
        video.play();
    };

    if (video.readyState >= 3) {
        onReady();
    } else {
        video.addEventListener(
            'canplaythrough',
            onReady,
            { once: true }
        );
    }
}

document.addEventListener(
    "keydown",
    function(event) {
        if (!experimentActive) return;

        if (
            event.code === "Enter" &&
            event.repeat
        ) {
            event.preventDefault();
            return;
        }

        if (verbalEstimateActive) {
            if (
                event.code === "Enter" ||
                event.code === "Space"
            ) {
                event.preventDefault();
            }

            if (event.code === "Enter") {
                acceptVerbalEstimate();
            }

            return;
        }

        if (
            event.code === "Space" ||
            event.code === "Enter"
        ) {
            event.preventDefault();
        }

        if (
            event.code === "Space" &&
            !measurementAllowed
        ) {
            prematureKeyPress = true;
        }

        if (
            event.code === "Space" &&
            measurementAllowed &&
            !measurementDone &&
            !isKeyDown
        ) {
            successMessage.style.display = "none";
            nextVideoInst.style.zIndex = "10";

            setFrameColor('green');

            keyDownTime = Date.now();
            isKeyDown = true;

            shuffledVideolist[
                loopNo - 1
            ].spacebarPressTimestamp =
                keyDownTime - videoStartTime;
        }

        if (
            event.code === "Enter" &&
            startVideoLoad
        ) {
            prematureKeyPress = false;
            startVideoLoad = false;
            prepareAndStartVideo();
        }
    }
);

document.addEventListener(
    "keyup",
    function(event) {
        if (!experimentActive) return;

        if (
            event.code === "Space" &&
            measurementAllowed &&
            !measurementDone &&
            isKeyDown
        ) {
            setFrameColor('grey');

            const keyUpTime = Date.now();
            const duration =
                keyUpTime - keyDownTime;

            if (prematureKeyPress) {
                shuffledVideolist[
                    loopNo - 1
                ].duration = -3;
            } else {
                shuffledVideolist[
                    loopNo - 1
                ].duration = duration;
            }

            $survey.updateCustomVariable(
                selectedVideoOriginalIndex + 4,
                shuffledVideolist[
                    loopNo - 1
                ].duration
            );

            measurementDone = true;
            isKeyDown = false;
            measurementAllowed = false;

            showVerbalEstimate();
        }
    }
);

function loadNewVideo() {
    if (loopNo <= loopMax) {
        source.src =
            shuffledVideolist[
                loopNo - 1
            ].videoURL;

        selectedVideoOriginalIndex =
            shuffledVideolist[
                loopNo - 1
            ].originalIndex;

        fix.style.zIndex = 10;
        whiteOverlay.style.zIndex = 60;
        nextVideoInst.style.zIndex = 70;
        video.style.display = "none";
        successMessage.style.display = "none";

        setFrameColor('grey');

        for (
            let i = 0;
            i < frameElements.length;
            i++
        ) {
            frameElements[i].style.zIndex = 10;
        }

        startVideoLoad = true;
    } else {
        experimentActive = false;
        weiterButton.click();
    }
}

loadNewVideo();
})();
