(async () => {
    const BGM_NAME = `Tales of Melodynialia - Desert.mp3`;
    const VIEWER_MOVING_DURATION = 20; // s

    const viewer = document.getElementById(`viewer`);
    const viewerTransparent = document.getElementById(`viewerTransparent`);
    const container = document.getElementById(`container`);
    const canvasRender = document.getElementById(`canvasRender`);
    const mapCanvas = document.getElementById(`mapCanvas`);

    const MAP_WIDTH = 1600;

    container.style.width = `${MAP_WIDTH}px`;
    container.style.height = `480px`;

    await NPC.setMapImage(`map/Desert1.png`);

    const NPCFiles = [
        `[Chara]Hero4_USM.png`,
        `[Chara]Priest1_USM.png`,
        `[Chara]Witch1_USM.png`,
        `[Special]Wolfarl.png`,
    ]
    const NPCList = {};
    // Set NPCs


    const INITIAL_POSITION = {
        '[Chara]Hero4_USM.png': { x: MAP_WIDTH - 300 - 120, y: 210 },
        '[Chara]Priest1_USM.png': { x: MAP_WIDTH - 300 - 125, y: 230 },
        '[Chara]Witch1_USM.png': { x: MAP_WIDTH - 300 - 100, y: 230 },
        '[Special]Wolfarl.png': { x: MAP_WIDTH - 300 - 105, y: 215 },
    }
    const currentPosition = {}

    for await (const npcFile of NPCFiles) {
        currentPosition[npcFile] = INITIAL_POSITION[npcFile];

        const npcInstance = await new NPC(npcFile, {
            // targetCanvas: `staticPositionRender`
        });
        NPCList[npcFile] = npcInstance;

        NPCList[npcFile].setPosition(INITIAL_POSITION[npcFile].x, INITIAL_POSITION[npcFile].y);
        NPCList[npcFile].setDirection(NPC.DIRECTION.LEFT);
        NPCList[npcFile].setMovingPattern(`s`, 0);
        NPCList[npcFile].setAnimationDelay(8);
    }

    const MAP_DIFF = 0.1;
    const CHAR_DIFF = 1.5;
    const TIME_DIFF = 400;
    for (let i = 1; i < 1000; i++) {
        for (const npcFile of NPCFiles) {
            currentPosition[npcFile].x -= CHAR_DIFF;
            NPCList[npcFile].setPosition(currentPosition[npcFile].x, currentPosition[npcFile].y, i * TIME_DIFF);
        }
    }

    // TODO: Monsters













    NPC.animate();

    mapCanvas.setAttribute(`width`, `${MAP_WIDTH}`);
    mapCanvas.setAttribute(`height`, `480`);

    viewer.style.transitionDuration = `${VIEWER_MOVING_DURATION}s`;
    viewerTransparent.style.transitionDuration = `${VIEWER_MOVING_DURATION}s`;
    console.log(`Set FPS to : ${1 / VIEWER_MOVING_DURATION}`);


    const xPosition_MAX = MAP_WIDTH - 480;
    let xPosition = xPosition_MAX

    function getTargetPosition() {
        // for (const file of NPCFiles) {
        //     currentPosition[file].x -= MAP_DIFF;
        //     // NPCList[file].setPosition(currentPosition[file].x, currentPosition[file].y);
        // }
        xPosition -= MAP_DIFF;
        if (xPosition < 0) {
            xPosition = xPosition_MAX;
        }
    }

    let imageTag = new Image();


    async function render() {
        const ctx = canvasRender.getContext('2d');
        imageTag.src = mapCanvas.toDataURL('image/png');
        imageTag.onload = () => {

            getTargetPosition();

            ctx.drawImage(
                imageTag,
                // 
                xPosition,
                0, // Cropped y
                480, 480, // Cropped size
                0, 0, // Canvas position start from
                640, 640 // Canvas size 
            );

            setTimeout(render);
            // console.log(`render`)
        }
    }
    // window.requestAnimationFrame(render);
    async function moveViewer() {
        // if (false === isMoving()) {
        // getTargetPosition();
        // console.log(to);
        viewer.style.transform = `translate(${xPosition}px, 0px)`;
        viewerTransparent.style.transform = `translate(${xPosition}px, 0px)`;
        // console.log(`DONE`)


        // Do translate
        setTimeout(moveViewer, VIEWER_MOVING_DURATION * 1000);
    }

    await loadAudio(BGM_NAME);
    fadeInBlackOverlay();
    render();
    moveViewer();

})();