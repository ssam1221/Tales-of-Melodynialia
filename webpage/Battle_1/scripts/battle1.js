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
            name: `FlameSlash`,
            type: `Normal`,
            target: `Single`,
            image: `sprites/attack/NicePng_slash-effect-png_1824697.png`,
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
            name: `Firebolt`,
            description: [`Burns a target with high heat by friction of air.`],
            type: `Magic`,
            element: `Fire`,
            target: `Single`,
            image: `sprites/attack/fireball_explode.png`,
            mana: 8,
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
            mana: 8,
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
            HP: 56,
        });
        await battleInstance.addEnemy({
            name: `Quaverlime`,
            description: [`Faster and more agile slime than Crotchelime.`],
            speed: 44,
            icon: `sprites/enemy2.png`,
            HP: 53,
        });
        await battleInstance.addEnemy({
            name: `TwinQuaverlime`,
            description: [`Slime in the form of a combination of`, `two Quaverlimes.`],
            speed: 33,
            icon: `sprites/enemy3.png`,
            HP: 62,
        });
        await battleInstance.addEnemy({
            name: `SemiQuaverlime`,
            description: [`It is a slime that is more quick-tempered and agile`, `than other ordinary slime.`],
            speed: 50,
            icon: `sprites/enemy4.png`,
            HP: 59,
        });
    })();

    // Battle scenario
    (() => {

        battleInstance.addBattleScenario({
            action: `Attack`,
            attackName: `Sword Slash`,
            from: `Clef`,
            to: 1,
            damage: 19
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
            damage: 12
        });

        battleInstance.addBattleScenario({
            action: `MonsterAttack`,
            attackName: `Quick Attack`,
            from: 1,
            to: `Clef`,
            damage: 8
        });

        battleInstance.addBattleScenario({
            action: `MonsterAttack`,
            attackName: `Double attack`,
            from: 2,
            to: `Lirico`,
            damage: 11
        });

        battleInstance.addBattleScenario({
            action: `MonsterAttack`,
            attackName: `Rhythmical attack`,
            from: 3,
            to: `Lirico`,
            damage: 13
        });

        battleInstance.addBattleScenario({
            action: `Attack`,
            attackName: `Sword Slash`,
            from: `Clef`,
            to: 1,
            damage: 21
        });

        battleInstance.addBattleScenario({
            action: `Magic`,
            spell: `Lightning Bolt`,
            from: `Lirico`,
            to: 1,
            damage: 38
        });
    })();

    setTimeout(() => {
        battleInstance.start();
    }, 3000);
    // battleInstance.start();

    // setTimeout(battleInstance.end.bind(battleInstance), 3000);
})();