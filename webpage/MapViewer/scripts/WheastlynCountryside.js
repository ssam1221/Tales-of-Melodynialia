(async () => {
    const BGM_NAME = `Tales of Melodynialia - Wheastlyn Countryside.mp3`;
    const VIEWER_MOVING_DURATION = 20; // s

    const container = document.getElementById(`container`);
    const viewer = document.getElementById(`viewer`);
    const viewerTransparent = document.getElementById(`viewerTransparent`);
    const canvasContainer = document.getElementById(`canvasContainer`);
    const canvasRender = document.getElementById(`canvasRender`);
    const mapCanvas = document.getElementById(`mapCanvas`);

    await NPC.setMapImage(`map/WheastlynCountryside.png`);
    await NPC.setShadowImage(`npc/shadow.png`);

    const NPCFiles = [
        `[Chara]Civilian_Child_A.png`,
        `[Chara]Civilian_Child_B.png`,
        `[Chara]Civilian_Female_A.png`,
        `[Chara]Civilian_Female_B.png`,
        `[Chara]Civilian_Female_C.png`,
        `[Chara]Civilian_Male_A.png`,
        `[Chara]Civilian_Male_B.png`,
        `[Chara]Civilian_Male_C.png`,
        `[Chara]Fighter1_USM.png`,
        `[Chara]Fighter2_USM.png`,
        `[Chara]Fighter3_USM.png`,
        `[Chara]Girl1_USM.png`,
        `[Chara]Hero1_USM.png`,
        `[Chara]Hero2_USM.png`,

        `[Chara]Hero3_USM.png`,
        `[Chara]Witch1_USM.png`,
        `[Chara]Doctor.png`,

        `[Chara]Thief1_USM.png`,
        `[Chara]Cook.png`,
        `[Chara]Samurai_USM.png`,
        `[Chara]Priest1_USM.png`,
        // `[Chara]Priest2_USM.png`,
    ]
    const NPCList = {};
    // Set NPCs
    for await (const npcFile of NPCFiles) {
        const npcInstance = await new NPC(npcFile);
        // npcInstance.setPosition(100, 100);
        NPCList[npcFile] = npcInstance;
        // npcInstance.show();
    }

    const AnimalList = {
        dog: [],
        cat: [],
        chickens: [],
        horse: [],
        sheep: [],
        goat: [],
        cow: [],
    }
    for (let i = 0; i < 6; i++) {
        const dogFileName = `[Animal]Dog${i % 3}_pochi.png`
        AnimalList.dog.push(await new NPC(dogFileName));
        AnimalList.cat.push(await new NPC(`[Animal]Cat_pochi.png`));
        AnimalList.chickens.push(await new NPC(`[Animal]Chicken.png`));
        AnimalList.horse.push(await new NPC(`[Animal]Horse_pochi.png`));

        const sheepFilename = i % 2 === 0 ? `[Animal]Sheep-a_pochi.png` : `[Animal]Sheep-b_pochi.png`
        AnimalList.sheep.push(await new NPC(sheepFilename));
        AnimalList.goat.push(await new NPC(`[Animal]Goat_pochi.png`));
        AnimalList.cow.push(await new NPC(`[Animal]Cow_pochi.png`));
    }

    const Windmill = await new NPC(`item_animate/windmill.png`, {
        type: `animateItem`,
        sprite: {
            row: 3,
            col: 4
        }
    });
    Windmill.setPosition(408, 40);

    // Animals
    (() => {

        AnimalList.dog[0].setPosition(420, 264);
        AnimalList.dog[0].setDirection(NPC.DIRECTION.LEFT);
        AnimalList.dog[0].setMovingPattern(`s`);
        AnimalList.dog[0].setAnimationDelay(4);

        // AnimalList.dog[1].setPosition(34, 340);
        // AnimalList.dog[1].setDirection(NPC.DIRECTION.DOWN);
        // AnimalList.dog[1].setMovingPattern(`v`, 120);
        // AnimalList.dog[1].setSpeed(12);

        AnimalList.cat[0].setPosition(256, 70);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.DOWN);
        AnimalList.cat[0].setMovingPattern(`s`);
        AnimalList.cat[0].setAnimationDelay(16);

        // AnimalList.cat[1].setPosition(450, 93);
        // AnimalList.cat[1].setDirection(NPC.DIRECTION.DOWN);
        // AnimalList.cat[1].setMovingPattern(`v`, 39);
        // AnimalList.cat[1].setSpeed(3);

        // AnimalList.chickens[0].setPosition(400, 200);
        // AnimalList.chickens[0].setDirection(NPC.DIRECTION.RIGHT);
        // AnimalList.chickens[0].setMovingPattern(`h`, 100);
        // AnimalList.chickens[0].setAnimationDelay(1);

        AnimalList.chickens[1].setPosition(304, 24);
        AnimalList.chickens[1].setDirection(NPC.DIRECTION.DOWN);
        AnimalList.chickens[1].setMovingPattern(`v`, 80);
        AnimalList.chickens[1].setSpeed(6);

        AnimalList.chickens[2].setPosition(260, 520);
        AnimalList.chickens[2].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.chickens[2].setMovingPattern(`s`);
        AnimalList.chickens[2].setAnimationDelay(6);

        AnimalList.chickens[3].setPosition(285, 536);
        AnimalList.chickens[3].setDirection(NPC.DIRECTION.UP);
        AnimalList.chickens[3].setMovingPattern(`v`, -50);
        AnimalList.chickens[3].setAnimationDelay(8);

        AnimalList.chickens[4].setPosition(500, 240);
        AnimalList.chickens[4].setDirection(NPC.DIRECTION.UP);
        AnimalList.chickens[4].setMovingPattern(`v`, -20);
        AnimalList.chickens[4].setAnimationDelay(2);

        AnimalList.horse[0].setPosition(235, 116);
        AnimalList.horse[0].setDirection(NPC.DIRECTION.DOWN);
        AnimalList.horse[0].setMovingPattern(`s`, 0);
        AnimalList.horse[0].setAnimationDelay(8);

        AnimalList.horse[1].setPosition(265, 116);
        AnimalList.horse[1].setDirection(NPC.DIRECTION.DOWN);
        AnimalList.horse[1].setMovingPattern(`s`, 0);
        AnimalList.horse[1].setAnimationDelay(8);

        // AnimalList.sheep[0].setPosition(190, 20);
        // AnimalList.sheep[0].setDirection(NPC.DIRECTION.RIGHT);
        // AnimalList.sheep[0].setMovingPattern(`h`, 36);
        // AnimalList.sheep[0].setAnimationDelay(3);

        // AnimalList.sheep[1].setPosition(196, 36);
        // AnimalList.sheep[1].setDirection(NPC.DIRECTION.RIGHT);
        // AnimalList.sheep[1].setMovingPattern(`h`, 72);
        // AnimalList.sheep[1].setAnimationDelay(8);

        // AnimalList.sheep[2].setPosition(202, 52);
        // AnimalList.sheep[2].setDirection(NPC.DIRECTION.RIGHT);
        // AnimalList.sheep[2].setMovingPattern(`h`, 50);
        // AnimalList.sheep[2].setAnimationDelay(5);

        // AnimalList.sheep[3].setPosition(260, 20);
        // AnimalList.sheep[3].setDirection(NPC.DIRECTION.LEFT);
        // AnimalList.sheep[3].setMovingPattern(`0`, 36);
        // AnimalList.sheep[3].setAnimationDelay(2);

        // AnimalList.goat[0].setPosition(404, 570);
        // AnimalList.goat[0].setDirection(NPC.DIRECTION.RIGHT);
        // AnimalList.goat[0].setMovingPattern(`h`, 80);

        // AnimalList.goat[1].setPosition(444, 600);
        // AnimalList.goat[1].setDirection(NPC.DIRECTION.RIGHT);
        // AnimalList.goat[1].setMovingPattern(`h`, 40);

        AnimalList.cow[0].setPosition(122, 324);
        AnimalList.cow[0].setDirection(NPC.DIRECTION.DOWN);
        AnimalList.cow[0].setMovingPattern(`s`, 0);
        AnimalList.cow[0].setAnimationDelay(8);

        AnimalList.cow[1].setPosition(184, 288);
        AnimalList.cow[1].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.cow[1].setMovingPattern(`s`, 0);
        AnimalList.cow[1].setAnimationDelay(5);

        AnimalList.cow[2].setPosition(132, 264);
        AnimalList.cow[2].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.cow[2].setMovingPattern(`h`, 40);
        AnimalList.cow[2].setAnimationDelay(4);
    })();

    // NPCs
    (() => {
        // Town start (Players)
        NPCList[`[Chara]Hero3_USM.png`].setPosition(297, 218);
        NPCList[`[Chara]Hero3_USM.png`].setDirection(NPC.DIRECTION.RIGHT);
        NPCList[`[Chara]Hero3_USM.png`].setMovingPattern(`h`, 96);
        NPCList[`[Chara]Hero3_USM.png`].setAnimationDelay(2);

        NPCList[`[Chara]Witch1_USM.png`].setPosition(280, 214);
        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.RIGHT);
        NPCList[`[Chara]Witch1_USM.png`].setMovingPattern(`h`, 96);
        NPCList[`[Chara]Witch1_USM.png`].setAnimationDelay(2);

        NPCList[`[Chara]Doctor.png`].setPosition(263, 217);
        NPCList[`[Chara]Doctor.png`].setDirection(NPC.DIRECTION.RIGHT);
        NPCList[`[Chara]Doctor.png`].setMovingPattern(`h`, 96);
        NPCList[`[Chara]Doctor.png`].setAnimationDelay(2);


        // NPCList[`[Chara]Samurai_USM.png`].setPosition(74, 208);
        // NPCList[`[Chara]Samurai_USM.png`].setMovingPattern(`s`, 0);
        // NPCList[`[Chara]Samurai_USM.png`].setAnimationDelay(16);

        // NPCList[`[Chara]Fighter1_USM.png`].setPosition(56, 592);
        // NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.UP);
        // NPCList[`[Chara]Fighter1_USM.png`].setMovingPattern(`s`, 0);
        // NPCList[`[Chara]Fighter1_USM.png`].setAnimationDelay(2);

        // NPCList[`[Chara]Fighter3_USM.png`].setPosition(298, 573);
        // NPCList[`[Chara]Fighter3_USM.png`].setDirection(NPC.DIRECTION.RIGHT);
        // NPCList[`[Chara]Fighter3_USM.png`].setMovingPattern(`s`, 0);
        // NPCList[`[Chara]Fighter3_USM.png`].setAnimationDelay(8);

        // NPCList[`[Chara]Cook.png`].setPosition(130, 456);
        // NPCList[`[Chara]Cook.png`].setMovingPattern(`h`, 110);
        // NPCList[`[Chara]Cook.png`].setAnimationDelay(10);

        NPCList[`[Chara]Girl1_USM.png`].setPosition(148, 136);
        NPCList[`[Chara]Girl1_USM.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Girl1_USM.png`].setAnimationDelay(16);

        // // Weapon shop
        // NPCList[`[Chara]Hero1_USM.png`].setPosition(540, 440);
        // NPCList[`[Chara]Hero1_USM.png`].setDirection(NPC.DIRECTION.UP);
        // NPCList[`[Chara]Hero1_USM.png`].setMovingPattern(`s`);
        // NPCList[`[Chara]Hero1_USM.png`].setAnimationDelay(16);

        // // Town center board
        // NPCList[`[Chara]Hero2_USM.png`].setPosition(356, 150);
        // NPCList[`[Chara]Hero2_USM.png`].setDirection(NPC.DIRECTION.UP);
        // NPCList[`[Chara]Hero2_USM.png`].setMovingPattern(`s`);
        // NPCList[`[Chara]Hero2_USM.png`].setAnimationDelay(8);

        // Basket seller
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(270, 200);
        NPCList[`[Chara]Civilian_Male_A.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Civilian_Male_A.png`].setAnimationDelay(4);

        // Farmer
        NPCList[`[Chara]Civilian_Male_B.png`].setPosition(256, 486);
        NPCList[`[Chara]Civilian_Male_B.png`].setDirection(NPC.DIRECTION.LEFT);
        NPCList[`[Chara]Civilian_Male_B.png`].setAnimationDelay(6);
        NPCList[`[Chara]Civilian_Male_B.png`].setMovingPattern(`s`, 0);

        NPCList[`[Chara]Civilian_Male_C.png`].setPosition(258, 148);
        NPCList[`[Chara]Civilian_Male_C.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Civilian_Male_C.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Civilian_Male_C.png`].setAnimationDelay(6);


        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(118, 188);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.RIGHT);
        NPCList[`[Chara]Civilian_Female_A.png`].setMovingPattern(`s`, 0);
        NPCList[`[Chara]Civilian_Female_A.png`].setAnimationDelay(8);

        NPCList[`[Chara]Civilian_Female_B.png`].setPosition(134, 188);
        NPCList[`[Chara]Civilian_Female_B.png`].setDirection(NPC.DIRECTION.LEFT);
        NPCList[`[Chara]Civilian_Female_B.png`].setMovingPattern(`s`, 0);
        NPCList[`[Chara]Civilian_Female_B.png`].setAnimationDelay(8);

        NPCList[`[Chara]Civilian_Female_C.png`].setPosition(224, 272);
        NPCList[`[Chara]Civilian_Female_C.png`].setDirection(NPC.DIRECTION.DOWN);
        NPCList[`[Chara]Civilian_Female_C.png`].setMovingPattern(`v`, 72);
        NPCList[`[Chara]Civilian_Female_C.png`].setAnimationDelay(6);

        NPCList[`[Chara]Civilian_Child_A.png`].setPosition(126, 344);
        NPCList[`[Chara]Civilian_Child_A.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Civilian_Child_A.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Civilian_Child_A.png`].setSpeed(3);

        NPCList[`[Chara]Civilian_Child_B.png`].setPosition(400, 256);
        NPCList[`[Chara]Civilian_Child_B.png`].setDirection(NPC.DIRECTION.DOWN);
        NPCList[`[Chara]Civilian_Child_B.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Civilian_Child_B.png`].setAnimationDelay(6);

        // NPCList[`[Chara]Thief1_USM.png`].setPosition(76, 367);
        // NPCList[`[Chara]Thief1_USM.png`].setAnimationDelay(8);
        // NPCList[`[Chara]Thief1_USM.png`].setDirection(NPC.DIRECTION.RIGHT);
        // NPCList[`[Chara]Thief1_USM.png`].setMovingPattern(`s`, 0);

        // NPCList[`[Chara]Priest1_USM.png`].setPosition(540, 154);
        // NPCList[`[Chara]Priest1_USM.png`].setMovingPattern(`v`, 116);
        // NPCList[`[Chara]Priest1_USM.png`].setAnimationDelay(8);
    })();


    NPC.animate();

    viewer.style.transitionDuration = `${VIEWER_MOVING_DURATION}s`;
    viewerTransparent.style.transitionDuration = `${VIEWER_MOVING_DURATION}s`;
    console.log(`Set FPS to : ${1 / VIEWER_MOVING_DURATION}`);


    let POSITION_MIN = {
        x: 10,
        y: 10
    }
    let POSITION_MAX = {
        x: 390,
        y: 390
    }

    function getViewerTranslateXY() {
        const style = window.getComputedStyle(viewerTransparent);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return {
            translateX: parseInt(matrix.m41),
            translateY: parseInt(matrix.m42)
        }
    }

    function getRandomDirection() {
        // Return -1, 0, 1

        function _random() {
            const rand = Math.random();
            if (rand < 0.5) {
                return 0;
            } else {
                return 1;
            }
        }

        let ret = {
            x: 0,
            y: 0
        };
        if (getViewerTranslateXY().translateX < POSITION_MIN.x) {
            ret.x = _random();
        } else if (getViewerTranslateXY().translateX > POSITION_MAX.x) {
            ret.x = _random();
        } else {
            ret.x = _random();
        }
        if (getViewerTranslateXY().translateY < POSITION_MIN.y) {
            ret.y = _random();
        } else if (getViewerTranslateXY().translatey > POSITION_MAX.y) {
            ret.y = _random();
        } else {
            ret.y = _random();
        }
        return ret;
    }

    let to = {
        x: 1,
        y: 0
    }

    let prevTo = {
        x: 0,
        y: 0
    }

    let isFirst = true;

    function getTo() {
        if (isFirst) {
            isFirst = false;
            to = {
                x: 1,
                y: 0
            }
        } else {
            to = {
                x: getRandomDirection().x,
                y: getRandomDirection().y
            }
        }
        if (to.x === prevTo.x && to.y === prevTo.y) {
            getTo();
        }

        prevTo = {
            x: to.x,
            y: to.y
        }
        // console.log(`To : `, to)
    }

    let imageTag = new Image();
    async function render() {
        const ctx = canvasRender.getContext('2d');
        imageTag.src = mapCanvas.toDataURL('image/png');
        imageTag.onload = () => {
            // ctx.
            ctx.drawImage(
                imageTag,
                // 
                getViewerTranslateXY().translateX, // Cropped x
                getViewerTranslateXY().translateY, // Cropped y
                240, 240, // Cropped size
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
        getTo();
        // console.log(to);
        viewer.style.transform = `translate(${to.x * POSITION_MAX.x}px, ${to.y * POSITION_MAX.y}px)`;
        viewerTransparent.style.transform = `translate(${to.x * POSITION_MAX.x}px, ${to.y * POSITION_MAX.y}px)`;
        // console.log(`DONE`)


        // Do translate
        setTimeout(moveViewer, VIEWER_MOVING_DURATION * 1000);
    }

    await loadAudio(BGM_NAME);
    fadeInBlackOverlay();
    getTo();
    render();
    moveViewer();
    printMousePointerPosition();

})();