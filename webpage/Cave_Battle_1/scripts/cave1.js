(async () => {
    const BGM_NAME = `Tales of Melodynialia - Cave Battle.mp3`;

    const battleInstance = await new Battle({
        background: `./images/cave1.png`
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
            HP: 172,
            MP: 36
        });
        await battleInstance.addCharacter({
            name: `Lirico`,
            speed: 40,
            icon: `sprites/player2.png`,
            HP: 124,
            MP: 167
        });
        await battleInstance.addEnemy({
            name: `Quaverock`,
            description: [
                `A moving rock that quaver shape.`,
                `It prefer a silent place such as deep cave.`
            ],
            speed: 55,
            icon: `sprites/enemy1.png`,
            HP: 132,
            EXP: 72,
            gold: 41,
        });
        await battleInstance.addEnemy({
            name: `Dancing Bat`,
            description: [
                `Flying dancing in the cave.`,
                `Hunt prey by dancing skill.`
            ],
            speed: 44,
            icon: `sprites/enemy2.png`,
            HP: 87,
            EXP: 66,
            gold: 37,
        });
        await battleInstance.addEnemy({
            name: `Float Quaverock`,
            description: [
                `A floating rock that quaver shape.`,
                `Usually sleeping, but sensitive to sound.`
            ],
            speed: 50,
            icon: `sprites/enemy3.png`,
            HP: 153,
            EXP: 83,
            gold: 43,
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
                to: 0,
                damage: 9
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 0,
                damage: 17
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Clef`,
                damage: 17
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Quick Attack`,
                from: 1,
                to: `Lirico`,
                damage: 19
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 2,
                to: `Clef`,
                damage: 16
            });
        })();

        // Turn 2
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 0,
                damage: 6
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 0,
                damage: 19
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Shaking the ground`,
                from: 0,
                to: `Clef`,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Shaking the ground`,
                from: 0,
                to: `Lirico`,
                damage: 14
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Wing Attack`,
                from: 1,
                to: `Clef`,
                damage: 14
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 2,
                to: `Lirico`,
                damage: 23
            });
        })();

        // Turn 3
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 1,
                damage: 29
            });

            battleInstance.addBattleScenario({
                action: `Magic_Buff`,
                spell: `Fire Enchant`,
                from: `Lirico`,
                to: `Clef`,
                comments: `The power of flame is dwelling into Clef's sword!`

            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 0,
                to: `Clef`,
                damage: 0
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 1,
                to: `Clef`,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 2,
                to: `Clef`,
                damage: 19
            });
        })();

        // Turn 4
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 0,
                damage: 19
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
                damage: 16
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Bite`,
                from: 1,
                to: `Clef`,
                damage: 17
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Hitting the ground`,
                from: 2,
                to: `Clef`,
                damage: 23
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Hitting the ground`,
                from: 2,
                to: `Lirico`,
                damage: 28
            });
        })();

        // Turn 5
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 0,
                damage: 16
            });

            battleInstance.addBattleScenario({
                action: `Magic_Heal`,
                spell: `Cure`,
                from: `Lirico`,
                to: `Clef`,
                value: 100,
                comments: `Clef's HP is healed by 100!`
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
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 0,
                damage: 34, // Kill 0
                critical: true
            });

            battleInstance.addBattleScenario({
                action: `Magic_Heal`,
                spell: `Cure`,
                from: `Lirico`,
                to: `Lirico`,
                value: 100,
                comments: `Lirico's HP is healed by 90!`
            });

            // battleInstance.addBattleScenario({
            //     action: `MonsterAttack`,
            //     attackName: `Tackle`,
            //     from: 0,
            //     to: `Lirico`,
            //     damage: 7
            // });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Falling Dancing Step`,
                from: 1,
                to: `Clef`,
                damage: 12
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Falling Dancing Step`,
                from: 1,
                to: `Clef`,
                damage: 17
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Tackle`,
                from: 2,
                to: `Clef`,
                damage: 7
            });
        })();

        // Turn 7
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 2,
                damage: 19
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 2,
                damage: 38,
                critical: true
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
                attackName: `Tackle`,
                from: 2,
                to: `Clef`,
                damage: 7
            });
        })();

        // Turn 8
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 2,
                damage: 42,
                critical: true
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
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Sword Slash`,
                from: `Clef`,
                to: 2,
                damage: 14
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Lightning Bolt`,
                from: `Lirico`,
                to: 1,
                damage: 15
            });

            battleInstance.addBattleScenario({
                action: `MonsterAttack`,
                attackName: `Jumping`,
                from: 2,
                to: `Lirico`,
                damage: 56
            });
        })();

        // Turn 9
        (() => {
            battleInstance.addBattleScenario({
                action: `Attack`,
                attackName: `Flame Slash`,
                from: `Clef`,
                to: 1,
                damage: 42,
                critical: true
            });

            battleInstance.addBattleScenario({
                action: `Magic`,
                spell: `Firebolt`,
                from: `Lirico`,
                to: 2,
                damage: 25,
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