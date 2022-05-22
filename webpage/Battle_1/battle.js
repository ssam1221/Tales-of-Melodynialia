const FPS = 40;

const ARROW_MOVE_SPEED = 600;

const UI_MODE = {
    NONE: `NONE`,
    TEXT: `TEXT`,
    BATTLE_MENU: `BATTLE_MENU`,
    ATTACK: `ATTACK`,
    MAGIC_SELECT: `MAGIC_SELECT`,
    ENEMY_SELECT: `ENEMY_SELECT`,
    ATTACKING: `ATTACKING`,
    ATTACK_RESULT: `ATTACK_RESULT`,
    ATTACK_BY_ENEMY: `ATTACK_BY_ENEMY`,
    ITEM: `ITEM`,
    MAGIC: `MAGIC`,
    BATTLE_END: `BATTLE_END`
}

let timerInterval = 0;
let startTime = 0;

async function sleep(timer = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timer);
    })
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const diff = new Date(new Date().getTime() - startTime.getTime());
        document.getElementById(`timer`).innerHTML = `${diff.getMinutes().toString().padStart(2,'0')}:` +
            `${diff.getSeconds().toString().padStart(2,'0')}:` +
            `${diff.getMilliseconds().toString().padStart(3,'0')}`;
    }, 10);
}

function endTimer() {
    console.log(`All Battle scenario end.`);
    clearInterval(timerInterval);
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

            // UI Render Mode
            // Text | BattleMenu | Attack | EmenySelect | Item | Magic ...
            this.UIMode = UI_MODE.TEXT;

            this.renderingTextInUI = ``;
            this.selectedMagic = 0;

            this.AttackEffect = {};
            this.currentAttackTarget = 0;
            this.currentAttackName = ``;
            this.AttackScenario = [];
            this.attackRenderTimestamp = 0;
            this.Characters = [];
            this.sortedCharacters = [];

            this.MagicList = {};
            this.MagicListArray = [];

            this.currentActiveCharacter = ``;
            this.PlayerList = [];
            this.enemiesList = [];
            this.attackingBlinkEffectCount = 0;

            this.ScreenShakedEffectDistanceDefault = 30;
            this.screenShakedEffectDistance = 0;

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

                if (info.type === `Magic`) {
                    this.MagicList[info.name] = attackInfo;
                }

                resolve();
            }
        });
    }

    async _reduceRemainHP({
        enemy,
        scenario,
        attackType
    }) {
        return new Promise(async (resolve, reject) => {
            let attackInfo;
            if (attackType === `Attack`) {
                attackInfo = this.AttackEffect[scenario.attackName];
            } else if (attackType === `Magic`) {
                attackInfo = this.MagicList[scenario.spell];
            }
            const timestampMax = attackInfo.col * attackInfo.row;

            // Do animation effect
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
            await sleep(1000);

            if (scenario.damage === 0) {
                console.log(`Avoid attack`);
                this.renderingTextInUI = `${enemy.name} avoid!`;
            } else {
                this.renderingTextInUI = `${enemy.name} got ${scenario.damage} damage(s)!`;
            }

            let remainHPDiff = scenario.damage;
            while (remainHPDiff-- > 0) {
                enemy.isAttacking = true;
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            enemy.remainHP--;
                            if (enemy.remainHP === 0) {
                                remainHPDiff = 0;
                                enemy.status = `Deading`;
                            }
                            _resolve();
                        }, 3 * 1000 / FPS);
                    });
                })();
            }

            if (enemy.status === `Deading`) {
                while (enemy.opacity > 0) {
                    await (() => {
                        return new Promise((_resolve, _reject) => {
                            setTimeout(() => {
                                enemy.opacity -= 0.05;
                                _resolve();
                            }, 3 * 1000 / FPS);
                        });
                    })();
                }
                console.log(`### ${enemy.name} fainted`);
                this.renderingTextInUI = `${enemy.name} fainted!`;
                enemy.status = `Dead`;
            }

            enemy.isAttacking = false;
            resolve();
        });
    }

    async attackEnemy(attackScenario) {
        return new Promise(async (resolve, reject) => {
            const enemy = this.findEnemyInfoByIndex(attackScenario.to);
            const enemyName = enemy.name;

            if (enemy.remainHP <= 0) {
                console.warn(`Enemy ${enemy.name} already dead.`);
            }

            this.attackRenderTimestamp = 0;
            this.currentAttackName = attackScenario.attackName;
            this.currentAttackTarget = attackScenario.to;
            const attackInfo = this.AttackEffect[attackScenario.attackName];

            if (attackInfo.type === `Normal`) {
                this.renderingTextInUI = `${attackScenario.from} attacks ${enemyName}!`;
            }


            await this._reduceRemainHP({
                enemy,
                scenario: attackScenario,
                attackType: `Attack`
            });

            setTimeout(() => {
                this.renderingTextInUI = ``;
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

                const spriteSize = {
                    width: 128,
                    height: 128
                }

                if (`renderStartPosition` in attackInfo) {
                    base.left += attackInfo.renderStartPosition.x;
                    base.top = attackInfo.renderStartPosition.y;
                    spriteSize.width = attackInfo.imageInfo.naturalWidth / attackInfo.col;
                    spriteSize.height = attackInfo.imageInfo.naturalHeight / attackInfo.row;
                }
                this.ctx.drawImage(attackInfo.imageInfo,
                    attackInfo.spriteSize.width * spriteCol,
                    attackInfo.spriteSize.height * spriteRow,
                    spriteSize.width, spriteSize.height,
                    base.left, base.top, spriteSize.width, spriteSize.height);
                this.renderTextInUI();
                setTimeout(resolve, 3000);
            }
        });
    }

    renderSelectMagicInUI() {

        this.ctx.fillStyle = `#FFFFFF`
        this.ctx.textAlign = `start`;
        this.ctx.font = `${this.UIContainer.font.size}px Arial`;

        // Draw arrow

        // const selector = this.canvas.getContext(`2d`);
        // const base = {
        //     left: 465 + this.UIContainer.left,
        //     top: 2 + this.UIContainer.top + ((this.UIContainer.height / 5) * (1 + idx))
        // }
        // selector.save();
        // selector.beginPath();
        // selector.moveTo(base.left, base.top);
        // selector.lineTo(base.left - 10, base.top + 10);
        // selector.lineTo(base.left - 10, base.top - 10);
        // selector.fill();
        // selector.rotate(45 * Math.PI / 180);
        // selector.restore();
        // return selector;

        const base = {
            left: 40 + this.UIContainer.left,
            top: 2 + this.UIContainer.top
        }
        const diff = this.selectedMagic * this.UIContainer.height / 5
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(base.left, diff + base.top + (this.UIContainer.height / 5));
        this.ctx.lineTo(base.left - 10, diff + base.top + (this.UIContainer.height / 5) + 10);
        this.ctx.lineTo(base.left - 10, diff + base.top + (this.UIContainer.height / 5) - 10);
        this.ctx.fill();
        this.ctx.rotate(45 * Math.PI / 180);
        this.ctx.restore();

        // List up magic
        for (let idx = 0; idx < this.MagicListArray.length; idx++) {
            // console.log(this.MagicListArray)
            const magic = this.MagicListArray[idx];

            // Magic name
            this.ctx.fillText(magic.name,
                base.left + 10,
                40 + this.UIContainer.top + (this.UIContainer.height / 5 * idx)
            );

            // Magic description
            // this.ctx.fillText(magic.description,
            //     base.left + 60,
            //     40 + this.UIContainer.top + (this.UIContainer.height / 5 * idx)
            // );
        }
    }

    async selectMagic(magicScenario) {
        const targetIndex = this.MagicListArray.findIndex(magic => {
            // console.log(`magic ::: `, magic);
            return magic.name === magicScenario.spell;
        });
        return new Promise(async (resolve, reject) => {
            const magicInfo = this.MagicList[magicScenario];
            let diff = 0;
            if (this.selectedMagic < targetIndex) {
                diff = 1;
            } else if (this.selectedMagic > targetIndex) {
                diff = -1;
            } else {
                return setTimeout(resolve, 1000);
            }

            while (this.selectedMagic !== targetIndex) {
                // console.log(` while this.selectedEnemy : `, this.selectedEnemy)
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            this.selectedMagic += diff;
                            _resolve();
                        }, ARROW_MOVE_SPEED);
                    });
                })();
            }
            setTimeout(resolve, 1000);
        });
    }

    async useMagic(magicScenario) {
        return new Promise(async (resolve, reject) => {
            const enemy = this.findEnemyInfoByIndex(magicScenario.to);
            const enemyName = enemy.name;

            this.attackRenderTimestamp = 0;
            this.currentAttackName = magicScenario.spell;
            this.currentAttackTarget = magicScenario.to;
            const attackInfo = this.MagicList[magicScenario.spell];
            this.renderingTextInUI = [`${magicScenario.from} uses ${magicScenario.spell} to ${enemyName}!`,
                `Use ${attackInfo.mana} mana!`
            ];
            if (this.findPlayerInfoByName(magicScenario.from).remainMP < attackInfo.mana) {
                console.warn(`The magic scenario need more mana.`);
            }
            this.findPlayerInfoByName(magicScenario.from).remainMP -= attackInfo.mana;

            // console.log(`===========================================`)
            // console.log(this.MagicList)
            // console.log(magicScenario)
            // console.log(attackInfo)
            // console.log(`===========================================`)
            await this._reduceRemainHP({
                enemy,
                scenario: magicScenario,
                attackType: `Magic`
            });

            // const timestampMax = attackInfo.col * attackInfo.row;
            // while (this.attackRenderTimestamp < timestampMax) {
            //     await (() => {
            //         return new Promise((_resolve, _reject) => {
            //             setTimeout(() => {
            //                 this.attackRenderTimestamp++;
            //                 _resolve();
            //             }, 1000 / FPS);
            //         });
            //     })();
            // }
            // await sleep(1000);

            // if (attackInfo.damage === 0) {
            //     this.renderingTextInUI = `${enemyName} avoid!`;
            // } else {
            //     this.renderingTextInUI = `${enemyName} got ${magicScenario.damage} damage(s)!`;
            // }

            // let remainHPDiff = magicScenario.damage;
            // const avgDiff = 0;
            // while (remainHPDiff-- > 0) {
            //     enemy.isAttacking = true;
            //     await (() => {
            //         return new Promise((_resolve, _reject) => {
            //             setTimeout(() => {
            //                 enemy.remainHP--;
            //                 _resolve();
            //             }, 3 * 1000 / FPS);
            //         });
            //     })();
            // }
            // enemy.isAttacking = false;

            // console.log(`magic done done`);
            setTimeout(() => {
                this.renderingTextInUI = ``;
                this.attackRenderTimestamp = 0;
                resolve();
            }, 1000);
        });
    }

    findPlayerInfoByIndex(idx) {
        return this.PlayerList[idx];
    }

    findPlayerInfoByName(name) {
        for (let idx = 0; idx < this.PlayerList.length; idx++) {
            if (name === this.PlayerList[idx].name) {
                return this.PlayerList[idx];
            }
        }
        return null;
    }


    findEnemyInfoByIndex(idx) {
        return this.enemiesList[idx];
    }

    findEnemyInfoByName(name) {
        for (let idx = 0; idx < this.enemiesList.length; idx++) {
            if (name === this.enemiesList[idx].name) {
                return this.enemiesList[idx];
            }
        }
        return null;
    }

    drawEnemySelected(idx) {
        if (this.UIMode === UI_MODE.ENEMY_SELECT) {
            const enemyInfo = this.findEnemyInfoByIndex(idx);
            if (enemyInfo.status !== `Dead`) {
                this.renderTextInUI([enemyInfo.name].concat(enemyInfo.description));
            }

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
        // console.log(`moveEnemySelectorArrow : ${this.selectedEnemy} -> ${targetIndex}`);
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
                            while (this.findEnemyInfoByIndex(this.selectedEnemy).status === `Dead`) {
                                this.selectedEnemy += diff;
                            }
                            _resolve();
                        }, ARROW_MOVE_SPEED);
                    });
                })();
            }
            setTimeout(resolve, 1000);
        });
    }

    drawMenuSelectorArrow(idx) {
        if (this.UIMode === UI_MODE.BATTLE_MENU) {
            const base = {
                left: 465 + this.UIContainer.left,
                top: 2 + this.UIContainer.top + ((this.UIContainer.height / 5) * (1 + idx))
            }
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(base.left, base.top);
            this.ctx.lineTo(base.left - 10, base.top + 10);
            this.ctx.lineTo(base.left - 10, base.top - 10);
            this.ctx.fill();
            this.ctx.rotate(45 * Math.PI / 180);
            this.ctx.restore();
        }
    }

    async moveMenuSelectorArrow(targetIndex) {
        // console.log(`moveMenuSelectorArrow : ${this.selectedMenu} -> ${targetIndex}`)
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
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            this.selectedMenu += diff;
                            _resolve();
                        }, ARROW_MOVE_SPEED);
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
            charInfo.opacity = 1;
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
            for (let idx = 0; idx < this.PlayerList.length; idx++) {
                (() => {
                    const character = this.PlayerList[idx];

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
                    if (this.currentActiveCharacter === character.name) {
                        this.ctx.strokeStyle = `#66FF66`;
                    } else {
                        this.ctx.strokeStyle = `#CCCCCC`;
                    }
                    this.ctx.lineWidth = this.UIContainer.borderWidth / 2;
                    this.ctx.stroke();


                    // Render HP / MP Bar
                    // HP Bar

                    this.ctx.lineWidth = 1;
                    this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
                    this.ctx.strokeStyle = `#FFFFFF`;
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        (this.UIContainer.left + 20) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 102,
                        ((this.UIContainer.width * 0.15) - 20),
                        14,
                        this.UIContainer.borderRadius / 2
                    );
                    this.ctx.fill()
                    this.ctx.stroke();

                    this.ctx.fillStyle = `rgba(255, 0, 0, 0.5)`
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        (this.UIContainer.left + 20) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 102,
                        ((this.UIContainer.width * 0.15) - 20) * (character.remainHP / character.HP),
                        14,
                        this.UIContainer.borderRadius / 2
                    );
                    this.ctx.fill()

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
                    this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
                    this.ctx.fill()
                    this.ctx.stroke();

                    this.ctx.fillStyle = `rgba(0, 0, 255, 0.5)`
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        (this.UIContainer.left + 20) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 116,
                        ((this.UIContainer.width * 0.15) - 20) * (character.remainMP / character.MP),
                        14,
                        this.UIContainer.borderRadius / 2
                    );
                    this.ctx.fill()

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
                x: drawStartLeftPos + ((128 + drawPadding) * idx) + +this.screenShakedEffectDistance,
                y: drawStartTopPos
            }
            if (enemy.status !== `Dead`) {
                if (enemy.status === `Deading`) {
                    this.ctx.globalAlpha = enemy.opacity;
                }


                // Render name
                // Name bar
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.roundRect(
                    enemy.drawStartPos.x + 16,
                    enemy.drawStartPos.y - 29,
                    108, 20,
                    this.UIContainer.borderRadius / 2
                );
                this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
                this.ctx.fill();
                if (this.currentActiveCharacter === idx) {
                    this.ctx.strokeStyle = `#FF0000`;
                } else {
                    this.ctx.strokeStyle = `transparent`;
                }
                this.ctx.stroke();

                // Name text
                this.ctx.fillStyle = `#FFFFFF`
                this.ctx.font = `14px Arial`;
                this.ctx.textAlign = `center`;
                this.ctx.fillText(enemy.name,
                    enemy.drawStartPos.x + 68,
                    enemy.drawStartPos.y - 14
                );

                // Draw enemy shadow
                this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
                this.ctx.beginPath();
                this.ctx.ellipse(
                    enemy.drawStartPos.x + 64,
                    enemy.drawStartPos.y + 118,
                    50, 10,
                    0,
                    0,
                    2 * Math.PI);
                this.ctx.fill();


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


                this.ctx.globalAlpha = 1;
            }

            // Draw emeny image
            // this.ctx.globalCompositeOperation = "source-over";
            const isJump = this.isBattleStart ? 2 : 1;
            if (enemy.status === `Deading`) {
                if (enemy.opacity <= 0) {
                    enemy.status = `Dead`;
                    console.log(`Enemy ${enemy.name} is dead.`);
                }
                this.ctx.globalAlpha = enemy.opacity;
                this.ctx.drawImage(enemy.imageInfo,
                    enemy.drawStartPos.x,
                    enemy.drawStartPos.y,
                    128, 128);
                this.ctx.globalAlpha = 1;
            } else if (enemy.status !== `Dead`) {
                if (enemy.isAttacking === true) {
                    if (parseInt(++this.attackingBlinkEffectCount / 4) % 2 === 0) {
                        this.ctx.drawImage(enemy.imageInfo,
                            enemy.drawStartPos.x,
                            enemy.drawStartPos.y,
                            128, 128);
                    }
                } else {
                    this.ctx.drawImage(enemy.imageInfo,
                        enemy.drawStartPos.x,
                        enemy.drawStartPos.y - (10 * ((this.isJumpFlag + idx) % isJump)),
                        128, 128);
                }

            }
        }
    }

    drawMenuText() {
        this.renderUIBoxMenu();
        this.drawMenuSelectorArrow(this.selectedMenu); //.drawImage(this.backgroundImageInstance, 0, 0, 640, 640);
    }

    async renderTextInUI(str = this.renderingTextInUI) {
        let textArr;

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

    getAwards() {
        const ret = {
            EXP: 0,
            Gold: 0
        }
        for (const enemy of this.enemiesList) {
            ret.EXP += enemy.EXP;
            ret.Gold += enemy.gold;
        }
        return ret;
    }

    async setBattleEndText() {
        return new Promise(async (resolve, reject) => {
            if (this.UIMode === UI_MODE.BATTLE_END) {
                if (this.isBattleEndTextRendering === false) {
                    this.isBattleEndTextRendering = true;

                    const awards = this.getAwards();

                    let textArr = [];
                    textArr.push(`You Win!`);
                    // this.renderTextInUI(textArr);
                    this.renderingTextInUI = [...textArr];
                    await sleep(500);
                    textArr.push(`Got ${awards.Gold} Gold!`);
                    this.renderingTextInUI = [...textArr];
                    await sleep(500);
                    textArr.push(`Got ${awards.EXP} EXP!`);
                    this.renderingTextInUI = [...textArr];
                    await sleep(500);

                } else {
                    console.log(this.renderingTextInUI)
                    // if (Array.isArray(this.renderingTextInUI)) {
                    //     this.renderingTextInUI = this.renderingTextInUI.join('\n');
                    // }
                    // this.renderTextInUI(this.renderingTextInUI);
                }
                await sleep(2000);
                resolve();
            }
        });
    }

    async attackedByEnemy(scenario) {

        const enemy = this.findEnemyInfoByIndex(scenario.from);
        this.renderingTextInUI = `${enemy.name}'s ${scenario.attackName}!`;

        if (scenario.damage !== 0) {
            this.screenShakedEffectDistance = this.ScreenShakedEffectDistanceDefault;
            let shakeCount = this.ScreenShakedEffectDistanceDefault;
            while (shakeCount-- > 0) {
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        const direction = shakeCount % 2 === 0 ? 1 : -1;
                        setTimeout(() => {
                            this.screenShakedEffectDistance = (Math.abs(this.screenShakedEffectDistance) - 2) * direction;
                            _resolve();
                        }, 2 * 1000 / FPS);
                    });
                })();
            }
            this.renderingTextInUI = `${scenario.to} got ${scenario.damage} damage(s)!`;
            this.findPlayerInfoByName(scenario.to).remainHP -= scenario.damage;
        } else {
            await sleep(1500);
            this.renderingTextInUI = `${scenario.to} avoid!`;
        }

        this.screenShakedEffectDistance = 0;
        await sleep(1500);
    }

    addBattleScenario(scenarioObject) {
        this.battleScenario.push(scenarioObject);
    }

    async runBattle() {
        let turn = 1;
        return new Promise(async (resolve, reject) => {
            for (const scenario of this.battleScenario) {
                if ((scenario.from === `Clef`) && (scenario.action === `Attack`)) {
                    console.log(`Turn ${turn++} : `);
                }
                console.log(`Run scenario : `, scenario);
                this.currentActiveCharacter = scenario.from;
                switch (scenario.action) {
                    case `Attack`: {
                        this.UIMode = UI_MODE.BATTLE_MENU;
                        await this.moveMenuSelectorArrow(0);
                        // console.log(`ENEMY:`, this.findEnemyInfoByIndex(scenario.to));
                        // console.log(`Select enemy`)
                        this.UIMode = UI_MODE.ENEMY_SELECT;
                        await this.moveEnemySelectorArrow(scenario.to);
                        // await this.moveEnemySelectorArrow(scenario.to);
                        // console.log(`Attack to enemy`);
                        this.UIMode = UI_MODE.ATTACKING;
                        await this.attackEnemy(scenario);
                        this.UIMode = UI_MODE.ATTACK_RESULT;
                        break;
                    }
                    case `Magic`: {
                        this.UIMode = UI_MODE.BATTLE_MENU;
                        await this.moveMenuSelectorArrow(1);
                        // console.log(`ENEMY:`, this.findEnemyInfoByIndex(scenario.to));
                        // console.log(`Select magic`)
                        this.UIMode = UI_MODE.MAGIC_SELECT;
                        await this.selectMagic(scenario);
                        this.UIMode = UI_MODE.ENEMY_SELECT;
                        await this.moveEnemySelectorArrow(scenario.to);
                        // await this.moveEnemySelectorArrow(scenario.to);
                        // console.log(`Attack to enemy`);
                        this.UIMode = UI_MODE.ATTACKING;
                        await this.useMagic(scenario);
                        this.UIMode = UI_MODE.ATTACK_RESULT;
                        break;
                    }
                    // Attack from monster
                    case `MonsterAttack`: {
                        this.UIMode = UI_MODE.ATTACK_BY_ENEMY;
                        await this.attackedByEnemy(scenario);
                        this.UIMode = UI_MODE.BATTLE_MENU;
                        break;
                    }
                }
                // console.log(`Battle phase done : `, scenario);
            }
            console.log(`Battle all scenario done`);
            // endTimer();
            this.end();
            resolve();
        });
    }


    async startRenderBasicUIs() {
        let animateCountForCharacterUIRender = 0;
        this.sortCharacters();
        this.ctx.clearRect(0, 0, 640, 640);

        // Render menu arrow
        // this.screenShakedEffectDistance++
        this.ctx.drawImage(this.backgroundImageInstance,
            this.screenShakedEffectDistance,
            0, //this.screenShakedEffectDistance,
            640, 640);

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
            } else if (this.UIMode === UI_MODE.MAGIC_SELECT) {
                this.renderSelectMagicInUI();
            } else if (this.UIMode === UI_MODE.ENEMY_SELECT) {
                this.drawEnemySelected(this.selectedEnemy);
            } else if (this.UIMode === UI_MODE.ATTACKING) {
                await this.renderAttackEnemy(this.selectedEnemy, this.currentAttackName);
                this.renderTextInUI();
            } else if (this.UIMode === UI_MODE.ATTACK_RESULT) {
                this.renderTextInUI();
            } else if (this.UIMode === UI_MODE.ATTACK_BY_ENEMY) {
                this.renderTextInUI();
            } else if (this.UIMode === UI_MODE.BATTLE_END) {
                this.renderTextInUI();
            }
        }, 1000 / FPS);
    }

    async start() {
        let pixelateCount = 48;

        for (const character of this.Characters) {
            if (character.type === `Enemy`) {
                this.enemiesList.push(character);
            } else {
                this.PlayerList.push(character);
            }
        }
        for (const magic in this.MagicList) {
            this.MagicListArray.push(this.MagicList[magic]);
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
        startTimer();
        window.requestAnimationFrame(startPixelate);
    }

    async end() {
        return new Promise(async (resolve, reject) => {
            const pixelateCount = 48;
            let remainPixelateCount = 0;

            this.UIMode = UI_MODE.BATTLE_END;

            const startPixelate = async () => {
                if (remainPixelateCount < pixelateCount) {
                    if (remainPixelateCount !== 0) {
                        this.fadeout();
                    }
                    this.pixelate(remainPixelateCount++);

                    window.requestAnimationFrame(startPixelate);
                } else {
                    this.isBattleEnd = true;
                    clearInterval(this.animationInterval);
                    this.ctx.clearRect(0, 0, 640, 640);
                    console.log(`Battle complete.`);
                    endTimer();
                    resolve();
                }
            }
            await this.setBattleEndText();
            window.requestAnimationFrame(startPixelate);
        });
    }
}