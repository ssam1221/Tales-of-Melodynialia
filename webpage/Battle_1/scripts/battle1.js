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
        name: ``,
        speed: 60,
        icon: `sprites/puyo-purple.png`,
        HP: 50,
        MP: 25
    });
    await battleInstance.addCharacter({
        name: ``,
        speed: 40,
        icon: `sprites/puyo-purple.png`,
        HP: 50,
        MP: 25
    });
    await battleInstance.addCharacter({
        name: ``,
        speed: 40,
        icon: `sprites/puyo-purple.png`,
        HP: 50,
        MP: 25
    });
    await battleInstance.addEnemy({
        name: ``,
        speed: 50,
        icon: `sprites/puyo-blue.png`,
        HP: 50,
    });
    await battleInstance.addEnemy({
        name: ``,
        speed: 50,
        icon: `sprites/puyo-red.png`,
        HP: 50,
    });
    await battleInstance.addEnemy({
        name: ``,
        speed: 50,
        icon: `sprites/puyo-yellow.png`,
        HP: 50,
    });

    battleInstance.animate();

})();