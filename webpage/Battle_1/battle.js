const FPS = 10;

const UI_MODE = {
    TEXT: `TEXT`,
    BATTLE_MENU: `BATTLE_MENU`,
    ATTACK: `ATTACK`,
    ENEMY_SELECT: `ENEMY_SELECT`,
    ATTACKING: `ATTACKING`,
    ATTACK_RESULT: `ATTACK_RESULT`,
    ITEM: `ITEM`,
    MAGIC: `MAGIC`
}

class Battle {
    constructor(param) {
        return new Promise((resolve, reject) => {
            this.backgroundImageInstance = new Image();
            this.backgroundImageInstance.src = param.background;

            this.isBattleStart = false;
            this.isBattleEnd = false;
            this.isBattleEndTextRendering = false;
            this.battleScenario = [];

            this.fadeFactor = 1;
            this.fadeSpeed = 0.02;

            this.UIContainer = {};
            this.UIContainerTextLine = 0;
            this.UIContainerText = ``;

            // UI Render Mode
            // Text | BattleMenu | Attack | EmenySelect | Item | Magic ...
            this.UIMode = UI_MODE.TEXT;

            this.renderingTextInUI = ``;

            this.AttackEffect = {};
            this.currentAttackTarget = 0;
            this.currentAttackName = ``;
            this.AttackScenario = [];
            this.attackRenderTimestamp = 0;
            this.Characters = [];
            this.sortedCharacters = [];

            this.enemiesList = [];
            this.attackingBlinkEffectCount = 0;

            this.itemList = [];
            this.selectedMenu = 0;

            this.selectedEnemy = 0;

            this.animationInterval = 0;
            this.isJumpFlag = 0;
            setInterval(() => {
                if (this.isBattleStart === true) {
                    this.isJumpFlag++;
                    this.isJumpFlag %= 2;
                }

            }, 375); // 160 BPM

            this.canvas = document.getElementById(`mapCanvas`);
            this.imgContainer = document.getElementById(`render`);
            // this.canvas = document.createElement(`canvas`);
            this.container = document.getElementById(`container`);

            // this.canvas.classList.add(`npc`)
            this.ctx = this.canvas.getContext(`2d`);
            this.backgroundImageInstance.onload = () => {
                resolve(this);
            }
        });
    }

    setUI(coMPonents) {
        this.UIContainer.color = coMPonents.color;
        this.UIContainer.width = coMPonents.width;
        this.UIContainer.height = coMPonents.height;
        this.UIContainer.top = coMPonents.y;
        this.UIContainer.left = coMPonents.x;
        this.UIContainer.borderColor = coMPonents.borderColor;
        this.UIContainer.borderRadius = coMPonents.borderRadius;
        this.UIContainer.borderWidth = coMPonents.borderWidth;
        this.UIContainer.font = coMPonents.font;
        this.UIContainer.menu = coMPonents.menu;
    }

    // Attack Effect (and magic) 

    async addAttackEffect(info) {
        return new Promise((resolve, reject) => {
            const attackInfo = info;
            attackInfo.imageInfo = new Image();
            attackInfo.imageInfo.src = info.image;
            attackInfo.imageInfo.onload = () => {
                attackInfo.spriteSize = {
                    width: attackInfo.imageInfo.naturalWidth / info.col,
                    height: attackInfo.imageInfo.naturalHeight / info.row
                }
                this.AttackEffect[info.name] = attackInfo;
                resolve();
            }
        });
    }

    async attackEnemy(attackScenario) {
        return new Promise(async (resolve, reject) => {
            const enemy = this.findEnemyInfoByIndex(attackScenario.to);
            const enemyName = enemy.name;
            this.renderingTextInUI = `${attackScenario.from} attacks ${enemyName}!`;

            this.attackRenderTimestamp = 0;
            this.currentAttackName = attackScenario.attackName;
            this.currentAttackTarget = attackScenario.to;
            const attackInfo = this.AttackEffect[attackScenario.attackName];

            const timestampMax = attackInfo.col * attackInfo.row;
            while (this.attackRenderTimestamp < timestampMax) {
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            this.attackRenderTimestamp++;
                            _resolve();
                        }, 1000 / FPS);
                    });
                })();
            }

            if (attackInfo.damage === 0) {
                this.renderingTextInUI = `${enemyName} avoid!`;
            } else {
                this.renderingTextInUI = `${enemyName} got ${attackScenario.damage} damage(s)!`;
            }

            let remainHPDiff = attackScenario.damage;
            while (remainHPDiff-- > 0) {
                enemy.isAttacking = true;
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            enemy.remainHP--;
                            _resolve();
                        }, 1000 / FPS);
                    });
                })();
            }
            enemy.isAttacking = false;

            console.log(`attackEnemy done`);
            setTimeout(() => {
                this.attackRenderTimestamp = 0;
                resolve();
            }, 1000);
        });
    }

    // Render attack effect
    async renderAttackEnemy(targetIndex, attackName) {
        return new Promise(async (resolve, reject) => {
            if (this.UIMode === UI_MODE.ATTACKING) {
                // console.log(`renderAttackEnemy start`)
                const enemyInfo = this.findEnemyInfoByIndex(targetIndex);
                const selector = this.canvas.getContext(`2d`);
                const base = {
                    // TODO  : Change static value to calc value
                    left: enemyInfo.drawStartPos.x + (4 * (targetIndex)),
                    top: enemyInfo.drawStartPos.y
                }

                const attackInfo = this.AttackEffect[attackName];
                // console.log(this.attackRenderTimestamp)
                const spriteRow = parseInt(this.attackRenderTimestamp / attackInfo.col);
                const spriteCol = this.attackRenderTimestamp % attackInfo.col;
                // console.log(`Sprite size : `, attackInfo.spriteSize)
                // console.log(`row / col : `, spriteRow, spriteCol);
                // this.ctx.drawImage(attackInfo.imageInfo, 0, 0, attackInfo.spriteSize.width, attackInfo.spriteSize.height,
                //     base.x, base.y, attackInfo.spriteSize.width, attackInfo.spriteSize.height);
                this.ctx.drawImage(attackInfo.imageInfo,
                    attackInfo.spriteSize.width * spriteCol,
                    attackInfo.spriteSize.height * spriteRow,
                    attackInfo.spriteSize.width, attackInfo.spriteSize.height,
                    base.left, base.top, 128, 128);
                setTimeout(resolve, 3000);
            }
        });
    }


    findEnemyInfoByIndex(idx) {
        return this.enemiesList[idx];
    }

    findEnemyInfoByName(name) {
        for (let idx = 0; idx < this.enemiesList.length; idx++) {
            if (name === this.enemiesList[idx].name) {
                return idx;
            }
        }
        return null;
    }

    drawEnemySelected(idx) {
        if (this.UIMode === UI_MODE.ENEMY_SELECT) {
            const enemyInfo = this.findEnemyInfoByIndex(idx);
            this.renderTextInUI(enemyInfo.description);
            // enemy.drawStartPos

            // Draw Arrow
            const selector = this.canvas.getContext(`2d`);
            const base = {
                // TODO  : Change static value to calc value
                left: enemyInfo.drawStartPos.x + 32 + (4 * (idx)),
                top: enemyInfo.drawStartPos.y - 70
            }
            selector.save();
            selector.beginPath();
            selector.lineWidth = 3;
            selector.strokeStyle = `#000000`;
            selector.moveTo(base.left, base.top);
            selector.lineTo(base.left + 50, base.top);
            selector.lineTo(base.left + 25, base.top + 25);
            selector.lineTo(base.left, base.top);
            selector.fill();
            selector.stroke();
            // Border
            // selector.moveTo(base.left , base.top + 2);
            // selector.lineTo(base.left + 50, base.top + 2 );
            // selector.lineTo(base.left + 25, base.top + 27);
            // selector.stroke()
            selector.rotate(45 * Math.PI / 180);
            selector.restore();
            return selector;
        }
    }

    async moveEnemySelectorArrow(targetIndex) {
        console.log(`moveEnemySelectorArrow : ${this.selectedEnemy} -> ${targetIndex}`)
        return new Promise(async (resolve, reject) => {
            let diff = 0;
            if (this.selectedEnemy < targetIndex) {
                diff = 1;
            } else if (this.selectedEnemy > targetIndex) {
                diff = -1;
            } else {
                return setTimeout(resolve, 1000);
            }

            while (this.selectedEnemy !== targetIndex) {
                // console.log(` while this.selectedEnemy : `, this.selectedEnemy)
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            this.selectedEnemy += diff;
                            _resolve();
                        }, 500);
                    });
                })();
            }
            setTimeout(resolve, 1000);
        });
    }

    drawMenuSelectorArrow(idx) {
        if (this.UIMode === UI_MODE.BATTLE_MENU) {
            const selector = this.canvas.getContext(`2d`);
            const base = {
                left: 465 + this.UIContainer.left,
                top: 2 + this.UIContainer.top + ((this.UIContainer.height / 5) * (1 + idx))
            }
            selector.save();
            selector.beginPath();
            selector.moveTo(base.left, base.top);
            selector.lineTo(base.left - 10, base.top + 10);
            selector.lineTo(base.left - 10, base.top - 10);
            selector.fill();
            selector.rotate(45 * Math.PI / 180);
            selector.restore();
            return selector;
        }
    }

    async moveMenuSelectorArrow(targetIndex) {
        console.log(`moveMenuSelectorArrow : ${this.selectedMenu} -> ${targetIndex}`)
        return new Promise(async (resolve, reject) => {
            let diff = 0;
            if (this.selectedMenu < targetIndex) {
                diff = 1;
            } else if (this.selectedMenu > targetIndex) {
                diff = -1;
            } else {
                return setTimeout(resolve, 1000);
            }

            while (this.selectedMenu !== targetIndex) {
                console.log(` while this.selectedMenu : `, this.selectedMenu)
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            this.selectedMenu += diff;
                            _resolve();
                        }, 500);
                    });
                })();
            }
            setTimeout(resolve, 1000);
        });
    }

    renderUIBox() {
        this.ctx.beginPath();
        this.ctx.roundRect(this.UIContainer.left, this.UIContainer.top,
            this.UIContainer.width, this.UIContainer.height, this.UIContainer.borderRadius);
        this.ctx.strokeStyle = this.UIContainer.borderColor;
        this.ctx.lineWidth = this.UIContainer.borderWidth;
        this.ctx.stroke();

        // Fill color
        this.ctx.fillStyle = this.UIContainer.color;
        this.ctx.fill();

        this.ctx.fillStyle = this.UIContainer.font.color;
        this.ctx.font = `${this.UIContainer.font.size}px Arial`;
    }

    renderUIBoxMenu() {
        if (this.UIMode === UI_MODE.BATTLE_MENU) {
            // Render menu text
            let count = 0;
            const numOfmenu = Object.keys(this.UIContainer.menu).length;
            const rowcol = parseInt(Math.sqrt(numOfmenu))

            for (const menuText in this.UIContainer.menu) {
                this.ctx.fillStyle = `#FFFFFF`
                this.ctx.font = `${this.UIContainer.font.size}px Arial`;
                this.ctx.textAlign = `start`;
                this.ctx.fillText(menuText,
                    480 + this.UIContainer.left,
                    40 + this.UIContainer.top + (this.UIContainer.height / 5 * count)
                    // (60 + this.UIContainer.left) + (this.UIContainer.width / 2 * parseInt(count / rowcol)),
                    // (60 + this.UIContainer.top) + (this.UIContainer.height / 3 * (count % rowcol))
                );

                count++;
            }
        }
    }

    async _addCharInfo(info) {
        return new Promise((resolve, reject) => {
            const charInfo = info;
            charInfo.isAttacking = false;
            charInfo.turnPoint = 0;
            charInfo.status = ``;
            // charInfo.animateHP = charInfo.HP;
            // charInfo.animateMP = charInfo.MP;
            charInfo.remainHP = charInfo.HP;
            charInfo.remainMP = charInfo.MP;
            charInfo.imageInfo = new Image();
            charInfo.imageInfo.src = charInfo.icon;
            charInfo.imageInfo.onload = () => {
                this.Characters.push(charInfo);
                resolve();
            }
        });
    }

    async addCharacter(info) {
        const charInfo = info;
        charInfo.type = `Player`;
        await this._addCharInfo(info);
    };

    async addEnemy(info) {
        const charInfo = info;
        charInfo.type = `Enemy`;
        await this._addCharInfo(info);
    }

    addItem(info) {
        this.itemList.push(info);
    }

    sortCharacters() {
        let minTurnPoint = Infinity;
        this.sortedCharacters = Array.from(this.Characters);
        for (const character of this.sortedCharacters) {
            character.turnPoint += character.speed;
            minTurnPoint = Math.min(minTurnPoint, character.turnPoint);
        }

        for (const character of this.sortedCharacters) {
            // character.turnPoint -= minTurnPoint;
        }

        // Sort
        this.sortedCharacters.sort((a, b) => {
            return b.turnPoint - a.turnPoint;
        })
        this.sortedCharacters[0].turnPoint -= minTurnPoint;
        // console.log(JSON.stringify(this.Characters, null, 4));
    }

    async renderPlayerCharacterInUI() {
        if (this.UIMode === UI_MODE.BATTLE_MENU) {
            const players = [];
            for (const player of this.Characters) {
                if (player.type === `Player`) {
                    players.push(player);
                }
            }

            for (let idx = 0; idx < players.length; idx++) {
                (() => {
                    const character = players[idx];

                    // Render name
                    this.ctx.font = `14px Arial`;

                    this.ctx.fillStyle = `#FFFFFF`
                    this.ctx.textAlign = `center`;
                    this.ctx.fillText(character.name,
                        (this.UIContainer.left + 55) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 25,
                    );

                    // Render border
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        (this.UIContainer.left + 10) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 10,
                        this.UIContainer.width * 0.15,
                        this.UIContainer.height * 0.85,
                        this.UIContainer.borderRadius
                    );
                    this.ctx.strokeStyle = `#CCCCCC`;
                    this.ctx.lineWidth = this.UIContainer.borderWidth / 2;
                    this.ctx.stroke();


                    // Render HP / MP Bar
                    // HP Bar
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = `#FFFFFF`;
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        (this.UIContainer.left + 20) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 102,
                        (this.UIContainer.width * 0.15) - 20,
                        14,
                        this.UIContainer.borderRadius / 2
                    );
                    this.ctx.fillStyle = `rgba(255, 0, 0, 0.5)`
                    this.ctx.fill()
                    this.ctx.stroke();

                    // MP Bar
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = `#FFFFFF`;
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        (this.UIContainer.left + 20) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 116,
                        (this.UIContainer.width * 0.15) - 20,
                        14,
                        this.UIContainer.borderRadius / 2
                    );
                    this.ctx.fillStyle = `rgba(0, 0, 255, 0.5)`
                    this.ctx.fill()
                    this.ctx.stroke();

                    // Render portrait frame
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = `#AAAAAA`;
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        (this.UIContainer.left + 25) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 30,
                        64, 64,
                        this.UIContainer.borderRadius / 2
                    );
                    this.ctx.fillStyle = `rgba(255, 255, 255, 0.2)`
                    this.ctx.fill()
                    this.ctx.stroke();

                    // Render portrait and info
                    this.ctx.fillStyle = `#FFFFFF`
                    this.ctx.drawImage(character.imageInfo,
                        (this.UIContainer.left + 25) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 30,
                        64, 64);


                    this.ctx.font = `10px Arial`;
                    const hpmpText = {
                        HP: `${character.remainHP} / ${character.HP}`,
                        MP: character.type === `Player` ?
                            `${character.remainMP} / ${character.MP}` : `?? / ??`,
                    }
                    this.ctx.textAlign = `center`;
                    this.ctx.fillText(hpmpText.HP,
                        (this.UIContainer.left + 55) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 112,
                    );
                    this.ctx.fillText(hpmpText.MP,
                        (this.UIContainer.left + 55) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 127,
                    );
                })();
            }
        }
    }

    async renderCharacterBattleOrder() {
        // Show only 4 character
        for (let idx = 0; idx < 9; idx++) {
            (() => {
                const character = this.sortedCharacters[idx];

                // Render portrait and info
                if (character !== undefined) {
                    this.ctx.fillStyle = `#FFFFFF`
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        (this.UIContainer.left + 10) + (67 * idx),
                        this.UIContainer.top - 60,
                        48, 48,
                        this.UIContainer.borderRadius
                    );
                    if (character.type === `Enemy`) {
                        this.ctx.strokeStyle = `#FF0000`;
                        this.ctx.fillStyle = `rgba(255,0,0,0.5)`;
                    } else {
                        this.ctx.strokeStyle = `#0000FF`;
                        this.ctx.fillStyle = `rgba(0,0,255,0.5)`;
                    }
                    this.ctx.fill();

                    this.ctx.drawImage(character.imageInfo,
                        (this.UIContainer.left + 10) + (67 * idx),
                        this.UIContainer.top - 60,
                        48, 48
                    );
                    if (idx === 0) {
                        this.ctx.lineWidth = this.UIContainer.borderWidth;
                    } else {
                        this.ctx.lineWidth = this.UIContainer.borderWidth / 2;
                    }
                    this.ctx.stroke();
                }
            })();
        }
    }

    drawEnemy() {
        const drawPadding = 10; // Left / right padding
        const drawStartLeftPos = 320 - ((64 + drawPadding / 2) * this.enemiesList.length);
        const drawStartTopPos = 270;
        // console.log(`drawStartLeftPos : ${drawStartLeftPos}`)
        /**
         * 가운데 정렬 기준
         * 1개 : 320 - 64 + padding * 0
         * 2개 : 320 - 128 + padding * 0.5
         * 3게 : 320 - 64 - 128 + padding * 1.5
         * 4개 : 320 - 148 - 128 + padding * 2
         */

        for (let idx = 0; idx < this.enemiesList.length; idx++) {
            const enemy = this.enemiesList[idx];
            enemy.drawStartPos = {
                x: drawStartLeftPos + ((128 + drawPadding) * idx),
                y: drawStartTopPos
            }
            // Render name
            // Name bar
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = `transparent`;
            this.ctx.beginPath();
            this.ctx.roundRect(
                enemy.drawStartPos.x + 16,
                enemy.drawStartPos.y - 29,
                108, 20,
                this.UIContainer.borderRadius / 2
            );
            this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
            this.ctx.fill()
            this.ctx.stroke();

            // Name text
            this.ctx.fillStyle = `#FFFFFF`
            this.ctx.font = `14px Arial`;
            this.ctx.textAlign = `center`;
            this.ctx.fillText(enemy.name,
                enemy.drawStartPos.x + 68,
                enemy.drawStartPos.y - 14
            );

            // Draw emeny image
            const isJump = this.isBattleStart ? 2 : 1;
            if (enemy.isAttacking === true) {
                if (this.attackingBlinkEffectCount++ % 2 === 0) {
                    this.ctx.drawImage(enemy.imageInfo,
                        enemy.drawStartPos.x,
                        enemy.drawStartPos.y - 10,
                        128, 128);
                }
            } else {
                this.ctx.drawImage(enemy.imageInfo,
                    enemy.drawStartPos.x,
                    enemy.drawStartPos.y - (10 * ((this.isJumpFlag + idx) % isJump)),
                    128, 128);
            }

            // Render HP / MP Bar
            // HP Bar
            this.ctx.lineWidth = 1;
            this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
            this.ctx.strokeStyle = `#FFFFFF`;
            this.ctx.beginPath();
            this.ctx.roundRect(
                enemy.drawStartPos.x + 28,
                enemy.drawStartPos.y + 135,
                (this.UIContainer.width * 0.15) - 20,
                20,
                this.UIContainer.borderRadius / 2
            );
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = `rgba(255, 0, 0, 0.5)`
            // console.log(` (enemy.remainHP / enemy.HP),`,((this.UIContainer.width * 0.15) - 20) * (enemy.remainHP / enemy.HP))
            this.ctx.beginPath();
            this.ctx.roundRect(
                enemy.drawStartPos.x + 28,
                enemy.drawStartPos.y + 135,
                ((this.UIContainer.width * 0.15) - 20) * (enemy.remainHP / enemy.HP),
                20,
                this.UIContainer.borderRadius / 2
            );
            this.ctx.fill();

            // MP Bar
            // this.ctx.lineWidth = 1;
            // this.ctx.strokeStyle = `#FFFFFF`;
            // this.ctx.beginPath();
            // this.ctx.roundRect(
            //     enemy.drawStartPos.x + 28,
            //     enemy.drawStartPos.y + 155,
            //     (this.UIContainer.width * 0.15) - 20,
            //     20,
            //     this.UIContainer.borderRadius / 2
            // );
            // this.ctx.fillStyle = `rgba(0, 0, 255, 0.5)`
            // this.ctx.fill()
            // this.ctx.stroke();

            // Render info
            this.ctx.fillStyle = `#FFFFFF`
            this.ctx.font = `14px Arial`;
            const hpmpText = {
                HP: `${enemy.remainHP} / ${enemy.HP}`,
                MP: enemy.type === `Player` ?
                    `${enemy.remainMP} / ${enemy.MP}` : `?? / ??`,
            }
            this.ctx.textAlign = `center`;
            this.ctx.fillText(hpmpText.HP,
                enemy.drawStartPos.x + 64,
                enemy.drawStartPos.y + 150
            );
            // this.ctx.fillText(hpmpText.MP,
            //     enemy.drawStartPos.x + 64,
            //     enemy.drawStartPos.y + 170
            // );
        }
    }

    drawMenuText() {
        this.renderUIBoxMenu();
        this.drawMenuSelectorArrow(this.selectedMenu); //.drawImage(this.backgroundImageInstance, 0, 0, 640, 640);
    }

    async renderTextInUI(str = this.renderingTextInUI) {
        let textArr;

        async function sleep(timer = 1000) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, timer);
            })
        }

        if (typeof str === `string`) {
            textArr = [str];
        } else {
            textArr = [...str];
        }
        // for (const text of textArr) {
        this.ctx.fillStyle = `#FFFFFF`
        this.ctx.textAlign = `start`;
        this.ctx.font = `${this.UIContainer.font.size}px Arial`;

        for (let idx = 0; idx < textArr.length; idx++) {
            const text = textArr[idx];
            this.ctx.fillText(text,
                (this.UIContainer.left + 30), // + (((this.UIContainer.width * 0.15) + 10)),
                this.UIContainer.top + 40 + this.UIContainer.font.size * idx,
            );
        }
        // console.log(`this.renderTextInUI : \n`, textArr.join('\n'));
    }

    renderTextInUIWithTimer(str) {

    }

    renderBattleStartText() {
        if (this.UIMode === UI_MODE.TEXT) {
            let text = ``;
            if (this.enemiesList.length === 1) {
                text = `The ${this.enemiesList[0]} is appeared!`
            } else {
                text = `Monsters are appeared!`
            }
            this.renderTextInUI(text);
        }
    }

    renderBattleEndText() {
        if (this.UIMode === UI_MODE.TEXT) {
            return new Promise(async (resolve, reject) => {
                if (this.isBattleEndTextRendering === false) {
                    this.isBattleEndTextRendering = true;

                    let textArr = [];
                    textArr.push(`You Win!`);
                    textArr.push(`Got 371 EXP!`);
                    this.renderTextInUI(textArr);
                    this.UIContainerText = [...textArr];
                } else {
                    console.log(this.UIContainerText)
                    // if (Array.isArray(this.UIContainerText)) {
                    //     this.UIContainerText = this.UIContainerText.join('\n');
                    // }
                    this.renderTextInUI(this.UIContainerText);
                }
                resolve();
            });
        }
    }

    addBattleScenario(scenarioObject) {
        this.battleScenario.push(scenarioObject);
    }

    async runBattle() {
        return new Promise(async (resolve, reject) => {
            for (const scenario of this.battleScenario) {
                console.log(`Run scenario : `, scenario)
                switch (scenario.action) {
                    case `Attack`: {
                        console.log(1)
                        this.UIMode = UI_MODE.BATTLE_MENU;
                        await this.moveMenuSelectorArrow(0);
                        console.log(2)
                        // console.log(`ENEMY:`, this.findEnemyInfoByIndex(scenario.to));
                        console.log(`Select enemy`)
                        this.UIMode = UI_MODE.ENEMY_SELECT;
                        await this.moveEnemySelectorArrow(scenario.to);
                        // await this.moveEnemySelectorArrow(scenario.to);
                        console.log(`Attack to enemy`);
                        this.UIMode = UI_MODE.ATTACKING;
                        await this.attackEnemy(scenario);
                        this.UIMode = UI_MODE.ATTACK_RESULT;
                        break;
                    }
                }
                console.log(`Battle phase done : `, scenario);
            }
            console.log(`Battle all scenario done`);
            resolve();
        });
    }


    async startRenderBasicUIs() {
        let animateCountForCharacterUIRender = 0;
        this.sortCharacters();
        this.ctx.clearRect(0, 0, 640, 640);

        // Render menu arrow
        this.ctx.drawImage(this.backgroundImageInstance, 0, 0, 640, 640);
        this.renderUIBox();
        if (animateCountForCharacterUIRender++ > 10) {
            this.sortCharacters();
            animateCountForCharacterUIRender = 0;
        }
        this.drawEnemy();
        // this.renderCharacterBattleOrder();
        // this.renderPlayerCharacterInUI();
        // for (const instance of NPCList) {
        // console.log(`Render : `, instance.img)
        // instance.renderFrame();
        // }
    }

    fadein() {
        if (this.fadeFactor > 0) {
            this.fadeFactor -= this.fadeSpeed;
        }
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeFactor})`;
        this.ctx.fillRect(0, 0, 640, 640);
    }

    fadeout() {
        if (this.fadeFactor < 1) {
            this.fadeFactor += this.fadeSpeed;
        }
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeFactor})`;
        console.log(`rgba(0, 0, 0, ${this.fadeFactor})`);
        this.ctx.fillRect(0, 0, 640, 640);
    }

    // https://img.ly/blog/how-to-pixelate-an-image-in-javascript/
    async pixelate(pixelationFactor) {
        const originalImageData = this.ctx.getImageData(0, 0, 640, 640).data;
        if (pixelationFactor !== 0) {
            for (let y = 0; y < 640; y += pixelationFactor) {
                for (let x = 0; x < 640; x += pixelationFactor) {
                    // extracting the position of the sample pixel
                    const pixelIndexPosition = (x + y * 640) * 4;
                    // drawing a square replacing the current pixels
                    this.ctx.fillStyle = `rgba( ${originalImageData[pixelIndexPosition]}, ${originalImageData[pixelIndexPosition + 1]},${originalImageData[pixelIndexPosition + 2]}, ${originalImageData[pixelIndexPosition + 3]} )`;
                    this.ctx.fillRect(x, y, pixelationFactor, pixelationFactor);
                }
            }
        }
    }

    async animate() {
        this.animationInterval = setInterval(async () => {
            this.startRenderBasicUIs();
            if (this.UIMode === UI_MODE.BATTLE_MENU) {
                this.drawMenuText();
                this.renderPlayerCharacterInUI();
            } else if (this.UIMode === UI_MODE.ENEMY_SELECT) {
                this.drawEnemySelected(this.selectedEnemy);
            } else if (this.UIMode === UI_MODE.ATTACKING) {
                this.renderAttackEnemy(this.selectedEnemy, this.currentAttackName);
                this.renderTextInUI();
            } else if (this.UIMode === UI_MODE.ATTACK_RESULT) {
                this.renderTextInUI();
            }
        }, 1000 / FPS);
    }

    async start() {
        let pixelateCount = 48;

        for (const enemy of this.Characters) {
            if (enemy.type === `Enemy`) {
                this.enemiesList.push(enemy);
            }
        }

        const startPixelate = async () => {
            this.startRenderBasicUIs();
            if (pixelateCount > 5) {
                this.renderBattleStartText();
                this.pixelate(pixelateCount--);
                this.fadein();
                window.requestAnimationFrame(startPixelate);
            } else {
                this.isBattleStart = true;
                this.renderBattleStartText();
                setTimeout(() => {
                    this.UIMode = UI_MODE.BATTLE_MENU;
                    this.animate();
                    this.runBattle();
                }, 1000);
            }
        }
        window.requestAnimationFrame(startPixelate);
    }

    async end() {
        const pixelateCount = 48;
        let remainPixelateCount = 0;

        const startPixelate = async () => {
            this.startRenderBasicUIs();
            await this.renderBattleEndText();
            if (remainPixelateCount < pixelateCount) {
                if (remainPixelateCount !== 0) {
                    this.fadeout();
                }
                this.pixelate(remainPixelateCount++);

                window.requestAnimationFrame(startPixelate);
                console.log(`ENDING`)
            } else {
                this.isBattleEnd = true;
                clearInterval(this.animationInterval);
                this.ctx.clearRect(0, 0, 640, 640);
                console.log(`END`)
                // setTimeout(() => {
                // this.animate();
                // }, 1000);
            }
        }
        await this.renderBattleEndText();
        window.requestAnimationFrame(startPixelate);
    }
}