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
    await (async () => {
        await battleInstance.addAttackEffect({
            name: `FlameSlash`,
            type: `Normal`,
            image: `sprites/attack/NicePng_slash-effect-png_1824697.png`,
            row: 3,
            col: 5
        });
        await battleInstance.addAttackEffect({
            name: `Sword Slash`,
            type: `Normal`,
            image: `sprites/attack/slash.png`,
            row: 5,
            col: 5
        });
    })();
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
            description: `Monster 1`,
            speed: 55,
            icon: `sprites/enemy1.png`,
            HP: 56,
        });
        await battleInstance.addEnemy({
            name: `Quaverlime`,
            description: `Monster 2`,
            speed: 44,
            icon: `sprites/enemy2.png`,
            HP: 53,
        });
        await battleInstance.addEnemy({
            name: `TwinQuaverlime`,
            description: `Monster 3`,
            speed: 33,
            icon: `sprites/enemy3.png`,
            HP: 62,
        });
        await battleInstance.addEnemy({
            name: `SemiQuaverlime`,
            description: `Monster 4`,
            speed: 50,
            icon: `sprites/enemy4.png`,
            HP: 59,
        });
    })();

    battleInstance.addBattleScenario({
        action: `Attack`,
        attackName: `Sword Slash`,
        from: `Clef`,
        to: 3,
        damage: 30
    });
    // setTimeout(() => {
    // battleInstance.start();
    // setTimeout(battleInstance.end.bind(battleInstance), 3000);
    // }, 3000);
    battleInstance.start();

    // setTimeout(battleInstance.end.bind(battleInstance), 3000);
})();