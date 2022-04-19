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

    await battleInstance.addCharacter({
        name: `Player 1`,
        speed: 60,
        icon: `sprites/player1.png`,
        HP: 138,
        MP: 25
    });
    await battleInstance.addCharacter({
        name: `Player 2`,
        speed: 40,
        icon: `sprites/player2.png`,
        HP: 97,
        MP: 102
    });
    await battleInstance.addEnemy({
        name: `Slime 1`,
        speed: 55,
        icon: `sprites/enemy1.png`,
        HP: 56,
    });
    await battleInstance.addEnemy({
        name: `Slime 2`,
        speed: 44,
        icon: `sprites/enemy2.png`,
        HP: 53,
    });
    await battleInstance.addEnemy({
        name: `Slime 3`,
        speed: 33,
        icon: `sprites/enemy3.png`,
        HP: 62,
    });
    await battleInstance.addEnemy({
        name: `Slime 4`,
        speed: 50,
        icon: `sprites/enemy4.png`,
        HP: 59,
    });

    battleInstance.animate();

})();