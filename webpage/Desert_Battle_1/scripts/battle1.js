(async () => {
    const BGM_NAME = `Tales of Melodynialia - Desert Battle.mp3`;

    const battleInstance = await new Battle({
        background: `./images/desert.jpg`
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
            Leave: {},
        }
    });
    // Attack / Magic
    await (async () => {
        await battleInstance.addAttackEffect({
            user: `Clef`,
            name: `Flame Slash`,
            type: `Normal`,
            target: `Single`,
            image: `sprites/attack/sword-slash-effect-fire-arrow-symbol-flame-transparent-png-1399491.png`,
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
            col: 8
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

        // Bard
        await battleInstance.addAttackEffect({
            user: `Trill`,
            name: `Song of Goddess of Appassionato`,
            description: [`The passionate song of Goddess Apacionato increases the damage of all party members.Sings a lively song with a fast tempo.`],
            type: `Magic`,
            element: `Heal`,
            target: `All`,
            image: `sprites/attack/SongofGoddessofAppassionato.png`,
            mana: 25,
            row: 3,
            col: 8,
            renderStartPosition: {
                x: 0,
                y: 0
            }
        });

        await battleInstance.addAttackEffect({
            user: `Trill`,
            name: `Presto Shot`,
            description: [`Fire multiple arrow shot to one target.`],
            type: `Magic`,
            target: `Single`,
            image: `sprites/attack/Presto Shot.png`,
            mana: 12,
            row: 8,
            col: 5,
            renderStartPosition: {
                x: -20,
                y: 250
            }
        });
    })();

    // Character and enemy
    await (async () => {
        await battleInstance.addCharacter({
            name: `Clef`,
            speed: 60,
            icon: `sprites/player1.png`,
            HP: 242,
            MP: 53
        });
        await battleInstance.addCharacter({
            name: `Lirico`,
            speed: 40,
            icon: `sprites/player2.png`,
            HP: 177,
            MP: 324
        });
        await battleInstance.addCharacter({
            name: `Trill`,
            speed: 72,
            icon: `sprites/player3.png`,
            HP: 209,
            MP: 124
        });

        await battleInstance.addEnemy({
            name: `Quaverock`,
            description: [
                `A moving rock that quaver shape.`,
                `It prefer a silent place such as deep cave.`
            ],
            speed: 55,
            icon: `sprites/enemy1.png`,
            HP: 309,
            EXP: 112,
            gold: 87,
        });
        await battleInstance.addEnemy({
            name: `Dancing Bat`,
            description: [
                `Flying dancing in the cave.`,
                `Hunt prey by dancing skill.`
            ],
            speed: 96,
            icon: `sprites/enemy2.png`,
            HP: 141,
            EXP: 102,
            gold: 76,
        });
        await battleInstance.addEnemy({
            name: `Float Quaverock`,
            description: [
                `A floating rock that quaver shape.`,
                `Usually sleeping, but sensitive to sound.`
            ],
            speed: 50,
            icon: `sprites/enemy3.png`,
            HP: 214,
            EXP: 135,
            gold: 94,
        });
        // await battleInstance.addEnemy({
        //     name: `SemiQuaverlime`,
        //     description: [`It is a slime that is more quick-tempered and agile`, `than other ordinary slime.`],
        //     speed: 50,
        //     icon: `sprites/enemy4.png`,
        //     HP: 59,
        //     EXP: 38,
        //     gold: 29,
        // });
    })();

    // Battle scenario
    (() => {

        // Turn 1
        (() => {
            battleInstance.addTurn();


            // battleInstance.addBattleScenario({
            //     action: `Magic_Buff`,
            //     spell: `Fire Enchant`,
            //     from: `Lirico`,
            //     to: `Clef`,
            //     comments: `The power of flame is dwelling into Clef's sword!`
            // });

            battleInstance.addBattleScenario({
                action: `Magic_Buff_All`,
                spell: `Song of Goddess of Appassionato`,
                from: `Trill`,
                to: `All`,
                value: 10,
                comments: [
                    `Trill sing a song! Increase all party's attack point `,
                    `by 10%.`
                ]
            });

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 0,
                damage: 39
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 1,
                to: `Clef`,
                damage: 23
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Quick Attack`,
                from: 0,
                to: `Trill`,
                damage: 21
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Trill`,
                damage: 34
            });
        })();

        // Turn 2
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Presto Shot`,
                from: `Trill`,
                to: 1,
                hitCount: 3,
                damage: 61
            });

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 1,
                damage: 6
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 1,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Clef`,
                damage: 5
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Quick Attack`,
                from: 1,
                to: `Clef`,
                damage: 4
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Lirico`,
                damage: 0
            });
        })();

        // Turn 3
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 2,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 0,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Clef`,
                damage: 5
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 1,
                to: `Clef`,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Clef`,
                damage: 7
            });
        })();

        // Turn 4
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 1,
                damage: 8
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Firebolt`,
                from: `Lirico`,
                to: 0,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Clef`,
                damage: 6
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 1,
                to: `Clef`,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Clef`,
                damage: 7
            });
        })();

        // Turn 5
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 2,
                damage: 16
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Firebolt`,
                from: `Lirico`,
                to: 2,
                damage: 10
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Lirico`,
                damage: 6
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 1,
                to: `Clef`,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Clef`,
                damage: 8
            });
        })();

        // Turn 6
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 2,
                damage: 8
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Firebolt`,
                from: `Lirico`,
                to: 2,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Lirico`,
                damage: 7
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 1,
                to: `Clef`,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Clef`,
                damage: 7
            });
        })();

        // Turn 7
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Lirico`,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 1,
                to: `Clef`,
                damage: 6
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Clef`,
                damage: 7
            });
        })();

        // Turn 8
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 2,
                damage: 9
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 2,
                damage: 15
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Lirico`,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 1,
                to: `Clef`,
                damage: 6
            });
        })();

        // Turn 8
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 1,
                damage: 8
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 1,
                damage: 14
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Lirico`,
                damage: 7
            });
        })();

        // Turn 9
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Lirico`,
                damage: 7
            });
        })();

        // Turn 10
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 0,
                damage: 11
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Firebolt`,
                from: `Lirico`,
                to: 0,
                damage: 13
            });
        })();
    })();

    setTimeout(async () => {
        await loadAudio(BGM_NAME);
        battleInstance.start();
    }, 2000);
    // battleInstance.start();

    // setTimeout(battleInstance.end.bind(battleInstance), 3000);
})();