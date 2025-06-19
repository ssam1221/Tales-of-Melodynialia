const FPS = 40;
const ARROW_MOVE_SPEED = 600;

const UI_MODE = {
    NONE: `NONE`,
    TEXT: `TEXT`,
    BATTLE_START: `BATTLE_START`,
    BATTLE_MENU: `BATTLE_MENU`,
    ATTACK: `ATTACK`,
    MAGIC_SELECT: `MAGIC_SELECT`,
    ENEMY_SELECT: `ENEMY_SELECT`,
    CHARACTER_SELECT: `CHARACTER_SELECT`,
    ATTACKING: `ATTACKING`,
    BUFFING: `BUFFING`,
    BUFFING_ALL: `BUFFING_ALL`,
    ATTACK_RESULT: `ATTACK_RESULT`,
    ATTACK_BY_ENEMY: `ATTACK_BY_ENEMY`,
    ITEM: `ITEM`,
    MAGIC: `MAGIC`,
    BATTLE_WIN: `BATTLE_WIN`,
    BATTLE_DEFEAT: `BATTLE_DEFEAT`,
    GAME_OVER: `GAME_OVER`,
    PHASE_CHANGE: `PHASE_CHANGE`
}

let timerInterval = 0;

async function sleep(timer = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timer);
    })
}

function endTimer() {
    console.log(`All Battle scenario end.`);
    clearInterval(gameplayTimer);
    clearInterval(timerInterval);
}

class Battle {
    constructor({
        background,
        battleOptions = {}
    }) {
        return new Promise((resolve, reject) => {
            this.backgroundImageInstance = new Image();
            this.backgroundImageInstance.src = background;

            this.gameoverImage = new Image();
            this.gameoverImage.src = `../commonFiles/image/Gameover.png`;

            this.battleOptions = battleOptions;
            this.drawWeight = battleOptions.drawWeight ?? 1;

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
            this.UIMode = UI_MODE.BATTLE_START;

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
            this.spellToCharacter = ``;
            this.PlayerList = [];
            this.enemiesList = [];
            this.attackingBlinkEffectCount = 0;

            this.ScreenShakedEffectDistanceDefault = 30;
            this.screenShakedEffectDistance = 0;

            this.itemList = [];
            this.selectedMenu = 0;

            this.selectedEnemyIndex = 0;
            this.selectedCharacterIndex = 0;

            this.animationInterval = 0;
            this.isJumpFlag = 0;
            setInterval(() => {
                if (this.battleOptions.bounce !== false) {
                    if (this.isBattleStart === true) {
                        this.isJumpFlag++;
                        this.isJumpFlag %= 2;
                    }
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

    async _commandActionToPlayer({
        target,
        scenario,
        moveType
    }) {
        return new Promise(async (resolve, reject) => {
            console.log(`Run _commandActionToPlayer() : `, moveType);
            let attackInfo;
            let remainHPDiff = scenario.value ?? 60;
            const numOfFrames = Math.floor(1000 / FPS);
            let remainFrames = numOfFrames;
            const diffHPPerFrame = Math.ceil(remainHPDiff / numOfFrames);
            switch (moveType) {
                // case `Attack`:
                //     attackInfo = this.AttackEffect[scenario.attackName];
                //     break;
                case `Magic_Heal`:
                    // console.log(`numOfFrames        : `, numOfFrames)
                    // console.log(`diffHPPerFrame : `, diffHPPerFrame)
                    while (remainHPDiff > 0) {
                        remainHPDiff = remainHPDiff - diffHPPerFrame;
                        await (() => {
                            return new Promise((_resolve, _reject) => {
                                setTimeout(() => {
                                    this.attackRenderTimestamp++;
                                    target.remainHP = target.remainHP + diffHPPerFrame;
                                    if (target.remainHP > target.HP) {
                                        target.remainHP = target.HP;
                                    }
                                    _resolve();
                                }, 3 * 1000 / FPS);
                            });
                        })();
                    }
                    break;
                case `Magic_Buff`:
                    attackInfo = this.MagicList[scenario.spell];
                    // console.log(`numOfFrames        : `, numOfFrames)
                    // console.log(`diffHPPerFrame : `, diffHPPerFrame)
                    while (remainHPDiff > 0) {
                        remainHPDiff = remainHPDiff - diffHPPerFrame;
                        await (() => {
                            return new Promise((_resolve, _reject) => {
                                setTimeout(() => {
                                    this.attackRenderTimestamp++;
                                    _resolve();
                                }, 3 * 1000 / FPS);
                            });
                        })();
                    }
                    break;
                case `Magic_Buff_All`:
                    attackInfo = this.MagicList[scenario.spell];
                    // console.log(`numOfFrames        : `, numOfFrames)
                    // console.log(`diffHPPerFrame : `, diffHPPerFrame)
                    while (remainFrames > 0) {
                        remainFrames = remainFrames - 1;
                        await (() => {
                            return new Promise((_resolve, _reject) => {
                                setTimeout(() => {
                                    this.attackRenderTimestamp++;
                                    _resolve();
                                }, 3 * 1000 / FPS);
                            });
                        })();
                    }
                    break;

                // TODO
                case `Item`:
                    break;
            }

            console.log(`End _commandActionToPlayer()`);
            resolve();
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
            const multipleAnimation = scenario.hitCount ?? 1;
            let multipleAnimationCount = 1;
            const timestampMax = attackInfo.col * attackInfo.row;

            // Do animation effect
            while (this.attackRenderTimestamp < timestampMax) {
                // console.log(`multipleAnimationCount ${multipleAnimationCount} / ${multipleAnimation}`,)
                if (multipleAnimationCount < multipleAnimation) {
                    // console.log(`attackRenderTimestamp ${this.attackRenderTimestamp} / ${timestampMax}`,)
                    if (this.attackRenderTimestamp === timestampMax - 1) {
                        multipleAnimationCount++;
                        this.attackRenderTimestamp = 0;
                    }
                }
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
            } else if (scenario.critical === true) {
                this.renderingTextInUI = [
                    `Critical hit!`,
                    `${enemy.name} got ${scenario.damage} damage(s)!`
                ];
            } else if (scenario.hitCount) {
                this.renderingTextInUI = [
                    `${scenario.hitCount} hits!`,
                    `${enemy.name} got ${scenario.damage} damage(s)!`];
            } else {
                this.renderingTextInUI = `${enemy.name} got ${scenario.damage} damage(s)!`;
            }

            // battle.js:186 numOfFrames        :  75
            // battle.js:187 decreaseHPPerFrame :  4

            let remainHPDiff = scenario.damage;
            const numOfFrames = Math.floor(1000 / FPS);
            const decreaseHPPerFrame = Math.ceil(scenario.damage / numOfFrames);
            // console.log(`numOfFrames        : `, numOfFrames)
            // console.log(`decreaseHPPerFrame : `, decreaseHPPerFrame)
            while (remainHPDiff > 0) {
                remainHPDiff = remainHPDiff - decreaseHPPerFrame;
                enemy.isAttacking = true;
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            enemy.remainHP = enemy.remainHP - decreaseHPPerFrame
                            if (enemy.remainHP <= 0) {
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
            console.log(`attackInfo : `, attackInfo)

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
    renderAttackEnemy(targetIndex, attackName) {
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
                width: attackInfo.spriteSize.width,
                height: attackInfo.spriteSize.height
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
                base.left, base.top,
                spriteSize.width * this.drawWeight,
                spriteSize.height * this.drawWeight);
            this.renderTextInUI();
        }
    }
    // Render buff effect
    async renderBuffCharacter(targetIndex, skillName) {
        return new Promise(async (resolve, reject) => {
            if (this.UIMode === UI_MODE.BUFFING) {
                // console.log(`renderBuffCharacter(${targetIndex}) : `, skillName);
                // console.log(`renderAttackEnemy start`)
                const targetCharInfo = this.findPlayerInfoByIndex(targetIndex);
                const skillInfo = this.AttackEffect[skillName];
                // console.log(`renderBuffCharacter(${targetIndex}) : targetCharInfo  :`, targetCharInfo);
                // console.log(`renderBuffCharacter(${targetIndex}) : skillInfo  :`, skillInfo);

                const spriteRow = parseInt(this.attackRenderTimestamp / skillInfo.col);
                const spriteCol = this.attackRenderTimestamp % skillInfo.col;

                const drawWeight = 15;

                this.ctx.drawImage(
                    skillInfo.imageInfo,
                    skillInfo.spriteSize.width * spriteCol,
                    skillInfo.spriteSize.height * spriteRow,
                    skillInfo.spriteSize.width, skillInfo.spriteSize.height,
                    (this.UIContainer.left + 25) + (((this.UIContainer.width * 0.15) + 10) * targetIndex) - drawWeight,
                    this.UIContainer.top + 30 - drawWeight,
                    64 + 2 * drawWeight,
                    64 + 2 * drawWeight
                );

                setTimeout(resolve, 3000);
            }
            else if (this.UIMode === UI_MODE.BUFFING_ALL) {
                const skillInfo = this.AttackEffect[skillName];
                // console.log(`renderBuffCharacter(All)`);
                const spriteRow = parseInt(this.attackRenderTimestamp / skillInfo.col);
                const spriteCol = this.attackRenderTimestamp % skillInfo.col;

                const drawWeight = 15;
                for (let idx = 0; idx < this.PlayerList.length; idx++) {
                    this.ctx.drawImage(
                        skillInfo.imageInfo,
                        skillInfo.spriteSize.width * spriteCol,
                        skillInfo.spriteSize.height * spriteRow,
                        skillInfo.spriteSize.width, skillInfo.spriteSize.height,
                        (this.UIContainer.left + 25) + ((((this.UIContainer.width * 0.15) + 10) * idx)) - drawWeight,
                        this.UIContainer.top + 30 - drawWeight,
                        64 + 2 * drawWeight,
                        64 + 2 * drawWeight
                    );
                }

                setTimeout(resolve, 3000);

            }
        });
    }

    renderSelectMagicInUI() {
        console.log(`currentAttackName `, this.currentActiveCharacter)

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
        let textIdx = 0;
        for (let idx = 0; idx < this.MagicListArray.length; idx++) {
            // console.log(this.MagicListArray)
            const magic = this.MagicListArray[idx];
            if (this.currentActiveCharacter !== magic.user) {
                continue;
            }

            // console.log(`magic : , `, magic)
            // Magic name
            this.ctx.fillText(magic.name,
                base.left + 10,
                40 + this.UIContainer.top + (this.UIContainer.height / 5 * textIdx)
            );
            textIdx++;
            // Magic description
            // this.ctx.fillText(magic.description,
            //     base.left + 60,
            //     40 + this.UIContainer.top + (this.UIContainer.height / 5 * idx)
            // );
        }
    }

    async selectMagic(magicScenario) {
        const targetIndex = this.MagicListArray
            .filter(magic => this.currentActiveCharacter === magic.user)
            .findIndex(magic => {
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
                // console.log(` while this.selectedEnemyIndex : `, this.selectedEnemyIndex)
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

    async useMagicBuff(magicScenario) {
        console.log(`useMagicBuff() :`, magicScenario);
        return new Promise(async (resolve, reject) => {
            if (magicScenario.to !== `All`) {
                const targetCharacter = this.findPlayerInfoByName(magicScenario.to);
                const targetCharacterName = targetCharacter.name;

                this.attackRenderTimestamp = 0;
                this.currentAttackName = magicScenario.spell;
                this.currentAttackTarget = magicScenario.to;
                const buffInfo = this.MagicList[magicScenario.spell];
                this.renderingTextInUI = [
                    `${magicScenario.from} uses ${magicScenario.spell} to ${targetCharacterName}!`,
                    `Use ${buffInfo.mana} mana!`,
                ];
                if (this.findPlayerInfoByName(magicScenario.from).remainMP < buffInfo.mana) {
                    console.warn(`The magic scenario need more mana.`);
                }
                this.findPlayerInfoByName(magicScenario.from).remainMP -= buffInfo.mana;

                // console.log(`===========================================`)
                // console.log(this.MagicList)
                // console.log(magicScenario)
                // console.log(attackInfo)
                // console.log(`===========================================`)
                await this._commandActionToPlayer({
                    target: targetCharacter,
                    scenario: magicScenario,
                    moveType: magicScenario.action
                });

            }
            // All buff
            else {
                this.attackRenderTimestamp = 0;
                this.currentAttackName = magicScenario.spell;
                this.currentAttackTarget = magicScenario.to;
                const buffInfo = this.MagicList[magicScenario.spell];
                this.renderingTextInUI = [
                    `${magicScenario.from} uses ${magicScenario.spell}!`,
                    `Use ${buffInfo.mana} mana!`,
                ];
                if (this.findPlayerInfoByName(magicScenario.from).remainMP < buffInfo.mana) {
                    console.warn(`The magic scenario need more mana.`);
                }
                this.findPlayerInfoByName(magicScenario.from).remainMP -= buffInfo.mana;

                await this._commandActionToPlayer({
                    target: `All`,
                    scenario: magicScenario,
                    moveType: magicScenario.action
                });
            }
            // After effect rendering end
            this.UIMode = UI_MODE.ATTACK_RESULT;
            if (Array.isArray(magicScenario.comments)) {

                this.renderingTextInUI = magicScenario.comments;
            }
            else {
                this.renderingTextInUI = [
                    `${magicScenario.comments}`
                ];
            }

            // console.log(`magic done done`);
            setTimeout(() => {
                // this.renderingTextInUI = ``;
                this.attackRenderTimestamp = 0;
                resolve();
            }, 1000);
        });
    }

    async useMagic(magicScenario) {
        return new Promise(async (resolve, reject) => {
            console.log(`useMagic() :`, magicScenario);
            const enemy = this.findEnemyInfoByIndex(magicScenario.to);
            const enemyName = enemy.name;

            this.attackRenderTimestamp = 0;
            this.currentAttackName = magicScenario.spell;
            this.currentAttackTarget = magicScenario.to;
            const attackInfo = this.MagicList[magicScenario.spell];
            this.renderingTextInUI = [
                `${magicScenario.from} uses ${magicScenario.spell} to ${enemyName}!`,
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
            if (magicScenario.action === `Magic`) {
                await this._reduceRemainHP({
                    enemy,
                    scenario: magicScenario,
                    attackType: `Magic`
                });
            }
            else {
                await this._commandActionToPlayer({
                    target: enemy,
                    scenario: magicScenario,
                    moveType: magicScenario.action
                });
            }

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

    findPlayerIndexByName(name) {
        for (let idx = 0; idx < this.PlayerList.length; idx++) {
            if (name === this.PlayerList[idx].name) {
                return idx;
            }
        }
        return null;
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

    drawPlayerCharacterSelected(targetCharacterIndex) {
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
                if (targetCharacterIndex === `All`) {
                    this.ctx.roundRect(
                        (this.UIContainer.left + 10) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 10,
                        this.UIContainer.width * 0.15,
                        this.UIContainer.height * 0.85,
                        this.UIContainer.borderRadius
                    );
                    this.ctx.strokeStyle = `#00FF00`;
                    // this.ctx.strokeStyle = `#CCCCCC`;
                }
                else {
                    this.ctx.roundRect(
                        (this.UIContainer.left + 10) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 10,
                        this.UIContainer.width * 0.15,
                        this.UIContainer.height * 0.85,
                        this.UIContainer.borderRadius
                    );
                    if (targetCharacterIndex === idx) {
                        this.ctx.strokeStyle = `#00FF00`;
                    } else {
                        this.ctx.strokeStyle = `#CCCCCC`;
                    }
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
                if (character.remainHP > 0) {
                    this.ctx.drawImage(character.imageInfo[character.currentPhase],
                        (this.UIContainer.left + 25) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 30,
                        64, 64);
                }
                // Player fainted
                else {
                    this.ctx.filter = `grayscale(100%)`;
                    this.ctx.drawImage(character.imageInfo[character.currentPhase],
                        (this.UIContainer.left + 25) + (((this.UIContainer.width * 0.15) + 10) * idx),
                        this.UIContainer.top + 30,
                        64, 64);
                }
                this.ctx.filter = `none`;


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
                left: enemyInfo.drawStartPos.x + 32 * this.drawWeight + (4 * (idx)),
                top: enemyInfo.drawStartPos.y - 70 * this.drawWeight
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

    async moveCharacterSelect(targetName) {
        const targetIndex = this.findPlayerIndexByName(targetName);
        return new Promise(async (resolve, reject) => {
            let diff = 0;
            if (this.selectedCharacterIndex < targetIndex) {
                diff = 1;
            } else if (this.selectedCharacterIndex > targetIndex) {
                diff = -1;
            } else {
                return setTimeout(resolve, 1000);
            }

            while (this.selectedCharacterIndex !== targetIndex) {
                console.log(` while this.moveCharacterSelect : `, this.selectedCharacterIndex)
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            this.selectedCharacterIndex += diff;
                            // while (this.findEnemyInfoByIndex(this.selectedCharacterIndex).status === `Dead`) {
                            //     this.selectedCharacterIndex += diff;
                            // }
                            _resolve();
                        }, ARROW_MOVE_SPEED);
                    });
                })();
            }
            setTimeout(resolve, 1000);


        });
    }

    async moveEnemySelectorArrow(targetIndex) {
        // console.log(`moveEnemySelectorArrow : ${this.selectedEnemyIndex} -> ${targetIndex}`);
        return new Promise(async (resolve, reject) => {
            let diff = 0;
            if (this.selectedEnemyIndex < targetIndex) {
                diff = 1;
            } else if (this.selectedEnemyIndex > targetIndex) {
                diff = -1;
            } else {
                return setTimeout(resolve, 1000);
            }

            while (this.selectedEnemyIndex !== targetIndex) {
                // console.log(` while this.selectedEnemyIndex : `, this.selectedEnemyIndex)
                await (() => {
                    return new Promise((_resolve, _reject) => {
                        setTimeout(() => {
                            this.selectedEnemyIndex += diff;
                            while (this.findEnemyInfoByIndex(this.selectedEnemyIndex).status === `Dead`) {
                                this.selectedEnemyIndex += diff;
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

            charInfo.imageInfo = [];
            if (!charInfo.phaseInfo) {
                charInfo.phaseInfo = [{
                    image: charInfo.icon,
                    remainHP: 100
                }];
            }

            charInfo.currentPhase = 0;
            let isLoadedCount = 0;

            for (let i = 0; i < charInfo.phaseInfo.length; i++) {
                charInfo.imageInfo[i] = new Image();
                charInfo.imageInfo[i].phaseInfo = charInfo.phaseInfo[i];
                charInfo.imageInfo[i].src = charInfo.phaseInfo[i].image;
                charInfo.imageInfo[i].onload = () => {
                    isLoadedCount++;
                    if (isLoadedCount === charInfo.phaseInfo.length) {
                        this.Characters.push(charInfo);
                        resolve();
                    }
                }
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
                    if (this.spellToCharacter === character.name) {
                        this.ctx.strokeStyle = `#CCCCCC`;
                    } else if (this.currentActiveCharacter === character.name) {
                        this.ctx.strokeStyle = `#FF6666`;
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
                    if (character.remainHP > 0) {
                        this.ctx.drawImage(character.imageInfo[character.currentPhase],
                            (this.UIContainer.left + 25) + (((this.UIContainer.width * 0.15) + 10) * idx),
                            this.UIContainer.top + 30,
                            64, 64);
                    }
                    // Player fainted
                    else {
                        this.ctx.filter = `grayscale(100%)`;
                        this.ctx.drawImage(character.imageInfo[character.currentPhase],
                            (this.UIContainer.left + 25) + (((this.UIContainer.width * 0.15) + 10) * idx),
                            this.UIContainer.top + 30,
                            64, 64);
                    }
                    this.ctx.filter = `none`;

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

                    this.ctx.drawImage(character.imageInfo[character.currentPhase],
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
        // const drawPadding = 10 * this.drawWeight; // Left / right padding
        // const drawStartLeftPos = 320 - ((64 * this.drawWeight / 2 + drawPadding) * this.enemiesList.length);
        // const drawStartTopPos = 270 - 64 * this.drawWeight;


        const drawPadding = 10; // Left / right padding
        const drawStartLeftPos = 320 - ((64 * this.drawWeight + drawPadding / 2) * this.enemiesList.length);
        const drawStartTopPos = 270 * 1 / this.drawWeight;

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
                    enemy.drawStartPos.x + 16 * this.drawWeight,
                    enemy.drawStartPos.y - 29 * this.drawWeight,
                    108 * this.drawWeight,
                    20 * this.drawWeight,
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
                this.ctx.font = `${14 * this.drawWeight}px Arial`;
                this.ctx.textAlign = `center`;
                this.ctx.fillText(enemy.name,
                    enemy.drawStartPos.x + 68 * this.drawWeight,
                    enemy.drawStartPos.y - 14 * this.drawWeight
                );

                // Draw enemy shadow
                if (this.battleOptions.drawShadow !== false) {
                    this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
                    this.ctx.beginPath();
                    this.ctx.ellipse(
                        enemy.drawStartPos.x + 64 * this.drawWeight,
                        enemy.drawStartPos.y + 118 * this.drawWeight,
                        50 * this.drawWeight,
                        10 * this.drawWeight,
                        0,
                        0,
                        2 * Math.PI);
                    this.ctx.fill();
                }


                // Render HP / MP Bar
                // HP Bar
                this.ctx.lineWidth = 1;
                this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
                this.ctx.strokeStyle = `#FFFFFF`;
                this.ctx.beginPath();
                this.ctx.roundRect(
                    enemy.drawStartPos.x + 28 * this.drawWeight,
                    enemy.drawStartPos.y + 135 * this.drawWeight,
                    ((this.UIContainer.width * 0.15) - 20) * this.drawWeight,
                    20 * this.drawWeight,
                    this.UIContainer.borderRadius / 2
                );
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.fillStyle = `rgba(255, 0, 0, 0.5)`
                // console.log(` (enemy.remainHP / enemy.HP),`,((this.UIContainer.width * 0.15) - 20) * (enemy.remainHP / enemy.HP))
                this.ctx.beginPath();
                this.ctx.roundRect(
                    enemy.drawStartPos.x + (28 * this.drawWeight),
                    enemy.drawStartPos.y + (135 * this.drawWeight),
                    (((this.UIContainer.width * 0.15) - 20) * (enemy.remainHP / enemy.HP)) * this.drawWeight,
                    20 * this.drawWeight,
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
                this.ctx.font = `${14 * this.drawWeight}px Arial`;
                const hpmpText = {
                    HP: `${enemy.remainHP} / ${enemy.HP}`,
                    MP: enemy.type === `Player` ?
                        `${enemy.remainMP} / ${enemy.MP}` : `?? / ??`,
                }
                this.ctx.textAlign = `center`;
                this.ctx.fillText(hpmpText.HP,
                    enemy.drawStartPos.x + 64 * this.drawWeight,
                    enemy.drawStartPos.y + 150 * this.drawWeight
                );
                // this.ctx.fillText(hpmpText.MP,
                //     enemy.drawStartPos.x + 64,
                //     enemy.drawStartPos.y + 170
                // );

                if (
                    (this.UIMode !== UI_MODE.BATTLE_DEFEAT) &&
                    (this.UIMode !== UI_MODE.GAME_OVER)
                ) {
                    this.ctx.globalAlpha = 1;
                }
            }

            // Draw emeny image
            // this.ctx.globalCompositeOperation = "source-over";
            const isJump = this.isBattleStart ? 2 : 1;

            let targetEnemyImageInfo = enemy.imageInfo[enemy.currentPhase];
            // const remainHPPercentage = (enemy.remainHP / enemy.HP) * 100;
            // let targetEnemyImageInfo = enemy.imageInfo.reverse().find(
            //     (imgInfo) => { return imgInfo.phaseInfo.remainHP >= remainHPPercentage }
            // );

            if (enemy.status === `Deading`) {
                if (enemy.opacity <= 0) {
                    enemy.status = `Dead`;
                    console.log(`Enemy ${enemy.name} is dead.`);
                }
                this.ctx.globalAlpha = enemy.opacity;
                this.ctx.drawImage(targetEnemyImageInfo,
                    enemy.drawStartPos.x,
                    enemy.drawStartPos.y,
                    128 * this.drawWeight, 128 * this.drawWeight);
                this.ctx.globalAlpha = 1;
            } else if (enemy.status !== `Dead`) {
                if (enemy.isAttacking === true) {
                    if (parseInt(++this.attackingBlinkEffectCount / 4) % 2 === 0) {
                        this.ctx.drawImage(targetEnemyImageInfo,
                            enemy.drawStartPos.x,
                            enemy.drawStartPos.y,
                            128 * this.drawWeight, 128 * this.drawWeight);
                    }
                } else {
                    this.ctx.drawImage(targetEnemyImageInfo,
                        enemy.drawStartPos.x,
                        enemy.drawStartPos.y - (10 * ((this.isJumpFlag + idx) % isJump)),
                        128 * this.drawWeight, 128 * this.drawWeight);
                }

            }
        }
    }

    async setGameoverAlpha() {
        return new Promise(async (resolve, reject) => {

            let alphaValue = 0;
            const fadeinCanvas = async () => {
                return new Promise((_resolve, _reject) => {
                    const fadeinInterval = setInterval(() => {
                        this.ctx.globalAlpha = alphaValue;
                        alphaValue += 0.01;
                        if (alphaValue > 1) {
                            alphaValue = 1;
                            _resolve();
                            clearInterval(fadeinInterval);
                        }
                    }, 50);
                });
            }
            const fadeoutCanvas = async () => {
                return new Promise((_resolve, _reject) => {
                    const fadeoutInterval = setInterval(() => {
                        this.ctx.globalAlpha = alphaValue;
                        alphaValue -= 0.01;
                        if (alphaValue < 0) {
                            alphaValue = 0;
                            _resolve();
                            clearInterval(fadeoutInterval);
                        }
                    }, 50);
                });
            }

            await fadeinCanvas();
            await sleep(2000);
            await fadeoutCanvas();
            resolve();
        })
    }

    async renderGameover() {
        return new Promise(async (resolve, reject) => {
            if (this.UIMode === UI_MODE.GAME_OVER) {
                this.ctx.clearRect(0, 0, 640, 640);
                this.ctx.drawImage(this.gameoverImage,
                    0, 0, 640, 640);
            }
            resolve();
        });
    }

    drawMenuText() {
        this.renderUIBoxMenu();
        this.drawMenuSelectorArrow(this.selectedMenu); //.drawImage(this.backgroundImageInstance, 0, 0, 640, 640);
    }

    renderTextInUI(str = this.renderingTextInUI) {
        // console.log(`Rendering text : `, str);
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
        if (this.UIMode === UI_MODE.BATTLE_START) {
            let text = ``;
            if (this.enemiesList.length === 1) {
                text = `The ${this.enemiesList[0].name} is appeared!`
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

    async setBattleWinText() {
        return new Promise(async (resolve, reject) => {
            if (this.UIMode === UI_MODE.BATTLE_WIN) {
                if (this.isBattleEndTextRendering === false) {
                    this.isBattleEndTextRendering = true;

                    const awards = this.getAwards();

                    let textArr = [];
                    textArr.push(`You Win!`);
                    // this.renderTextInUI(textArr);
                    this.renderingTextInUI = [
                        ...textArr];
                    await sleep(500);
                    textArr.push(`Got ${awards.Gold} Gold!`);
                    this.renderingTextInUI = [
                        ...textArr];
                    await sleep(500);
                    textArr.push(`Got ${awards.EXP} EXP!`);
                    this.renderingTextInUI = [
                        ...textArr];
                    await sleep(500);

                } else {
                    console.log(this.renderingTextInUI)
                }

                await sleep(2000);
                resolve();
            }
        });
    }

    async setBattleDefeatText() {
        return new Promise(async (resolve, reject) => {
            if (this.UIMode === UI_MODE.BATTLE_DEFEAT) {
                if (this.isBattleEndTextRendering === false) {
                    this.isBattleEndTextRendering = true;

                    let alphaValue = 1;
                    const fadeoutCanvas = () => {
                        this.ctx.globalAlpha = alphaValue;
                        alphaValue -= 0.01;
                        if (alphaValue < 0) {
                            alphaValue = 0;
                        }
                    }

                    while (alphaValue > 0) {
                        await (() => {
                            return new Promise((_resolve, _reject) => {
                                setTimeout(() => {
                                    fadeoutCanvas();
                                    _resolve();
                                }, 40)
                            })
                        })();
                    }


                    let textArr = [];
                    textArr.push(`You lose...`);
                    // this.renderTextInUI(textArr);
                    // this.renderingTextInUI = [
                    //     ...textArr];
                    // await sleep(500);
                    // textArr.push(`Got ${awards.Gold} Gold!`);
                    // this.renderingTextInUI = [
                    //     ...textArr];
                    // await sleep(500);
                    // textArr.push(`Got ${awards.EXP} EXP!`);
                    // this.renderingTextInUI = [
                    //     ...textArr];
                    // await sleep(500);

                } else {
                    console.log(this.renderingTextInUI)
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
            if (scenario.critical === true) {
                this.renderingTextInUI = [
                    `Critical hit!`,
                    `${scenario.to} got ${scenario.damage} damage(s)!`
                ];
            }
            else {
                this.renderingTextInUI = `${scenario.to} got ${scenario.damage} damage(s)!`;
            }
            this.findPlayerInfoByName(scenario.to).remainHP -= scenario.damage;
            if (this.findPlayerInfoByName(scenario.to).remainHP < 0) {
                this.findPlayerInfoByName(scenario.to).remainHP = 0;
                this.renderingTextInUI = [
                    `${scenario.to} got ${scenario.damage} damage(s)!`,
                    `${scenario.to} fainted!`,
                ]
            }
        } else {
            await sleep(1500);
            this.renderingTextInUI = `${scenario.to} avoid!`;
        }

        this.screenShakedEffectDistance = 0;
        await sleep(1500);
    }

    async showTextOnly(scenario) {
        if (this.UIMode = UI_MODE.TEXT) {
            this.renderingTextInUI = scenario.description;
            await sleep(1500);
        }
    }

    async phaseChange(scenario) {
        this.renderingTextInUI = scenario.description;
        const target = this.findEnemyInfoByIndex(scenario.from);
        target.currentPhase++;
        console.log(`Phase ${target.name} chaged to [${target.currentPhase}]`, target.phaseInfo[target.currentPhase]);

        // phaseInfo[]
        await sleep(1500);
    }

    addTurn() {
        this.battleScenario.push({
            scenario: `addTurn`
        })
    }

    addBattleScenario(scenarioObject) {
        this.battleScenario.push(scenarioObject);
    }

    async runBattle() {
        let turn = 1;
        return new Promise(async (resolve, reject) => {
            for (const scenario of this.battleScenario) {
                // if ((scenario.from === `Clef`) && (scenario.action === `Attack`)) {
                if (scenario.scenario === `addTurn`) {
                    console.log(`[Turn Report] Turn : ${turn++}`);
                    continue;
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
                    // Use magic to player character
                    case `Magic_Heal`:
                    case `Magic_Buff`: {
                        this.UIMode = UI_MODE.BATTLE_MENU;
                        await this.moveMenuSelectorArrow(1);
                        // console.log(`ENEMY:`, this.findEnemyInfoByIndex(scenario.to));
                        // console.log(`Select magic`)
                        this.UIMode = UI_MODE.MAGIC_SELECT;
                        await this.selectMagic(scenario);
                        this.UIMode = UI_MODE.CHARACTER_SELECT;
                        await this.moveCharacterSelect(scenario.to);
                        // await this.moveEnemySelectorArrow(scenario.to);
                        // await this.moveEnemySelectorArrow(scenario.to);
                        // console.log(`Attack to enemy`);
                        this.UIMode = UI_MODE.BUFFING;
                        await this.useMagicBuff(scenario);
                        this.UIMode = UI_MODE.ATTACK_RESULT;
                        break;
                    }

                    case `Magic_Buff_All`: {
                        this.UIMode = UI_MODE.BATTLE_MENU;
                        await this.moveMenuSelectorArrow(1);
                        this.UIMode = UI_MODE.MAGIC_SELECT;
                        await this.selectMagic(scenario);
                        this.UIMode = UI_MODE.BUFFING_ALL;
                        await this.useMagicBuff(scenario);
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

                    case `Phase`: {
                        this.UIMode = UI_MODE.PHASE_CHANGE;
                        await this.phaseChange(scenario);
                        break;
                    }
                    case `Text`: {
                        this.UIMode = UI_MODE.TEXT;
                        await this.showTextOnly(scenario);
                        break;
                    }
                }


                console.log(`[Turn Report] Battle phase done : ########################## `);
                console.log(`[Turn Report] Music time : ${document.getElementById(`bgm`).currentTime}`);

                let remainPlayersHP = 0;
                for (const player of this.PlayerList) {
                    console.log(`[Turn Report] Player [${player.name}] : `);
                    console.log(`[Turn Report]      HP : ${player.remainHP}/${player.HP}`);
                    console.log(`[Turn Report]      HP : ${player.remainMP}/${player.MP}`);
                    remainPlayersHP += player.remainHP;
                }
                for (const enemy of this.enemiesList) {
                    console.log(`[Turn Report] Enemy [${enemy.name}] : `);
                    console.log(`[Turn Report]      HP : ${enemy.remainHP}/${enemy.HP}`);
                }
                if (remainPlayersHP <= 0) {
                    console.log(`[Turn Report] Game over`);
                    await this.defeatAndGameover();
                    resolve();
                    break;
                }
                console.log(`[Turn Report] ############################################## `);


            }
            console.log(`Battle all scenario done.`);
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

            if (this.UIMode !== UI_MODE.GAME_OVER) {
                this.startRenderBasicUIs();
            }

            if (this.UIMode === UI_MODE.BATTLE_MENU) {
                this.drawMenuText();
                this.renderPlayerCharacterInUI();
            } else if (this.UIMode === UI_MODE.MAGIC_SELECT) {
                this.renderSelectMagicInUI();
            } else if (this.UIMode === UI_MODE.ENEMY_SELECT) {
                this.drawEnemySelected(this.selectedEnemyIndex);
            } else if (this.UIMode === UI_MODE.CHARACTER_SELECT) {
                this.drawPlayerCharacterSelected(this.selectedCharacterIndex);
            } else if (this.UIMode === UI_MODE.ATTACKING) {
                this.renderAttackEnemy(this.selectedEnemyIndex, this.currentAttackName);
            } else if (this.UIMode === UI_MODE.BUFFING) {
                // if ALL
                this.drawPlayerCharacterSelected(this.selectedCharacterIndex);
                await this.renderBuffCharacter(this.selectedCharacterIndex, this.currentAttackName);
            } else if (this.UIMode === UI_MODE.BUFFING_ALL) {
                this.drawPlayerCharacterSelected(`All`);
                await this.renderBuffCharacter(this.selectedCharacterIndex, this.currentAttackName);
            } else if (this.UIMode === UI_MODE.ATTACK_RESULT) {
                this.renderTextInUI();
            } else if (this.UIMode === UI_MODE.ATTACK_BY_ENEMY) {
                this.renderTextInUI();
            } else if (this.UIMode === UI_MODE.BATTLE_WIN) {
                this.renderTextInUI();
            } else if (this.UIMode === UI_MODE.BATTLE_DEFEAT) {
                this.renderTextInUI();
            } else if (this.UIMode === UI_MODE.GAME_OVER) {
                this.renderGameover();
            } else if (this.UIMode === UI_MODE.PHASE_CHANGE) {
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

    async defeatAndGameover() {
        return new Promise(async (resolve, reject) => {
            this.UIMode = UI_MODE.BATTLE_DEFEAT;
            await this.setBattleDefeatText();

            this.UIMode = UI_MODE.GAME_OVER;
            await this.setGameoverAlpha();

            this.isBattleEnd = true;
            clearInterval(this.animationInterval);
            this.ctx.clearRect(0, 0, 640, 640);
            console.log(`Battle complete.`);
            endTimer();
            resolve();
        });
    }

    async end() {
        return new Promise(async (resolve, reject) => {
            const pixelateCount = 48;
            let remainPixelateCount = 0;

            this.UIMode = UI_MODE.BATTLE_WIN;

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
            await this.setBattleWinText();
            window.requestAnimationFrame(startPixelate);
        });
    }
}