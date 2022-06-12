const SCENARIO_TIMESTAMP = [
    4360, ////   0 Music start 1-1
    13090, ///   1 Music start 1-2
    21810, ///   2 Music start 2-1
    30540, ///   3 Music start 2-2
    39270, ///   4 Music start 3-1a (Enter party)
    48000, ///   5 Music start 3-1b (Party sit)
    56720, ///   6 Music start 3-2a
    65450, ///   7 Music start 3-2b
    74180, ///   8 Music start 4-1a (Enemy enter)
    82900, ///   9 Music start 4-1b (Fighting start)
    91630, ///  10 Music start 4-2b 
    100360, /// 11 Music start 4-2b 
    109090, //  12 Music start 1a-1
    115781, //  13 Music start 1a-1/2
    120654, //  14 Music start 1a-2
    144000, //  15 Music start 2a-1
    161450, //  16 Music start 2a-2
    178900, //  17 Music End
];

(async () => {
    const BEAT = 4365 / 4;

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

    let SCENARIO_TIMESTAMP_INDEX = 0;
    const SCENARIO_TIMESTAMP = [
        4360, ////   0 Music start 1-1
        13090, ///   1 Music start 1-2
        21810, ///   2 Music start 2-1
        30540, ///   3 Music start 2-2
        39270, ///   4 Music start 3-1a (Enter party)
        48000, ///   5 Music start 3-1b (Party sit)
        56720, ///   6 Music start 3-2a
        65450, ///   7 Music start 3-2b
        74180, ///   8 Music start 4-1a (Enemy enter)
        82900, ///   9 Music start 4-1b (Fighting start)
        91630, ///  10 Music start 4-2b 
        100360, /// 11 Music start 4-2b 
        109090, //  12 Music start 1a-1
        115781, //  13 Music start 1a-1/2
        120654, //  14 Music start 1a-2
        144000, //  15 Music start 2a-1
        161450, //  16 Music start 2a-2
        178900, //  17 Music End
    ];
    let SCENARIO_TIMESTAMP_INDEX_CONSOLE = 0;
    for (const timestamp of SCENARIO_TIMESTAMP) {
        setTimeout(() => {
            console.log(`Start scenario : [${SCENARIO_TIMESTAMP_INDEX_CONSOLE}] : ${SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX_CONSOLE]}`);
            SCENARIO_TIMESTAMP_INDEX_CONSOLE++;
        }, timestamp);
    }
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
        `coin.png`,
        `sack.png`,
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
        Bread: [],
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
        Map: [],
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

    // Battle effect
    const numOfBattleEffect = 3;
    const BattleEffect = {
        Slash: [],
        FlameSlash: [],
        Fireball: []
    }
    for (let i = 0; i < numOfBattleEffect; i++) {
        BattleEffect.Slash.push(await new NPC(`action_animate/slash.png`, {
            type: `animateItem`,
            sprite: {
                row: 5,
                col: 5
            }
        }));
        BattleEffect.Slash[i].setOpacity(0);
        BattleEffect.FlameSlash.push(await new NPC(`action_animate/FlameSlash.png`, {
            type: `animateItem`,
            sprite: {
                row: 3,
                col: 5
            }
        }));
        BattleEffect.FlameSlash[i].setOpacity(0);
        BattleEffect.Fireball.push(await new NPC(`action_animate/fireball_explode.png`, {
            type: `animateItem`,
            sprite: {
                row: 5,
                col: 8
            }
        }));
        BattleEffect.Fireball[i].setOpacity(0);
    }

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

    SCENARIO_TIMESTAMP_INDEX = 0;
    // Animation order by timestamp
    // SCENARIO_TIMESTAMP[0]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);


        // Knife cooking Effect
        BattleEffect.Slash[0].setPosition(132, 80, TIMESTAMP);
        BattleEffect.Slash[0].fadein(TIMESTAMP + 1)

        // Initialize candles
        for (let i = 0; i < 4; i++) {
            candles.animate[i].setPosition(candlePositionX[i], 67, TIMESTAMP);
        }
        bulb.on.fadein(TIMESTAMP);
        lights.bulb.fadein(TIMESTAMP);


        AnimalList.cat[0].fadein(TIMESTAMP);
        AnimalList.cat[0].setPosition(120, 98, TIMESTAMP);

        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(132, 88, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP);

        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(32, 136, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP);
    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // TIMESTAMP ~ [1]
    (() => {
        // Move cat
        AnimalList.cat[0].fadeout(SCENARIO_TIMESTAMP[0] - 6000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.LEFT, SCENARIO_TIMESTAMP[0] - 5000);
        AnimalList.cat[0].fadein(SCENARIO_TIMESTAMP[0] - 5000 + 1);
        AnimalList.cat[0].setPosition(100, 110, SCENARIO_TIMESTAMP[0] - 5000);
    })();

    // SCENARIO_TIMESTAMP[1]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);

        // Cooking in pot
        BattleEffect.Slash[0].fadeout(TIMESTAMP)
        lights.pot.fadein(TIMESTAMP);
        StaticItemList[`pot.png`].fadeout(TIMESTAMP);
        AnimationItemList[`pot_cooking.png`].fadein(TIMESTAMP);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(83, 79, TIMESTAMP);

        // Move owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(100, 88, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(148, 140, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[2]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);
        // Turn on 1/2 candle
        for (const idx of [1, 2]) {
            lights[`candle${idx}`].fadein(TIMESTAMP);
            candles.animate[idx].fadein(TIMESTAMP);
        }

        // Food
        ItemsOnTableList.Soup[0].fadein(TIMESTAMP);
        ItemsOnTableList.Rum[1].fadein(TIMESTAMP);

        // Fire off to pot
        lights.pot.fadeout(TIMESTAMP);
        StaticItemList[`pot.png`].fadein(TIMESTAMP);
        AnimationItemList[`pot_cooking.png`].fadeout(TIMESTAMP);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(TablePosition[0].x - 16, TablePosition[0].y - 16, TIMESTAMP + 2);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(49, 85, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(206, 116, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Samurai_USM.png`].setPosition(TablePosition[0].x, TablePosition[0].y - 20, TIMESTAMP);
        NPCList[`[Chara]Samurai_USM.png`].fadein(TIMESTAMP);

        NPCList[`[Chara]Fighter1_USM.png`].setPosition(TablePosition[1].x + 16, TablePosition[1].y, TIMESTAMP);
        NPCList[`[Chara]Fighter1_USM.png`].fadein(TIMESTAMP);
    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;


    // SCENARIO_TIMESTAMP[3]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);
        // Turn on 0/3 candle
        for (const idx of [0, 3]) {
            lights[`candle${idx}`].fadein(TIMESTAMP);
            candles.animate[idx].fadein(TIMESTAMP);
        }
        ItemsOnTableList.Soup[0].fadeout(TIMESTAMP);
        ItemsOnTableList.Empty_dish[0].fadein(TIMESTAMP);

        ItemsOnTableList.Rum[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Beer[1].fadein(TIMESTAMP);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(TablePosition[2].x + 12, TablePosition[2].y + 10, TIMESTAMP + 2);

        NPCList[`[Chara]Samurai_USM.png`].fadeout(TIMESTAMP);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(TablePosition[2].x, TablePosition[2].y - 16, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(206, 116, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);

        // Table 2 customer create
        NPCList[`[Chara]Hero1_USM.png`].setPosition(TablePosition[2].x - 16, TablePosition[2].y - 2, TIMESTAMP);
        NPCList[`[Chara]Hero1_USM.png`].fadein(TIMESTAMP);

        NPCList[`[Chara]Hero2_USM.png`].setPosition(TablePosition[2].x + 16, TablePosition[2].y, TIMESTAMP);
        NPCList[`[Chara]Hero2_USM.png`].fadein(TIMESTAMP);
    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[4]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);
        ItemsOnTableList.Empty_dish[0].fadeout(TIMESTAMP);
        ItemsOnTableList.Rum[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Vodka[1].fadein(TIMESTAMP);

        // Cooking in pot
        lights.pot.fadein(TIMESTAMP);
        StaticItemList[`pot.png`].fadeout(TIMESTAMP);
        AnimationItemList[`pot_cooking.png`].fadein(TIMESTAMP);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(100, 88, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(116, 132, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(96, 156, TIMESTAMP + 2);

        // Party Enter
        NPCList[`[Chara]Hero4_USM.png`].setPosition(124, 148, TIMESTAMP);
        NPCList[`[Chara]Hero4_USM.png`].fadein(TIMESTAMP + 1);
        NPCList[`[Chara]Hero4_USM.png`].setDirection(NPC.DIRECTION.UP);

        NPCList[`[Chara]Priest1_USM.png`].setPosition(108, 148, TIMESTAMP);
        NPCList[`[Chara]Priest1_USM.png`].fadein(TIMESTAMP + 1);
        NPCList[`[Chara]Priest1_USM.png`].setDirection(NPC.DIRECTION.UP);

        NPCList[`[Chara]Witch1_USM.png`].setPosition(124, 164, TIMESTAMP);
        NPCList[`[Chara]Witch1_USM.png`].fadein(TIMESTAMP + 1);
        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.UP);

        NPCList[`[Special]Wolfarl.png`].setPosition(108, 167, TIMESTAMP);
        NPCList[`[Special]Wolfarl.png`].fadein(TIMESTAMP + 1);
        NPCList[`[Special]Wolfarl.png`].setDirection(NPC.DIRECTION.UP);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[5]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);

        lights.pot.fadeout(TIMESTAMP);
        AnimationItemList[`pot_cooking.png`].fadeout(TIMESTAMP);

        ItemsOnTableList.Sack[0].fadein(TIMESTAMP);
        ItemsOnTableList.Vodka[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Beer[1].fadein(TIMESTAMP);
        ItemsOnTableList.Steak[2].fadein(TIMESTAMP);

        NPCList[`[Chara]Civilian_Male_B.png`].setAnimationDelay(8);
        NPCList[`[Chara]Civilian_Male_C.png`].setAnimationDelay(8);

        NPCList[`[Chara]Civilian_Male_B.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_B.png`].setPosition(TablePosition[5].x, TablePosition[5].y + 16, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_B.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Male_C.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_C.png`].setPosition(TablePosition[5].x + 16, TablePosition[5].y, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_C.png`].fadein(TIMESTAMP + 2);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(20, 124, TIMESTAMP + 2);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(65, 101, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(TablePosition[5].x - 16, TablePosition[5].y - 16, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);

        // Table 0 (Party)
        NPCList[`[Chara]Hero4_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Priest1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Witch1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Special]Wolfarl.png`].fadeout(TIMESTAMP - 1000);

        NPCList[`[Chara]Hero4_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Priest1_USM.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Special]Wolfarl.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);

        NPCList[`[Chara]Hero4_USM.png`].setPosition(TablePosition[0].x - 16, TablePosition[0].y - 2, TIMESTAMP + 1);
        NPCList[`[Chara]Hero4_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Priest1_USM.png`].setPosition(TablePosition[0].x, TablePosition[0].y + 12, TIMESTAMP + 1);
        NPCList[`[Chara]Priest1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Witch1_USM.png`].setPosition(TablePosition[0].x + 16, TablePosition[0].y - 4, TIMESTAMP + 1);
        NPCList[`[Chara]Witch1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Special]Wolfarl.png`].setPosition(TablePosition[0].x, TablePosition[0].y - 20, TIMESTAMP + 1);
        NPCList[`[Special]Wolfarl.png`].fadein(TIMESTAMP + 2);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[6]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);
        lights.pot.fadein(TIMESTAMP);
        StaticItemList[`pot.png`].fadeout(TIMESTAMP);
        AnimationItemList[`pot_cooking.png`].fadein(TIMESTAMP);

        ItemsOnTableList.Beer[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Rum[1].fadein(TIMESTAMP);

        ItemsOnTableList.Fish[5].fadeout(TIMESTAMP);

        ItemsOnTableList.Sack[0].fadeout(TIMESTAMP);
        ItemsOnTableList.Map[0].fadein(TIMESTAMP);

        // Knife cooking Effect
        BattleEffect.Slash[0].setPosition(132, 80, TIMESTAMP);
        BattleEffect.Slash[0].fadein(TIMESTAMP + 1);

        NPCList[`[Chara]Civilian_Female_B.png`].setAnimationDelay(8);

        NPCList[`[Chara]Civilian_Female_B.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_B.png`].setPosition(TablePosition[4].x - 14, TablePosition[4].y - 6, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_B.png`].fadein(TIMESTAMP + 2);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(TablePosition[4].x - 14, TablePosition[4].y + 10, TIMESTAMP + 2);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(100, 88, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(132, 88, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);
    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[7]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);
        BattleEffect.Slash[0].fadeout(TIMESTAMP)
        ItemsOnTableList.Map[0].fadeout(TIMESTAMP);
        ItemsOnTableList.Bread[0].fadein(TIMESTAMP);

        ItemsOnTableList.Rum[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Vodka[1].fadein(TIMESTAMP);

        ItemsOnTableList.Steak[2].fadeout(TIMESTAMP);
        ItemsOnTableList.Empty_dish[2].fadein(TIMESTAMP);

        ItemsOnTableList.Meatball[5].fadein(TIMESTAMP);

        // Move Owner
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(65, 101, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(TablePosition[5].x, TablePosition[5].y - 16, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);
    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[8] (Enemy enter)
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);

        lights.pot.fadeout(TIMESTAMP);
        AnimationItemList[`pot_cooking.png`].fadeout(TIMESTAMP);
        ItemsOnTableList.Vodka[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Beer[1].fadein(TIMESTAMP);
        ItemsOnTableList.Empty_dish[2].fadeout(TIMESTAMP);
        ItemsOnTableList.Rum[2].fadein(TIMESTAMP);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(116, 132, TIMESTAMP + 2);

        // Look to thiefs
        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(100, 88, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(132, 88, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Hero1_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Hero2_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);

        NPCList[`[Chara]Civilian_Female_B.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_B.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_C.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);

        // Enter thiefs
        NPCList[`[Chara]Thief1_USM.png`].setPosition(124, 148, TIMESTAMP);
        NPCList[`[Chara]Thief1_USM.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP + 1);
        NPCList[`[Chara]Thief1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Pirate_USM.png`].setPosition(108, 148, TIMESTAMP);
        NPCList[`[Chara]Pirate_USM.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP + 1);
        NPCList[`[Chara]Pirate_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Special]Edy.png`].setPosition(108, 167, TIMESTAMP);
        NPCList[`[Special]Edy.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP + 1);
        NPCList[`[Special]Edy.png`].fadein(TIMESTAMP + 2);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[9] (Fight before)
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);


        ItemsOnTableList.Beer[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Rum[1].fadein(TIMESTAMP);


        NPCList[`[Chara]Hero4_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Priest1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Witch1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Special]Wolfarl.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Thief1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Pirate_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Special]Edy.png`].fadeout(TIMESTAMP - 1000);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(83, 79, TIMESTAMP + 2);

        // Party
        NPCList[`[Chara]Hero4_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Hero4_USM.png`].setPosition(108, 148, TIMESTAMP + 1);
        NPCList[`[Chara]Hero4_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Priest1_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Priest1_USM.png`].setPosition(92, 148, TIMESTAMP + 1);
        NPCList[`[Chara]Priest1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Witch1_USM.png`].setPosition(108, 164, TIMESTAMP + 1);
        NPCList[`[Chara]Witch1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Special]Wolfarl.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Special]Wolfarl.png`].setPosition(92, 167, TIMESTAMP + 1);
        NPCList[`[Special]Wolfarl.png`].fadein(TIMESTAMP + 2);

        // Enemy
        NPCList[`[Chara]Thief1_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Thief1_USM.png`].setPosition(152, 158, TIMESTAMP + 1);
        // NPCList[`[Chara]Thief1_USM.png`].setAnimationDelay(8, TIMESTAMP + 2);
        NPCList[`[Chara]Thief1_USM.png`].fadein(TIMESTAMP + 3);

        NPCList[`[Chara]Pirate_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Pirate_USM.png`].setPosition(140, 148, TIMESTAMP + 1);
        // NPCList[`[Chara]Pirate_USM.png`].setAnimationDelay(8, TIMESTAMP + 2);
        NPCList[`[Chara]Pirate_USM.png`].fadein(TIMESTAMP + 3);

        NPCList[`[Special]Edy.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Special]Edy.png`].setPosition(140, 167, TIMESTAMP + 1);
        // NPCList[`[Special]Edy.png`].setAnimationDelay(8, TIMESTAMP + 2);
        NPCList[`[Special]Edy.png`].fadein(TIMESTAMP + 3);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[10] (Fight phase 1)
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);

        ItemsOnTableList.Rum[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Vodka[1].fadein(TIMESTAMP);

        // NPCList[`[Chara]Hero4_USM.png`].fadeout(TIMESTAMP - 1000);
        // NPCList[`[Chara]Priest1_USM.png`].fadeout(TIMESTAMP - 1000);
        // NPCList[`[Chara]Witch1_USM.png`].fadeout(TIMESTAMP - 1000);
        // NPCList[`[Special]Wolfarl.png`].fadeout(TIMESTAMP - 1000);
        // NPCList[`[Chara]Thief1_USM.png`].fadeout(TIMESTAMP - 1000);
        // NPCList[`[Chara]Pirate_USM.png`].fadeout(TIMESTAMP - 1000);
        // NPCList[`[Special]Edy.png`].fadeout(TIMESTAMP - 1000);

        BattleEffect.Slash[0].setPosition(108, 148, TIMESTAMP);
        BattleEffect.Slash[1].setPosition(108, 164, TIMESTAMP);
        BattleEffect.Slash[2].setPosition(140, 167, TIMESTAMP);

        BattleEffect.FlameSlash[0].setPosition(140, 150, TIMESTAMP);

        BattleEffect.Slash[0].fadein(TIMESTAMP + 1);
        BattleEffect.Slash[1].fadein(TIMESTAMP + 1);
        BattleEffect.Slash[2].fadein(TIMESTAMP + 1);

        BattleEffect.FlameSlash[0].fadein(TIMESTAMP + 1);
    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[11] (Fight phase 2)
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);


        BattleEffect.Slash[0].fadeout(TIMESTAMP - 1000);
        BattleEffect.Slash[1].fadeout(TIMESTAMP - 1000);
        BattleEffect.Slash[2].fadeout(TIMESTAMP - 1000);

        BattleEffect.FlameSlash[0].fadeout(TIMESTAMP - 1000);
        BattleEffect.FlameSlash[1].setPosition(92, 148, TIMESTAMP);
        BattleEffect.FlameSlash[1].fadein(TIMESTAMP + 1);

        BattleEffect.Fireball[0].setPosition(152, 158, TIMESTAMP);
        BattleEffect.Fireball[0].fadein(TIMESTAMP + 1)

        // Enemy down
        NPCList[`[Chara]Pirate_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Special]Edy.png`].fadeout(TIMESTAMP - 1000);


    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[12] (Fight end)
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);
        BattleEffect.FlameSlash[1].fadeout(TIMESTAMP - 1000);
        BattleEffect.Fireball[0].fadeout(TIMESTAMP - 1000);

        NPCList[`[Chara]Thief1_USM.png`].fadeout(TIMESTAMP - 1000);

        NPCList[`[Chara]Hero4_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Priest1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Witch1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Special]Wolfarl.png`].fadeout(TIMESTAMP - 1000);

        // Drop gold
        StaticItemList[`coin.png`].setPosition(152, 158, TIMESTAMP);
        StaticItemList[`coin.png`].fadein(TIMESTAMP + 1);
        StaticItemList[`sack.png`].setPosition(140, 148, TIMESTAMP);
        StaticItemList[`sack.png`].fadein(TIMESTAMP + 1);

        // Party See door
        NPCList[`[Chara]Hero4_USM.png`].setPosition(124, 148, TIMESTAMP);
        NPCList[`[Chara]Hero4_USM.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP + 1);
        NPCList[`[Chara]Hero4_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Priest1_USM.png`].setPosition(108, 148, TIMESTAMP);
        NPCList[`[Chara]Priest1_USM.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP + 1);
        NPCList[`[Chara]Priest1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Witch1_USM.png`].setPosition(124, 164, TIMESTAMP);
        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP + 1);
        NPCList[`[Chara]Witch1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Special]Wolfarl.png`].setPosition(108, 167, TIMESTAMP);
        NPCList[`[Special]Wolfarl.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP + 1);
        NPCList[`[Special]Wolfarl.png`].fadein(TIMESTAMP + 2);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[13]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);

        // Get gold
        StaticItemList[`coin.png`].fadeout(TIMESTAMP + 1);
        StaticItemList[`sack.png`].fadeout(TIMESTAMP + 1);

        ItemsOnTableList.Omelet[4].fadein(TIMESTAMP);

        // All customer see party table

        NPCList[`[Chara]Hero1_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Hero2_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);

        NPCList[`[Chara]Civilian_Female_B.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_B.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_C.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);

        // Party go back to table
        NPCList[`[Chara]Hero4_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Priest1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Witch1_USM.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Special]Wolfarl.png`].fadeout(TIMESTAMP - 1000);

        NPCList[`[Chara]Hero4_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Priest1_USM.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Witch1_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);
        NPCList[`[Special]Wolfarl.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);

        NPCList[`[Chara]Hero4_USM.png`].setPosition(TablePosition[0].x - 16, TablePosition[0].y - 2, TIMESTAMP + 1);
        NPCList[`[Chara]Hero4_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Priest1_USM.png`].setPosition(TablePosition[0].x, TablePosition[0].y + 12, TIMESTAMP + 1);
        NPCList[`[Chara]Priest1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Witch1_USM.png`].setPosition(TablePosition[0].x + 16, TablePosition[0].y - 4, TIMESTAMP + 1);
        NPCList[`[Chara]Witch1_USM.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Special]Wolfarl.png`].setPosition(TablePosition[0].x, TablePosition[0].y - 20, TIMESTAMP + 1);
        NPCList[`[Special]Wolfarl.png`].fadein(TIMESTAMP + 2);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[14]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);

        ItemsOnTableList.Meatball[5].fadeout(TIMESTAMP);
        ItemsOnTableList.Empty_dish[5].fadein(TIMESTAMP);


        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);

        // See table customers
        NPCList[`[Chara]Hero1_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Hero2_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);

        NPCList[`[Chara]Civilian_Female_B.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_B.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_C.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP);


    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[15]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);
        ItemsOnTableList.Rum[2].fadeout(TIMESTAMP);
        ItemsOnTableList.Omelet[4].fadeout(TIMESTAMP);
        ItemsOnTableList.Empty_dish[4].fadein(TIMESTAMP);
        ItemsOnTableList.Empty_dish[5].fadeout(TIMESTAMP);
        ItemsOnTableList.Beer[5].fadein(TIMESTAMP);

        // // Spin alchol member
        // for (let spinCount = 0; spinCount < 15; spinCount++) {
        //     NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP + ((spinCount) * BEAT) / 2);
        //     NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP + ((spinCount + 1) * BEAT) / 2);
        //     NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP + ((spinCount + 2) * BEAT) / 2);
        //     NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP + ((spinCount + 3) * BEAT) / 2);
        // }
        // Spin alchol member
        for (let spinCount = 0; spinCount < 31; spinCount++) {
            NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP + ((spinCount) * BEAT) / 4);
            NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.RIGHT, TIMESTAMP + ((spinCount + 1) * BEAT) / 4);
            NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.UP, TIMESTAMP + ((spinCount + 2) * BEAT) / 4);
            NPCList[`[Chara]Fighter1_USM.png`].setDirection(NPC.DIRECTION.LEFT, TIMESTAMP + ((spinCount + 3) * BEAT) / 4);
        }

        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(TablePosition[1].x + 16, TablePosition[1].y - 16, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);

        // Party out
        NPCList[`[Chara]Hero4_USM.png`].fadeout(TIMESTAMP);
        NPCList[`[Chara]Priest1_USM.png`].fadeout(TIMESTAMP);
        NPCList[`[Chara]Witch1_USM.png`].fadeout(TIMESTAMP);
        NPCList[`[Special]Wolfarl.png`].fadeout(TIMESTAMP);
    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[16]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);

        ItemsOnTableList.Bread[0].fadeout(TIMESTAMP);
        ItemsOnTableList.Vodka[1].fadeout(TIMESTAMP);
        ItemsOnTableList.Empty_dish[4].fadeout(TIMESTAMP);
        ItemsOnTableList.Beer[5].fadeout(TIMESTAMP);

        // Fade out all
        NPCList[`[Chara]Fighter1_USM.png`].fadeout(TIMESTAMP);
        NPCList[`[Chara]Hero1_USM.png`].fadeout(TIMESTAMP);
        NPCList[`[Chara]Hero2_USM.png`].fadeout(TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_B.png`].fadeout(TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_C.png`].fadeout(TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_B.png`].fadeout(TIMESTAMP);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    // SCENARIO_TIMESTAMP[17]
    ((TIMESTAMP) => {
        setTimeout(() => {
            console.log(`Playing scenario [${TIMESTAMP}]`);
        }, TIMESTAMP);
        for (let i = 0; i < 4; i++) {
            candles.animate[i].fadeout(TIMESTAMP);
        }
        for (const item in lights) {
            lights[item].fadeout(TIMESTAMP);
        }

        NPCList[`[Chara]Civilian_Male_A.png`].fadeout(TIMESTAMP - 1000);
        NPCList[`[Chara]Civilian_Female_A.png`].fadeout(TIMESTAMP - 1000);

        // Move cat
        AnimalList.cat[0].fadeout(TIMESTAMP - 1000);
        AnimalList.cat[0].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        AnimalList.cat[0].fadein(TIMESTAMP + 1);
        AnimalList.cat[0].setPosition(116, 136, TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Male_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Male_A.png`].setPosition(132, 88, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Male_A.png`].fadein(TIMESTAMP + 2);

        NPCList[`[Chara]Civilian_Female_A.png`].setDirection(NPC.DIRECTION.DOWN, TIMESTAMP);
        NPCList[`[Chara]Civilian_Female_A.png`].setPosition(132, 136, TIMESTAMP + 1);
        NPCList[`[Chara]Civilian_Female_A.png`].fadein(TIMESTAMP + 2);

    })(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);
    SCENARIO_TIMESTAMP_INDEX++;

    NPC.animate(SCENARIO_TIMESTAMP[SCENARIO_TIMESTAMP_INDEX]);

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
    await loadAudio(BGM_NAME);

    // Logo image
    setTimeout(() => {
        // fadeInBlackOverlay(0.2);
        fadeOutLogo();
    }, 200);
    setTimeout(() => {
        // fadeInBlackOverlay(0.2);
        setLogoPosition(30, -40);
        setLogoSize(240, 240);
        fadeInLogo();
    }, SCENARIO_TIMESTAMP[0]);

    // Black overlay
    blackOverlay.style.opacity = 1;
    setTimeout(() => {
        fadeInBlackOverlay(0.9);
    }, 1360);
    setTimeout(() => {
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
    }, SCENARIO_TIMESTAMP[9]);
    setTimeout(() => {
        fadeOutBlackOverlay(0.6);
    }, SCENARIO_TIMESTAMP[16]);
    setTimeout(() => {
        fadeOutLogo();
        fadeOutBlackOverlay(0.9);
    }, SCENARIO_TIMESTAMP[17]);
    console.log(`BGM Start : ${BGM_NAME}`);

    getTo();
    // render();
})();