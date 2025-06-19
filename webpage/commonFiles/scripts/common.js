const startTime = new Date().getTime();
const logoConatainer = document.getElementById(`logo`);
const logoImage = document.getElementById(`logoImg`);
const blackOverlay = document.getElementById(`blackOverlay`);

// Logo
function fadeOutLogo(targetOpacity = 0) {
    if (logoConatainer.style.opacity === ``) {
        logoConatainer.style.opacity = 1;
    }
    const interval = setInterval(() => {
        if (logoConatainer.style.opacity <= targetOpacity) {
            clearInterval(interval);
        }
        logoConatainer.style.opacity = parseFloat(logoConatainer.style.opacity) - 0.02;
    }, 30);
}

function fadeInLogo(targetOpacity = 1) {
    if (logoConatainer.style.opacity === ``) {
        logoConatainer.style.opacity = 0;
    }
    const interval = setInterval(() => {
        if (logoConatainer.style.opacity >= 1) {
            clearInterval(interval);
        }
        logoConatainer.style.opacity = parseFloat(logoConatainer.style.opacity) + 0.02;
    }, 30);
}

function setLogoPosition(left, top) {
    logoConatainer.style.left = left;
    logoConatainer.style.top = top;
}

function setLogoSize(width, height) {
    logoConatainer.style.width = width;
    logoConatainer.style.height = height;
}

// Timer
let gameplayTimer = 0;
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
            blackOverlay.style.display = `none`;
            clearInterval(fadeOutBlackOverlayInterval);
        }
        blackOverlay.style.opacity = parseFloat(blackOverlay.style.opacity) - 0.02;
    }, 30);
}

function fadeOutBlackOverlay(targetOpacity = 0) {
    if (blackOverlay) {
        blackOverlay.style.display = `block`;
        if (blackOverlay.style.opacity === ``) {
            blackOverlay.style.opacity = 0;
        }
        const fadeOutBlackOverlayInterval = setInterval(() => {
            if (blackOverlay.style.opacity >= targetOpacity) {
                clearInterval(fadeOutBlackOverlayInterval);
            }
            blackOverlay.style.opacity = parseFloat(blackOverlay.style.opacity) + 0.02;
        }, 30);
    }
}

async function loadAudio(BGM_NAME) {
    return new Promise((resolve, reject) => {

        if (BGM_NAME !== null) {
            bgm.src = `../mp3/${BGM_NAME}`
            bgm.volume = 1.0
            bgm.load();
            bgm.play();
            bgm.oncanplaythrough = (() => {

                const min = Math.floor(bgm.duration / 60)
                const sec = Math.floor(bgm.duration % 60)
                const ms = `${bgm.duration}`.split(`.`)[1].substring(0, 3)

                document.getElementById(`audioTimer`).innerHTML =
                    `${min}`.padStart(2, `0`)
                    + `:`
                    + `${sec}`.padStart(2, `0`)
                    + `.`
                    + `${(ms)}`;
            });

            bgm.onplay = (() => {
                gameplayTimer = setInterval(startTimer, 10);
                resolve();
            });
            bgm.onended = fadeOutBlackOverlay;

        } else {
            resolve();
        }
    })
}

function printMousePointerPosition() {

    const rect = document.getElementById(`mapCanvas`).getBoundingClientRect();

    for (const key in rect) {
        document.getElementById(`mousePositionOverlay`).style[key] = rect[key];
    }

    console.log(`printMousePointerPosition`);


    document.getElementById(`mousePositionOverlay`).onmouseleave = (e) => {
        document.getElementById(`mousePosition`).style.display = `none`

    }
    document.getElementById(`mousePositionOverlay`).onmousemove = (e) => {
        document.getElementById(`mousePosition`).style.display = `block`
        document.getElementById(`mousePosition`).innerHTML = `${e.offsetX}, ${e.offsetY}`;
        document.getElementById(`mousePosition`).style.left = `${e.offsetX}px`;
        document.getElementById(`mousePosition`).style.top = `${e.offsetY}px`;
    }
}