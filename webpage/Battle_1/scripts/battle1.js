(async () => {

    const battleInstance = await new Battle({
        background: `./images/background1.png`
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
            name: `Flame Slash`,
            type: `Normal`,
            target: `Single`,
            image: `sprites/attack/sword-slash-effect-fire-arrow-symbol-flame-transparent-png-1399491.png`,
            row: 3,
            col: 5
        });
        await battleInstance.addAttackEffect({
            name: `Sword Slash`,
            type: `Normal`,
            target: `Single`,
            image: `sprites/attack/SwordSlash.png`,
            row: 5,
            col: 5
        });
        await battleInstance.addAttackEffect({
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
            name: `Fire Enchant`,
            description: [`Add fire element to next attack.`],
            type: `Magic`,
            element: `Heal`,
            target: `Single`,
            image: `sprites/attack/heal_003.png`,
            mana: 25,
            row: 5,
            col: 8
        });
        await battleInstance.addAttackEffect({
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
            HP: 138,
            MP: 25
        });
        await battleInstance.addCharacter({
            name: `Lirico`,
            speed: 40,
            icon: `sprites/player2.png`,
            HP: 97,
            MP: 102
        });
        await battleInstance.addEnemy({
            name: `Crotchetlime`,
            description: [`The most common quarter note-shaped slime.`],
            speed: 55,
            icon: `sprites/enemy1.png`,
            HP: 48,
            EXP: 23,
            gold: 21,
        });
        await battleInstance.addEnemy({
            name: `Quaverlime`,
            description: [`Faster and more agile slime than Crotchelime.`],
            speed: 44,
            icon: `sprites/enemy2.png`,
            HP: 53,
            EXP: 29,
            gold: 25,
        });
        await battleInstance.addEnemy({
            name: `TwinQuaverlime`,
            description: [`Slime in the form of a combination of`, `two Quaverlimes.`],
            speed: 33,
            icon: `sprites/enemy3.png`,
            HP: 62,
            EXP: 43,
            gold: 37,
        });
        await battleInstance.addEnemy({
            name: `SemiQuaverlime`,
            description: [`It is a slime that is more quick-tempered and agile`, `than other ordinary slime.`],
            speed: 50,
            icon: `sprites/enemy4.png`,
            HP: 59,
            EXP: 38,
            gold: 29,
        });
    })();

    // Battle scenario
    (() => {

        // Turn 1
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 1,
                damage: 7
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Firebolt`,
                from: `Lirico`,
                to: 3,
                damage: 10
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Clef`,
                damage: 4
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Quick Attack`,
                from: 1,
                to: `Lirico`,
                damage: 5
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Clef`,
                damage: 8
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Lirico`,
                damage: 6
            });
        })();

        // Turn 2
        (() => {
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

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Lirico`,
                damage: 8
            });
        })();

        // Turn 3
        (() => {
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

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Lirico`,
                damage: 7
            });
        })();

        // Turn 4
        (() => {
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

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Lirico`,
                damage: 7
            });
        })();

        // Turn 5
        (() => {
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

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Clef`,
                damage: 0
            });
        })();

        // Turn 6
        (() => {
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

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Clef`,
                damage: 0
            });
        })();

        // Turn 7
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 3,
                damage: 10
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 3,
                damage: 14
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

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Double attack`,
                from: 2,
                to: `Clef`,
                damage: 7
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Clef`,
                damage: 5
            });
        })();

        // Turn 8
        (() => {
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

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Clef`,
                damage: 5
            });
        })();

        // Turn 8
        (() => {
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

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Rhythmical attack`,
                from: 3,
                to: `Clef`,
                damage: 8
            });
        })();

        // Turn 9
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 3,
                damage: 9
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 3,
                damage: 16
            });

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

    setTimeout(() => {
        battleInstance.start();
    }, 3000);
    // battleInstance.start();

    // setTimeout(battleInstance.end.bind(battleInstance), 3000);
})();