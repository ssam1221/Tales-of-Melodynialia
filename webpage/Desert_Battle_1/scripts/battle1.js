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
            mana: 32,
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
            mana: 12,
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
            mana: 18,
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
            mana: 17,
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
            name: `Quaverpion`,
            description: [
                `A scorpion that tail shape is quaver.`,
                `The venom of the tail is very deadly.`
            ],
            speed: 55,
            icon: `sprites/enemy1.png`,
            HP: 213,
            EXP: 112,
            gold: 87,
        });
        await battleInstance.addEnemy({
            name: `Fortisserpens`,
            description: [
                `Twin snakes with venomous fangs.`,
                `Always standing in the shape of a fortissimo`
            ],
            speed: 96,
            icon: `sprites/enemy2.png`,
            HP: 171,
            EXP: 102,
            gold: 76,
        });
        await battleInstance.addEnemy({
            name: `Fermatadon`,
            description: [
                `A sandstone golem with fermata pattern.`,
                `Usually sleeping, but sensitive to sound.`
            ],
            speed: 50,
            icon: `sprites/enemy3.png`,
            HP: 266,
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


            battleInstance.addBattleScenario({
                action: `Magic_Buff`,
                spell: `Fire Enchant`,
                from: `Lirico`,
                to: `Clef`,
                comments: `The power of flame is dwelling into Clef's sword!`
            });

            battleInstance.addBattleScenario({
                action: `Magic_Buff_All`,
                spell: `Song of Goddess of Appassionato`,
                from: `Trill`,
                to: `All`,
                value: 10,
                comments: [
                    `Trill is singing a powerful song!`,
                    `Increase all party's attack point by 10%.`
                ]
            });

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 0,
                damage: 53
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double Attack`,
                from: 1,
                to: `Clef`,
                damage: 23
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tail Scythe`,
                from: 0,
                to: `Trill`,
                damage: 37
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Throw Stone`,
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
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 1,
                damage: 43
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 1,
                damage: 61
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tail Scythe`,
                from: 0,
                to: `Clef`,
                damage: 64,
                critical: true
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double Poison Fang`,
                from: 1,
                to: `Trill`,
                damage: 17
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double Poison Fang`,
                from: 1,
                to: `Trill`,
                damage: 16
            });

            battleInstance.addBattleScenario({
                action: `Debuff`,
                status: `Poison`,
                to: `Trill`,
                comments: [
                    `Trill is poisoning by Fortisserpens's fang!`
                ]
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Earthquake`,
                from: 2,
                to: `Clef`,
                damage: 17
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Earthquake`,
                from: 2,
                to: `Lirico`,
                damage: 23
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Earthquake`,
                from: 2,
                to: `Trill`,
                damage: 0
            });
        })();

        // Turn 3
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Poison`,
                from: 1,
                to: `Trill`,
                damage: 11
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Presto Shot`,
                from: `Trill`,
                to: 0,
                hitCount: 2,
                damage: 43
            });

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 1,
                damage: 1
            });
            // Enemy 2 fainted

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 0,
                damage: 77,
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rapid Poison Tail`,
                from: 0,
                to: `Clef`,
                damage: 23
            });

            battleInstance.addBattleScenario({
                action: `Debuff`,
                status: `Poison`,
                to: `Clef`,
                comments: [
                    `Clef is poisoning by Quaverpion's tail!`
                ]
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Trill`,
                damage: 7
            });
        })();

        // Turn 4
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Poison`,
                from: 0,
                to: `Clef`,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Poison`,
                from: 1,
                to: `Trill`,
                damage: 11
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Presto Shot`,
                from: `Trill`,
                to: 0,
                hitCount: 2,
                damage: 35
            });
            // Enemy 0 fainted

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 2,
                damage: 33
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 2,
                damage: 64,
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Throw Rock`,
                from: 2,
                to: `Lirico`,
                damage: 92,
                critical: true
            });
        })();

        // Turn 5
        (() => {
            battleInstance.addTurn();

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Poison`,
                from: 0,
                to: `Clef`,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Poison`,
                from: 1,
                to: `Trill`,
                damage: 11
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Presto Shot`,
                from: `Trill`,
                to: 2,
                hitCount: 3,
                damage: 103,
                critical: true
            });

            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 2,
                damage: 34,
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 2,
                damage: 68,
                critical: true
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