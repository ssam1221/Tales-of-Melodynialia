(async () => {
    const BGM_NAME = `Tales of Melodynialia - Boss Event Battle 1.mp3`;

    const battleInstance = await new Battle({
        background: `./images/background1.png`,
        battleOptions: {
            bounce: false,
            type: `Boss`,
            drawWeight: 1.8,
            drawShadow: false
        }
    });

    battleInstance.setUI({
        width: 600,
        height: 150,
        x: 20,
        y: 470,
        color: `rgba(0, 0, 255, 0.4)`,
        borderColor: `#FFFFFF`,
        borderRadius: 10,
        borderWidth: 5,
        font: {
            size: 24,
            color: `#FFFFFF`,
        },
        menu: {
            Attack: {},
            Magic: {},
            Item: {},
            'Run Away': {},
        }
    });
    // Attack / Magic
    await (async () => {
        await battleInstance.addAttackEffect({
            user: `Clef`,
            name: `Flame Slash`,
            type: `Normal`,
            target: `Single`,
            image: `sprites/attack/FlameSlash.png`,
            row: 3,
            col: 5
        });
        await battleInstance.addAttackEffect({
            user: `Clef`,
            name: `Sword Slash`,
            type: `Normal`,
            target: `Single`,
            image: `sprites/attack/SwordSlash.png`,
            row: 5,
            col: 5
        });
        await battleInstance.addAttackEffect({
            user: `Lirico`,
            name: `Cure`,
            description: [`Restore small amount of HP.`],
            type: `Magic`,
            element: `Heal`,
            target: `Single`,
            image: `sprites/attack/heal_002.png`,
            mana: 12,
            row: 5,
            col: 5
        });
        await battleInstance.addAttackEffect({
            user: `Lirico`,
            name: `Fire Enchant`,
            description: [`Add fire element to next attack.`],
            type: `Magic`,
            element: `Heal`,
            target: `Single`,
            image: `sprites/attack/fire_enchant_001.png`,
            mana: 25,
            row: 7,
            col: 3
        });
        await battleInstance.addAttackEffect({
            user: `Lirico`,
            name: `Firebolt`,
            description: [`Burns a target with high heat by friction of air.`],
            type: `Magic`,
            element: `Fire`,
            target: `Single`,
            image: `sprites/attack/fireball_explode.png`,
            mana: 7,
            row: 5,
            col: 8
        });
        await battleInstance.addAttackEffect({
            user: `Lirico`,
            name: `Lightning Bolt`,
            description: [`Strikes a single target by generating current in the air.`],
            type: `Magic`,
            element: `Thunder`,
            target: `Single`,
            image: `sprites/attack/Sprite_FX_Lightning_0009.png`,
            mana: 10,
            row: 1,
            col: 7,
            renderStartPosition: {
                x: 0,
                y: 0
            }
        });
    })();

    // Character and enemy
    await (async () => {
        await battleInstance.addCharacter({
            name: `Clef`,
            speed: 60,
            icon: `sprites/player1.png`,
            HP: 213,
            MP: 42
        });
        await battleInstance.addCharacter({
            name: `Lirico`,
            speed: 40,
            icon: `sprites/player2.png`,
            HP: 154,
            MP: 208
        });
        await battleInstance.addEnemy({
            name: `Ossabevaihc`,
            description: [`A snake-shaped monster living in a low cave.`],
            speed: 83,
            icon: `sprites/enemy1.png`,
            phaseInfo: [
                {
                    image: `sprites/enemy1.png`,
                    remainHP: 100
                },
                {
                    image: `sprites/enemy2.png`,
                    remainHP: 20
                }
            ],
            HP: 666,
            EXP: 666,
            gold: 666,
        });
    })();

    // Battle scenario
    (() => {

        // Turn 1
        (() => {
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Powerful Poison Fang`,
                from: 0,
                to: `Clef`,
                // damage: 47
                damage: 142
            });
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 0,
                damage: 27,
                critical: true
            });
            battleInstance.addBattleScenario({
                action: `Magic_Heal`,
                spell: `Cure`,
                from: `Lirico`,
                to: `Clef`,
                value: 150,
                comments: `Clef's HP is healed by 150!`
            });
        })();

        // Turn 2
        (() => {
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Death Stare`,
                from: 0,
                to: `Clef`,
                damage: 38
            });
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Death Stare`,
                from: 0,
                to: `Lirico`,
                damage: 46
            });

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 0,
                damage: 27
            });
            battleInstance.addBattleScenario({
                action: `Magic_Buff`,
                spell: `Fire Enchant`,
                from: `Lirico`,
                to: `Clef`,
                comments: `The power of flame is dwelling into Clef's sword!`
            });
        })();

        // Turn 3
        (() => {
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tail Slap`,
                from: 0,
                to: `Lirico`,
                damage: 82
            });

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 0,
                damage: 41
            });
            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 0,
                damage: 61
            });
        })();
        // Turn 4
        (() => {
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Death Stare`,
                from: 0,
                to: `Clef`,
                damage: 38
            });
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Death Stare`,
                from: 0,
                to: `Lirico`,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 0,
                damage: 86,
                critical: true
            });
            battleInstance.addBattleScenario({
                action: `Magic_Heal`,
                spell: `Cure`,
                from: `Lirico`,
                to: `Lirico`,
                value: 150,
                comments: `Lirico's HP is healed by 150!`
            });
        })();


        // Turn 5
        (() => {
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tail Slap`,
                from: 0,
                to: `Clef`,
                damage: 0
            });
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 0,
                damage: 53
            });
            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 0,
                damage: 57
            });
        })();

        // Turn 6
        (() => {
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Powerful Poison Fang`,
                from: 0,
                to: `Clef`,
                damage: 136
            });
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 0,
                damage: 57
            });
            battleInstance.addBattleScenario({
                action: `Magic_Heal`,
                spell: `Cure`,
                from: `Lirico`,
                to: `Clef`,
                value: 150,
                comments: `Clef's HP is healed by 150!`
            });
        })();

        // Turn 7
        (() => {

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Death Stare`,
                from: 0,
                to: `Clef`,
                damage: 75,
                critical: true
            });
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Death Stare`,
                from: 0,
                to: `Lirico`,
                damage: 44
            });
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 0,
                damage: 61
            });
            // Phase 2
            battleInstance.addBattleScenario({
                action: `Phase`,
                from: 0,
                description: [
                    `Ossabevaihc's cintamani is destroyed!`,
                    `Ossabevaihc is in a frenzy!`
                ]
            });
            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 0,
                damage: 57
            });
        })();

        // Turn 8
        (() => {
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Powerful Poison Fang`,
                from: 0,
                to: `Lirico`,
                damage: 150
            });
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 0,
                damage: 80,
                critical: true
            });
        })();


        // Turn 8
        (() => {
            battleInstance.addBattleScenario({
                action: `Text`,
                description: `Clef's sword flame fades!`
            });
            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tail Slap`,
                from: 0,
                to: `Clef`,
                damage: 77,
                critical: true
            });
        })();

        // Turn 9
        (() => {
        })();
        return;
    })();

    setTimeout(async () => {
        await loadAudio(BGM_NAME);
        battleInstance.start();
    }, 2000);
    // battleInstance.start();

    // setTimeout(battleInstance.end.bind(battleInstance), 3000);
})();