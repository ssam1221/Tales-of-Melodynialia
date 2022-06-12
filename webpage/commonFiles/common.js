const startTime = new Date().getTime();



function startTimer() {
    let diff;
    if (typeof NPC === `object` && NPC._DEBUG_SET_SCENARIO_INDEX_ENABLED !== false) {
        diff = new Date(NPC._DEBUG_SCENARIO_TIMESTAMP);
    } else {
        diff = new Date(new Date().getTime() - startTime);
    }

    document.getElementById(`timer`).innerHTML = `` +
        `${diff.getMinutes().toString().padStart(2, `0`)}:` +
        `${diff.getSeconds().toString().padStart(2, `0`)}.` +
        `${diff.getMilliseconds().toString().padStart(3, `0`)}`;
}

function fadeInBlackOverlay(targetOpacity = 0) {
    if (blackOverlay.style.opacity === ``) {
        blackOverlay.style.opacity = 1;
    }
    const fadeOutBlackOverlayInterval = setInterval(() => {
        if (blackOverlay.style.opacity <= targetOpacity) {
            clearInterval(fadeOutBlackOverlayInterval);
        }
        blackOverlay.style.opacity = parseFloat(blackOverlay.style.opacity) - 0.02;
    }, 30);
}

function fadeOutBlackOverlay() {
    if (blackOverlay.style.opacity === ``) {
        blackOverlay.style.opacity = 0;
    }
    const fadeOutBlackOverlayInterval = setInterval(() => {
        if (blackOverlay.style.opacity >= 1) {
            clearInterval(fadeOutBlackOverlayInterval);
        }
        blackOverlay.style.opacity = parseFloat(blackOverlay.style.opacity) + 0.02;
    }, 30);
}

async function loadAudio(BGM_NAME) {
    return new Promise((resolve, reject) => {

        if (BGM_NAME !== null) {
            bgm.src = `../mp3/${BGM_NAME}`
            bgm.load();
            bgm.play();
            bgm.onplay = (() => {
                setInterval(startTimer, 10);
                resolve();
            });
            bgm.onended = fadeOutBlackOverlay;

        } else {
            resolve();
        }
    })
}