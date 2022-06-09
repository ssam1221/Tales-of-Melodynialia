(async () => {

    const BGM_NAME = `Tales of Melodynialia - The Crowd Pub.mp3`;
    const VIEWER_MOVING_DURATION = 20; // s

    const bgm = document.getElementById(`bgm`);
    const container = document.getElementById(`container`);
    const viewer = document.getElementById(`viewer`);
    const viewerTransparent = document.getElementById(`viewerTransparent`);
    // const canvasContainer = document.getElementById(`canvasContainer`);
    const canvasRender = document.getElementById(`canvasRender`);
    const mapCanvas = document.getElementById(`mapCanvas`);
    const blackOverlay = document.getElementById(`blackOverlay`);

    // NPC.zoom(2);
    NPC.zoom(640 / 240);
    await NPC.setMapImage(`map/Tavern1.png`);

    const SCENARIO_TIMESTAMP = [
        4360, ////   0 Music start 1-1
        13090, ///   1 Music start 1-2
        21810, ///   2 Music start 2-1
        30540, ///   3 Music start 2-2
        39270, ///   4 Music start 3-1
        56720, ///   5 Music start 3-2
        74180, ///   6 Music start 4-1 (Enemy enter)
        91630, ///   7 Music start 4-2 (Fighting)
        109090, //   8 Music start 1a-1
        115781, //   9 Music start 1a-1/2
        120654, //  10 Music start 1a-2
        144000, //  11 Music start 2a-1
        161450, //  12 Music start 2a-2
        158900, //  13 Music End
    ];

    // Set Animate items
    const AnimationItemList = {};
    const AnimationItemFiles = [
        `pot_cooking.png`
    ]
    for await (const animationItemFile of AnimationItemFiles) {
        const itemInstance = await new NPC(`item_animate/${animationItemFile}`, {
            type: `animateItem`,
            sprite: {
                row: 1,
                col: 3
            }
        });
        AnimationItemList[animationItemFile] = itemInstance;
    }

    // Set static items
    const StaticItemList = {};
    const StaticItemFiles = [
        `pot.png`,
        // `meatball.png`,
        // `steak.png`
    ]

    const lights = {};

    const bulb = {
        on: await new NPC(`items/bulb_on.png`, {
            type: `item`
        }),
        off: await new NPC(`items/bulb_on.png`, {
            type: `item`
        }),
    }
    bulb.on.setPosition(147, 85);
    bulb.off.setPosition(147, 85);
    bulb.on.setOpacity(0);
    lights.bulb = await new NPC(`item_animate/light.png`, {
        type: `animateItem`,
        sprite: {
            row: 1,
            col: 3
        }
    });
    lights.bulb.setPosition(147, 86);
    lights.bulb.setOpacity(0);

    const candles = {
        static: [],
        animate: []
    }
    const candlePositionX = [21, 43, 180, 202]
    for (let i = 0; i < 4; i++) {
        lights[`candle${i}`] = await new NPC(`item_animate/light.png`, {
            type: `animateItem`,
            sprite: {
                row: 1,
                col: 3
            }
        });
        candles.static.push(await new NPC(`items/candle.png`, {
            type: `item`
        }));
        candles.animate.push(await new NPC(`item_animate/candle_fire.png`, {
            type: `animateItem`,
            sprite: {
                row: 1,
                col: 3
            }
        }));
    }

    // Beer & Alchols & Foods

    // Table
    /**
     * 1   2
     *  4 5 
     * 3   6
     */
    const TablePosition = [{
            x: 32,
            y: 104
        },
        {
            x: 192,
            y: 100
        },
        {
            x: 32,
            y: 152
        },
        {
            x: 82,
            y: 137
        },
        {
            x: 147,
            y: 137
        },
        {
            x: 192,
            y: 152
        },
    ]
    const NumOfTables = 6;
    const ItemsOnTableList = {
        Beer: [],
        Rum: [],
        Vodka: [],
        Empty_dish: [],
        Soup: [],
        Meatball: [],
        Steak: [],
        Fish: [],
        Omelet: [],
        Cake: [],
        // General items for table
        Coin: [],
        Sack: [],
    }
    for (let i = 0; i < NumOfTables; i++) {
        for (const item in ItemsOnTableList) {
            ItemsOnTableList[item].push(await new NPC(`items/${item.toLowerCase()}.png`, {
                type: `item`
            }));
        }
    }


    for await (const staticFile of StaticItemFiles) {
        const foodInstance = await new NPC(`items/${staticFile}`, {
            type: `item`
        });
        StaticItemList[staticFile] = foodInstance;
    }
    lights[`pot`] = (await new NPC(`item_animate/light.png`, {
        type: `animateItem`,
        sprite: {
            row: 1,
            col: 3
        }
    }));

    const NPCFiles = [

        `[Chara]Civilian_Female_A.png`, // Owner Wife
        `[Chara]Civilian_Female_B.png`,
        `[Chara]Civilian_Female_C.png`,
        `[Chara]Civilian_Male_A.png`,
        `[Chara]Civilian_Male_B.png`,
        `[Chara]Civilian_Male_C.png`,
        `[Chara]Fighter1_USM.png`,
        `[Chara]Fighter2_USM.png`,
        `[Chara]Fighter3_USM.png`,
        // `[Chara]Girl1_USM.png`,
        `[Chara]Hero1_USM.png`,
        `[Chara]Hero2_USM.png`,
        `[Chara]Hero3_USM.png`,
        `[Chara]Hero4_USM.png`,
        `[Chara]Witch1_USM.png`,
        // `[Chara]Doctor.png`,

        `[Chara]Thief1_USM.png`,
        `[Chara]Pirate_USM.png`,
        // `[Chara]Cook.png`,
        `[Chara]Samurai_USM.png`,
        `[Chara]Priest1_USM.png`,
        `[Chara]Priest2_USM.png`,
        `[Special]Edy.png`,
        `[Special]Wolfarl.png`,
    ]
    const NPCList = {};
    // Set NPCs
    for await (const npcFile of NPCFiles) {
        const npcInstance = await new NPC(npcFile);
        NPCList[npcFile] = npcInstance;
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
    for (let i = 0; i < 1; i++) {
        const dogFileName = `[Animal]Dog${i%3}_pochi.png`
        AnimalList.dog.push(await new NPC(dogFileName));
        AnimalList.cat.push(await new NPC(`[Animal]Cat_pochi.png`));
    }

    // Animate Items
    const pot_position = {
        x: 99,
        y: 79
    };
    // Static Items
    (() => {
        // StaticItemList[`meatball.png`].setStartTime(8000);

        for (const item in StaticItemList) {
            StaticItemList[item].setOpacity(0);
        }

        StaticItemList[`pot.png`].setOpacity(1);
        StaticItemList[`pot.png`].setPosition(pot_position.x, pot_position.y);

        AnimationItemList[`pot_cooking.png`].setOpacity(0)
        AnimationItemList[`pot_cooking.png`].setPosition(pot_position.x, pot_position.y);
        AnimationItemList[`pot_cooking.png`].setAnimationDelay(4);


        // StaticItemList[`meatball.png`].setPosition(180, 154);
        // StaticItemList[`steak.png`].setStartTime(1000);
        // StaticItemList[`steak.png`].setPosition(132, 104);
    })();

    // Initialize sprites
    (() => {
        // Foods
        for (const item in ItemsOnTableList) {
            for (let i = 0; i < NumOfTables; i++) {
                ItemsOnTableList[item][i].setOpacity(0);
                ItemsOnTableList[item][i].setPosition(TablePosition[i].x, TablePosition[i].y);
            }
        }

        // Lights
        for (const key in lights) {
            lights[key].setOpacity(0);
        }
        lights.pot.setPosition(pot_position.x, pot_position.y + 4);

        // Items
        for (let i = 0; i < 4; i++) {
            lights[`candle${i}`].setPosition(candlePositionX[i], 62);
            candles.static[i].setPosition(candlePositionX[i], 67);
            candles.animate[i].setOpacity(0);
            candles.animate[i].setAnimationDelay(1);
        }

        AnimationItemList[`pot_cooking.png`].setOpacity(0);
        AnimationItemList[`pot_cooking.png`].setPosition(pot_position.x, pot_position.y);
        AnimationItemList[`pot_cooking.png`].setAnimationDelay(4);

        for (const npc in NPCList) {
            NPCList[npc].setOpacity(0);
            NPCList[npc].setMovingPattern(`s`);
        }

        // NPCs
        // Tavern Owner
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.UP);
        NPCList[`[Chara]Civilian_Male_A.png`].setAnimationDelay(16);
        // Wife
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.DOWN);
        NPCList[`[Chara]Civilian_Female_A.png`].setAnimationDelay(16);

        // Customer 1
        NPCList[`[Chara]Samurai_USM.png`].setDirection(NPC.DIRECTION.DOWN);
        NPCList[`[Chara]Samurai_USM.png`].setAnimationDelay(8);
        // Customer 2
        NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.LEFT);
        NPCList[`[Chara]Fighter1_USM.png`].setAnimationDelay(8);
        // Customer 3
        NPCList[`[Chara]Hero1_USM.png`].setDirection(NPC.DIRECTION.RIGHT);
        NPCList[`[Chara]Hero1_USM.png`].setAnimationDelay(8);
        // Customer 4
        NPCList[`[Chara]Hero2_USM.png`].setDirection(NPC.DIRECTION.LEFT);
        NPCList[`[Chara]Hero2_USM.png`].setAnimationDelay(8);

        // Party
        NPCList[`[Chara]Hero4_USM.png`].setAnimationDelay(8);
        NPCList[`[Chara]Priest1_USM.png`].setAnimationDelay(8);
        NPCList[`[Chara]Witch1_USM.png`].setAnimationDelay(8);
        NPCList[`[Special]Wolfarl.png`].setAnimationDelay(8);

        AnimalList.cat[0].setDirection(NPC.DIRECTION.UP);
        AnimalList.cat[0].setMovingPattern(`s`);
        AnimalList.cat[0].setAnimationDelay(10);
        AnimalList.cat[0].setOpacity(0);

    })();

    // Animation order by timestamp
    // SCENARIO_TIMESTAMP[0]
    (() => {

        // Initialize candles
        for (let i = 0; i < 4; i++) {
            candles.animate[i].setPosition(candlePositionX[i], 67, SCENARIO_TIMESTAMP[0]);
        }
        bulb.on.fadein(SCENARIO_TIMESTAMP[0]);
        lights.bulb.fadein(SCENARIO_TIMESTAMP[0]);


        AnimalList.cat[0].fadein(SCENARIO_TIMESTAMP[0]);
        AnimalList.cat[0].setPosition(120, 98, SCENARIO_TIMESTAMP[0]);

        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(132, 88, SCENARIO_TIMESTAMP[0]);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(SCENARIO_TIMESTAMP[0]);

        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(32, 136, SCENARIO_TIMESTAMP[0]);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(SCENARIO_TIMESTAMP[0]);
    })();

    // SCENARIO_TIMESTAMP[0] ~ [1]
    (() => {
        // Move cat
        AnimalList.cat[0].fadeout(SCENARIO_TIMESTAMP[1] - 6000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[1] - 5000);
        AnimalList.cat[0].fadein(SCENARIO_TIMESTAMP[1] - 5000 + 1);
        AnimalList.cat[0].setPosition(100, 110, SCENARIO_TIMESTAMP[1] - 5000);
    })();

    // SCENARIO_TIMESTAMP[1]
    (() => {

        // Cooking in pot
        lights.pot.fadein(SCENARIO_TIMESTAMP[1]);
        StaticItemList[`pot.png`].fadeout(SCENARIO_TIMESTAMP[1]);
        AnimationItemList[`pot_cooking.png`].fadein(SCENARIO_TIMESTAMP[1]);

        // Move cat
        AnimalList.cat[0].fadeout(SCENARIO_TIMESTAMP[1] - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.DOWN, SCENARIO_TIMESTAMP[1]);
        AnimalList.cat[0].fadein(SCENARIO_TIMESTAMP[1] + 1);
        AnimalList.cat[0].setPosition(83, 79, SCENARIO_TIMESTAMP[1]);

        // Move owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(SCENARIO_TIMESTAMP[1] - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(100, 88, SCENARIO_TIMESTAMP[1]);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(SCENARIO_TIMESTAMP[1]);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(SCENARIO_TIMESTAMP[1] - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.UP, SCENARIO_TIMESTAMP[1]);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(148, 140, SCENARIO_TIMESTAMP[1] + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(SCENARIO_TIMESTAMP[1] + 2);

    })();

    // SCENARIO_TIMESTAMP[2]
    (() => {
        // Turn on 1/2 candle
        for (const idx of [1, 2]) {
            lights[`candle${idx}`].fadein(SCENARIO_TIMESTAMP[2]);
            candles.animate[idx].fadein(SCENARIO_TIMESTAMP[2]);
        }

        // Food
        ItemsOnTableList.Soup[0].fadein(SCENARIO_TIMESTAMP[2]);
        ItemsOnTableList.Rum[1].fadein(SCENARIO_TIMESTAMP[2]);

        // Fire off to pot
        lights.pot.fadeout(SCENARIO_TIMESTAMP[2]);
        StaticItemList[`pot.png`].fadein(SCENARIO_TIMESTAMP[2]);
        AnimationItemList[`pot_cooking.png`].fadeout(SCENARIO_TIMESTAMP[2]);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(SCENARIO_TIMESTAMP[2] - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[2]);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(49, 85, SCENARIO_TIMESTAMP[2] + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(SCENARIO_TIMESTAMP[2] + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(SCENARIO_TIMESTAMP[2] - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.UP, SCENARIO_TIMESTAMP[2]);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(206, 116, SCENARIO_TIMESTAMP[2] + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(SCENARIO_TIMESTAMP[2] + 2);

        NPCList[`[Chara]Samurai_USM.png`].setPosition(TablePosition[0].x, TablePosition[0].y - 20, SCENARIO_TIMESTAMP[2]);
        NPCList[`[Chara]Samurai_USM.png`].fadein(SCENARIO_TIMESTAMP[2]);

        NPCList[`[Chara]Fighter1_USM.png`].setPosition(TablePosition[1].x + 16, TablePosition[1].y, SCENARIO_TIMESTAMP[2]);
        NPCList[`[Chara]Fighter1_USM.png`].fadein(SCENARIO_TIMESTAMP[2]);
    })();


    // SCENARIO_TIMESTAMP[3]
    (() => {
        // Turn on 0/3 candle
        for (const idx of [0, 3]) {
            lights[`candle${idx}`].fadein(SCENARIO_TIMESTAMP[3]);
            candles.animate[idx].fadein(SCENARIO_TIMESTAMP[3]);
        }
        ItemsOnTableList.Soup[0].fadeout(SCENARIO_TIMESTAMP[3]);
        ItemsOnTableList.Empty_dish[0].fadein(SCENARIO_TIMESTAMP[3]);

        ItemsOnTableList.Rum[1].fadeout(SCENARIO_TIMESTAMP[3]);
        ItemsOnTableList.Beer[1].fadein(SCENARIO_TIMESTAMP[3]);

        NPCList[`[Chara]Samurai_USM.png`].fadeout(SCENARIO_TIMESTAMP[3]);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(SCENARIO_TIMESTAMP[3] - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[3]);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(49, 85, SCENARIO_TIMESTAMP[3] + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(SCENARIO_TIMESTAMP[3] + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(SCENARIO_TIMESTAMP[3] - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.UP, SCENARIO_TIMESTAMP[3]);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(206, 116, SCENARIO_TIMESTAMP[3] + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(SCENARIO_TIMESTAMP[3] + 2);

        NPCList[`[Chara]Hero1_USM.png`].setPosition(TablePosition[2].x - 16, TablePosition[2].y - 2, SCENARIO_TIMESTAMP[3]);
        NPCList[`[Chara]Hero1_USM.png`].fadein(SCENARIO_TIMESTAMP[3]);

        NPCList[`[Chara]Hero2_USM.png`].setPosition(TablePosition[2].x + 16, TablePosition[2].y, SCENARIO_TIMESTAMP[3]);
        NPCList[`[Chara]Hero2_USM.png`].fadein(SCENARIO_TIMESTAMP[3]);
    })();


    // SCENARIO_TIMESTAMP[4]
    (() => {
        ItemsOnTableList.Empty_dish[0].fadeout(SCENARIO_TIMESTAMP[4]);
        ItemsOnTableList.Rum[1].fadeout(SCENARIO_TIMESTAMP[4]);
        ItemsOnTableList.Vodka[1].fadein(SCENARIO_TIMESTAMP[4]);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(SCENARIO_TIMESTAMP[4] - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[3]);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(65, 101, SCENARIO_TIMESTAMP[4] + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(SCENARIO_TIMESTAMP[4] + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(SCENARIO_TIMESTAMP[4] - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.UP, SCENARIO_TIMESTAMP[3]);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(206, 116, SCENARIO_TIMESTAMP[4] + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(SCENARIO_TIMESTAMP[4] + 2);

        // Party Enter
        NPCList[`[Chara]Hero4_USM.png`].setPosition(124, 148, SCENARIO_TIMESTAMP[4]);
        NPCList[`[Chara]Hero4_USM.png`].fadein(SCENARIO_TIMESTAMP[4] + 1);
        NPCList[`[Chara]Hero4_USM.png`].setDirection(NPC.DIRECTION.UP);

        NPCList[`[Chara]Priest1_USM.png`].setPosition(108, 148, SCENARIO_TIMESTAMP[4]);
        NPCList[`[Chara]Priest1_USM.png`].fadein(SCENARIO_TIMESTAMP[4] + 1);
        NPCList[`[Chara]Priest1_USM.png`].setDirection(NPC.DIRECTION.UP);

        NPCList[`[Chara]Witch1_USM.png`].setPosition(124, 164, SCENARIO_TIMESTAMP[4]);
        NPCList[`[Chara]Witch1_USM.png`].fadein(SCENARIO_TIMESTAMP[4] + 1);
        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.UP);

        NPCList[`[Special]Wolfarl.png`].setPosition(108, 167, SCENARIO_TIMESTAMP[4]);
        NPCList[`[Special]Wolfarl.png`].fadein(SCENARIO_TIMESTAMP[4] + 1);
        NPCList[`[Special]Wolfarl.png`].setDirection(NPC.DIRECTION.UP);

    })();

    // SCENARIO_TIMESTAMP[5]
    (() => {
        ItemsOnTableList.Sack[0].fadein(SCENARIO_TIMESTAMP[4]);

        NPCList[`[Chara]Hero4_USM.png`].fadeout(SCENARIO_TIMESTAMP[5] - 1000);
        NPCList[`[Chara]Priest1_USM.png`].fadeout(SCENARIO_TIMESTAMP[5] - 1000);
        NPCList[`[Chara]Witch1_USM.png`].fadeout(SCENARIO_TIMESTAMP[5] - 1000);
        NPCList[`[Special]Wolfarl.png`].fadeout(SCENARIO_TIMESTAMP[5] - 1000);

        // Table 0 (Party)
        NPCList[`[Chara]Hero4_USM.png`].setDirection(NPC.DIRECTION.RIGHT, SCENARIO_TIMESTAMP[5]);
        NPCList[`[Chara]Priest1_USM.png`].setDirection(NPC.DIRECTION.UP, SCENARIO_TIMESTAMP[5]);
        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[5]);
        NPCList[`[Special]Wolfarl.png`].setDirection(NPC.DIRECTION.DOWN, SCENARIO_TIMESTAMP[5]);

        NPCList[`[Chara]Hero4_USM.png`].setPosition(TablePosition[0].x - 16, TablePosition[0].y - 2, SCENARIO_TIMESTAMP[5] + 1);
        NPCList[`[Chara]Hero4_USM.png`].fadein(SCENARIO_TIMESTAMP[5] + 2);

        NPCList[`[Chara]Priest1_USM.png`].setPosition(TablePosition[0].x, TablePosition[0].y + 12, SCENARIO_TIMESTAMP[5] + 1);
        NPCList[`[Chara]Priest1_USM.png`].fadein(SCENARIO_TIMESTAMP[5] + 2);

        NPCList[`[Chara]Witch1_USM.png`].setPosition(TablePosition[0].x + 16, TablePosition[0].y - 4, SCENARIO_TIMESTAMP[5] + 1);
        NPCList[`[Chara]Witch1_USM.png`].fadein(SCENARIO_TIMESTAMP[5] + 2);

        NPCList[`[Special]Wolfarl.png`].setPosition(TablePosition[0].x, TablePosition[0].y - 20, SCENARIO_TIMESTAMP[5] + 1);
        NPCList[`[Special]Wolfarl.png`].fadein(SCENARIO_TIMESTAMP[5] + 2);


    })();

    // SCENARIO_TIMESTAMP[6] (Enemy enter)
    (() => {
        
        // Enter thiefs
        NPCList[`[Chara]Thief1_USM.png`].setPosition(124, 148, SCENARIO_TIMESTAMP[6]);
        NPCList[`[Chara]Thief1_USM.png`].fadein(SCENARIO_TIMESTAMP[6] + 1);
        NPCList[`[Chara]Thief1_USM.png`].setDirection(NPC.DIRECTION.UP);

        NPCList[`[Chara]Pirate_USM.png`].setPosition(108, 148, SCENARIO_TIMESTAMP[6]);
        NPCList[`[Chara]Pirate_USM.png`].fadein(SCENARIO_TIMESTAMP[6] + 1);
        NPCList[`[Chara]Pirate_USM.png`].setDirection(NPC.DIRECTION.UP);

        NPCList[`[Special]Edy.png`].setPosition(108, 167, SCENARIO_TIMESTAMP[6]);
        NPCList[`[Special]Edy.png`].fadein(SCENARIO_TIMESTAMP[6] + 1);
        NPCList[`[Special]Edy.png`].setDirection(NPC.DIRECTION.UP);
    })();

    // SCENARIO_TIMESTAMP[7] (Fight start)
    (() => {
        NPCList[`[Chara]Hero4_USM.png`].fadeout(SCENARIO_TIMESTAMP[7] - 1000);
        NPCList[`[Chara]Priest1_USM.png`].fadeout(SCENARIO_TIMESTAMP[7] - 1000);
        NPCList[`[Chara]Witch1_USM.png`].fadeout(SCENARIO_TIMESTAMP[7] - 1000);
        NPCList[`[Special]Wolfarl.png`].fadeout(SCENARIO_TIMESTAMP[7] - 1000);
        NPCList[`[Chara]Thief1_USM.png`].fadeout(SCENARIO_TIMESTAMP[7] - 1000);
        NPCList[`[Chara]Pirate_USM.png`].fadeout(SCENARIO_TIMESTAMP[7] - 1000);
        NPCList[`[Special]Edy.png`].fadeout(SCENARIO_TIMESTAMP[7] - 1000);

        NPCList[`[Chara]Hero4_USM.png`].setDirection(NPC.DIRECTION.RIGHT, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Chara]Hero4_USM.png`].setPosition(108, 148, SCENARIO_TIMESTAMP[7] + 1);
        NPCList[`[Chara]Hero4_USM.png`].fadein(SCENARIO_TIMESTAMP[7] + 2);

        NPCList[`[Chara]Priest1_USM.png`].setDirection(NPC.DIRECTION.RIGHT, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Chara]Priest1_USM.png`].setPosition(92, 148, SCENARIO_TIMESTAMP[7] + 1);
        NPCList[`[Chara]Priest1_USM.png`].fadein(SCENARIO_TIMESTAMP[7] + 2);

        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.RIGHT, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Chara]Witch1_USM.png`].setPosition(108, 164, SCENARIO_TIMESTAMP[7] + 1);
        NPCList[`[Chara]Witch1_USM.png`].fadein(SCENARIO_TIMESTAMP[7] + 2);

        NPCList[`[Special]Wolfarl.png`].setDirection(NPC.DIRECTION.RIGHT, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Special]Wolfarl.png`].setPosition(92, 167, SCENARIO_TIMESTAMP[7] + 1);
        NPCList[`[Special]Wolfarl.png`].fadein(SCENARIO_TIMESTAMP[7] + 2);

        
        NPCList[`[Chara]Thief1_USM.png`].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Chara]Thief1_USM.png`].setPosition(152, 158, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Chara]Thief1_USM.png`].fadein(SCENARIO_TIMESTAMP[7] + 1);
        NPCList[`[Chara]Thief1_USM.png`].setAnimationDelay(8, SCENARIO_TIMESTAMP[7] + 2);

        NPCList[`[Chara]Pirate_USM.png`].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Chara]Pirate_USM.png`].setPosition(140, 148, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Chara]Pirate_USM.png`].fadein(SCENARIO_TIMESTAMP[7] + 1);
        NPCList[`[Chara]Pirate_USM.png`].setAnimationDelay(8, SCENARIO_TIMESTAMP[7] + 2);

        NPCList[`[Special]Edy.png`].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Special]Edy.png`].setPosition(140, 167, SCENARIO_TIMESTAMP[7]);
        NPCList[`[Special]Edy.png`].fadein(SCENARIO_TIMESTAMP[7] + 1);
        NPCList[`[Special]Edy.png`].setAnimationDelay(8, SCENARIO_TIMESTAMP[7] + 2);
    })();

    // SCENARIO_TIMESTAMP[8]
    (() => {

    })();

    // SCENARIO_TIMESTAMP[9]
    (() => {

    })();

    // SCENARIO_TIMESTAMP[10]
    (() => {

    })();

    // SCENARIO_TIMESTAMP[11]
    (() => {

    })();

    // SCENARIO_TIMESTAMP[12]
    (() => {

    })();

    // SCENARIO_TIMESTAMP[13]
    (() => {

    })();

    // SCENARIO_TIMESTAMP[14]
    (() => {
        for (let i = 0; i < 4; i++) {
            candles.animate[i].fadeout(SCENARIO_TIMESTAMP[14]);
        }
        for (const item in lights) {
            lights[item].fadein(SCENARIO_TIMESTAMP[14]);
        }

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

    const startTime = new Date().getTime();

    function startTimer() {
        const diff = new Date(new Date().getTime() - startTime);

        document.getElementById(`timer`).innerHTML = `` +
            `${diff.getMinutes().toString().padStart(2, `0`)}:` +
            `${diff.getSeconds().toString().padStart(2, `0`)}.` +
            `${diff.getMilliseconds().toString().padStart(3, `0`)}`;
    }

    function fadeInBlackOverlay(targetOpacity = 0) {
        if (blackOverlay.style.opacity === ``) {}
        const fadeOutBlackOverlayInterval = setInterval(() => {
            if (blackOverlay.style.opacity <= targetOpacity) {
                clearInterval(fadeOutBlackOverlayInterval);
            }
            blackOverlay.style.opacity = parseFloat(blackOverlay.style.opacity) - 0.02;
        }, 30);
    }

    function fadeOutBlackOverlay() {
        // blackOverlay.style.opacity = 0;
        const fadeOutBlackOverlayInterval = setInterval(() => {
            if (blackOverlay.style.opacity >= 1) {
                clearInterval(fadeOutBlackOverlayInterval);
            }
            blackOverlay.style.opacity = parseFloat(blackOverlay.style.opacity) + 0.02;
        }, 30);
    }

    async function loadAudio() {
        return new Promise((resolve, reject) => {

            if (BGM_NAME !== null) {
                bgm.src = `mp3/${BGM_NAME}`
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
    await loadAudio();
    blackOverlay.style.opacity = 1;
    setTimeout(() => {
        // fadeInBlackOverlay(0.2);
        fadeInBlackOverlay(0.9);
    }, 1360);
    setTimeout(() => {
        // fadeInBlackOverlay(0.2);
        fadeInBlackOverlay(0.7);
    }, SCENARIO_TIMESTAMP[0]);
    setTimeout(() => {
        fadeInBlackOverlay(0.6);
    }, SCENARIO_TIMESTAMP[2]);
    setTimeout(() => {
        fadeInBlackOverlay(0.5);
    }, SCENARIO_TIMESTAMP[3]);
    setTimeout(() => {
        fadeInBlackOverlay(0.2);
    }, SCENARIO_TIMESTAMP[5]);
    setTimeout(() => {
        fadeInBlackOverlay(0);
    }, SCENARIO_TIMESTAMP[7]);
    setTimeout(() => {
        fadeInBlackOverlay(0.9);
    }, SCENARIO_TIMESTAMP[14]);
    console.log(`BGM Start : ${BGM_NAME}`);

    getTo();
    // render();


})();