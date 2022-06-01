(async () => {

    const VIEWER_MOVING_DURATION = 20; // s

    const container = document.getElementById(`container`);
    const viewer = document.getElementById(`viewer`);
    const viewerTransparent = document.getElementById(`viewerTransparent`);
    const canvasContainer = document.getElementById(`canvasContainer`);
    const canvasRender = document.getElementById(`canvasRender`);
    const mapCanvas = document.getElementById(`mapCanvas`);


    const NPCFiles = [
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
        const dogFileName = `[Animal]Dog${i%3}_pochi.png`
        AnimalList.dog.push(await new NPC(dogFileName));
        AnimalList.cat.push(await new NPC(`[Animal]Cat_pochi.png`));
        AnimalList.chickens.push(await new NPC(`[Animal]Chicken.png`));
        AnimalList.horse.push(await new NPC(`[Animal]Horse_pochi.png`));

        const sheepFilename = i % 2 === 0 ? `[Animal]Sheep-a_pochi.png` : `[Animal]Sheep-b_pochi.png`
        AnimalList.sheep.push(await new NPC(sheepFilename));
        AnimalList.goat.push(await new NPC(`[Animal]Goat_pochi.png`));
        AnimalList.cow.push(await new NPC(`[Animal]Cow_pochi.png`));
    }

    // Animals
    (() => {

        AnimalList.dog[0].setPosition(475, 171);
        AnimalList.dog[0].setDirection(NPC.DIRECTION.LEFT);
        AnimalList.dog[0].setMovingPattern(`h`, -288);
        AnimalList.dog[0].setSpeed(12);

        AnimalList.dog[1].setPosition(34, 340);
        AnimalList.dog[1].setDirection(NPC.DIRECTION.DOWN);
        AnimalList.dog[1].setMovingPattern(`v`, 120);
        AnimalList.dog[1].setSpeed(12);

        AnimalList.cat[0].setPosition(200, 440);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.LEFT);
        AnimalList.cat[0].setMovingPattern(`s`, 208);
        AnimalList.cat[0].setAnimationDelay(16);

        AnimalList.cat[1].setPosition(450, 93);
        AnimalList.cat[1].setDirection(NPC.DIRECTION.DOWN);
        AnimalList.cat[1].setMovingPattern(`v`, 39);
        AnimalList.cat[1].setSpeed(3);

        AnimalList.chickens[0].setPosition(400, 200);
        AnimalList.chickens[0].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.chickens[0].setMovingPattern(`h`, 100);
        AnimalList.chickens[0].setAnimationDelay(1);

        AnimalList.chickens[1].setPosition(20, 344);
        AnimalList.chickens[1].setDirection(NPC.DIRECTION.DOWN);
        AnimalList.chickens[1].setMovingPattern(`v`, 120);
        AnimalList.chickens[1].setSpeed(12);

        AnimalList.chickens[2].setPosition(240, 216);
        AnimalList.chickens[2].setDirection(NPC.DIRECTION.LEFT);
        AnimalList.chickens[2].setMovingPattern(`h`, -50);
        AnimalList.chickens[2].setAnimationDelay(2);

        AnimalList.chickens[3].setPosition(480, 216);
        AnimalList.chickens[3].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.chickens[3].setMovingPattern(`h`, -50);
        AnimalList.chickens[3].setAnimationDelay(2);

        AnimalList.chickens[4].setPosition(500, 240);
        AnimalList.chickens[4].setDirection(NPC.DIRECTION.UP);
        AnimalList.chickens[4].setMovingPattern(`v`, -20);
        AnimalList.chickens[4].setAnimationDelay(2);

        AnimalList.horse[0].setPosition(364, 570);
        AnimalList.horse[0].setDirection(NPC.DIRECTION.LEFT);
        AnimalList.horse[0].setMovingPattern(`s`, 0);
        AnimalList.horse[0].setAnimationDelay(8);

        AnimalList.horse[1].setPosition(394, 592);
        AnimalList.horse[1].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.horse[1].setMovingPattern(`s`, 0);
        AnimalList.horse[1].setAnimationDelay(8);

        AnimalList.sheep[0].setPosition(190, 20);
        AnimalList.sheep[0].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.sheep[0].setMovingPattern(`h`, 36);
        AnimalList.sheep[0].setAnimationDelay(3);

        AnimalList.sheep[1].setPosition(196, 36);
        AnimalList.sheep[1].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.sheep[1].setMovingPattern(`h`, 72);
        AnimalList.sheep[1].setAnimationDelay(8);

        AnimalList.sheep[2].setPosition(202, 52);
        AnimalList.sheep[2].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.sheep[2].setMovingPattern(`h`, 50);
        AnimalList.sheep[2].setAnimationDelay(5);

        AnimalList.sheep[3].setPosition(260, 20);
        AnimalList.sheep[3].setDirection(NPC.DIRECTION.LEFT);
        AnimalList.sheep[3].setMovingPattern(`0`, 36);
        AnimalList.sheep[3].setAnimationDelay(2);

        AnimalList.goat[0].setPosition(404, 570);
        AnimalList.goat[0].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.goat[0].setMovingPattern(`h`, 80);

        AnimalList.goat[1].setPosition(444, 600);
        AnimalList.goat[1].setDirection(NPC.DIRECTION.RIGHT);
        AnimalList.goat[1].setMovingPattern(`h`, 40);

        AnimalList.cow[0].setPosition(562, 565);
        AnimalList.cow[0].setDirection(NPC.DIRECTION.UP);
        AnimalList.cow[0].setMovingPattern(`s`, 0);
        AnimalList.cow[0].setAnimationDelay(8);

        AnimalList.cow[1].setPosition(578, 565);
        AnimalList.cow[1].setDirection(NPC.DIRECTION.UP);
        AnimalList.cow[1].setMovingPattern(`s`, 0);
        AnimalList.cow[1].setAnimationDelay(5);
    })();

    // NPCs
    (() => {

        NPCList[`[Chara]Samurai_USM.png`].setPosition(74, 208);
        NPCList[`[Chara]Samurai_USM.png`].setMovingPattern(`s`, 0);
        NPCList[`[Chara]Samurai_USM.png`].setAnimationDelay(16);

        NPCList[`[Chara]Fighter1_USM.png`].setPosition(56, 592);
        NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Fighter1_USM.png`].setMovingPattern(`s`, 0);
        NPCList[`[Chara]Fighter1_USM.png`].setAnimationDelay(2);

        NPCList[`[Chara]Fighter3_USM.png`].setPosition(298, 573);
        NPCList[`[Chara]Fighter3_USM.png`].setDirection(NPC.DIRECTION.RIGHT);
        NPCList[`[Chara]Fighter3_USM.png`].setMovingPattern(`s`, 0);
        NPCList[`[Chara]Fighter3_USM.png`].setAnimationDelay(8);

        NPCList[`[Chara]Cook.png`].setPosition(130, 456);
        NPCList[`[Chara]Cook.png`].setMovingPattern(`h`, 110);
        NPCList[`[Chara]Cook.png`].setAnimationDelay(10);

        NPCList[`[Chara]Girl1_USM.png`].setPosition(190, 436);
        NPCList[`[Chara]Girl1_USM.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Girl1_USM.png`].setAnimationDelay(16);

        // Weapon shop
        NPCList[`[Chara]Hero1_USM.png`].setPosition(540, 440);
        NPCList[`[Chara]Hero1_USM.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Hero1_USM.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Hero1_USM.png`].setAnimationDelay(16);

        // Town center board
        NPCList[`[Chara]Hero2_USM.png`].setPosition(356, 150);
        NPCList[`[Chara]Hero2_USM.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Hero2_USM.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Hero2_USM.png`].setAnimationDelay(8);

        // Town start (Players)
        NPCList[`[Chara]Hero3_USM.png`].setPosition(318, 596);
        NPCList[`[Chara]Hero3_USM.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Hero3_USM.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Hero3_USM.png`].setAnimationDelay(4);

        NPCList[`[Chara]Witch1_USM.png`].setPosition(318, 608);
        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Witch1_USM.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Witch1_USM.png`].setAnimationDelay(4);

        NPCList[`[Chara]Doctor.png`].setPosition(319, 620);
        NPCList[`[Chara]Doctor.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Doctor.png`].setMovingPattern(`s`);
        NPCList[`[Chara]Doctor.png`].setAnimationDelay(4);

        // Town Center
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(270, 200);
        NPCList[`[Chara]Civilian_Male_A.png`].setMovingPattern(`v`, 75);
        NPCList[`[Chara]Civilian_Male_A.png`].setAnimationDelay(4);

        // Farmer
        NPCList[`[Chara]Civilian_Male_B.png`].setPosition(256, 346);
        NPCList[`[Chara]Civilian_Male_B.png`].setAnimationDelay(6);
        NPCList[`[Chara]Civilian_Male_B.png`].setMovingPattern(`s`, 0);

        NPCList[`[Chara]Civilian_Male_C.png`].setPosition(587, 543);
        NPCList[`[Chara]Civilian_Male_C.png`].setMovingPattern(`v`, -270);


        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(448, 452);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.RIGHT);
        NPCList[`[Chara]Civilian_Female_A.png`].setMovingPattern(`s`, 0);
        NPCList[`[Chara]Civilian_Female_A.png`].setAnimationDelay(8);

        NPCList[`[Chara]Civilian_Female_B.png`].setPosition(464, 452);
        NPCList[`[Chara]Civilian_Female_B.png`].setDirection(NPC.DIRECTION.LEFT);
        NPCList[`[Chara]Civilian_Female_B.png`].setMovingPattern(`s`, 0);
        NPCList[`[Chara]Civilian_Female_B.png`].setAnimationDelay(8);

        NPCList[`[Chara]Civilian_Female_C.png`].setPosition(288, 538);
        NPCList[`[Chara]Civilian_Female_C.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Civilian_Female_C.png`].setMovingPattern(`s`, 0);
        NPCList[`[Chara]Civilian_Female_C.png`].setAnimationDelay(8);

        NPCList[`[Chara]Civilian_Child_A.png`].setPosition(193, 302);
        NPCList[`[Chara]Civilian_Child_A.png`].setMovingPattern(`h`, 100);
        NPCList[`[Chara]Civilian_Child_A.png`].setSpeed(8);

        NPCList[`[Chara]Civilian_Child_B.png`].setPosition(293, 286);
        NPCList[`[Chara]Civilian_Child_B.png`].setMovingPattern(`h`, -100);
        NPCList[`[Chara]Civilian_Child_B.png`].setSpeed(8);

        NPCList[`[Chara]Thief1_USM.png`].setPosition(76, 367);
        NPCList[`[Chara]Thief1_USM.png`].setAnimationDelay(8);
        NPCList[`[Chara]Thief1_USM.png`].setDirection(NPC.DIRECTION.RIGHT);
        NPCList[`[Chara]Thief1_USM.png`].setMovingPattern(`s`, 0);

        NPCList[`[Chara]Priest1_USM.png`].setPosition(540, 154);
        NPCList[`[Chara]Priest1_USM.png`].setMovingPattern(`v`, 116);
        NPCList[`[Chara]Priest1_USM.png`].setAnimationDelay(8);
    })();


    NPC.animate();

    viewer.style.transitionDuration = `${VIEWER_MOVING_DURATION}s`;
    viewerTransparent.style.transitionDuration = `${VIEWER_MOVING_DURATION}s`;
    console.log(`Set FPS to : ${1/VIEWER_MOVING_DURATION}`);


    let POSITION_NIN = {
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
        if (getViewerTranslateXY().translateX < POSITION_NIN.x) {
            ret.x = _random();
        } else if (getViewerTranslateXY().translateX > POSITION_MAX.x) {
            ret.x = _random();
        } else {
            ret.x = _random();
        }
        if (getViewerTranslateXY().translateY < POSITION_NIN.y) {
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
        console.log(`To : `, to)
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

    getTo();
    render();
    moveViewer();

})();