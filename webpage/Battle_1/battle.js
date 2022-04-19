const FPS = 10;

class Battle {
    constructor(param) {
        return new Promise((resolve, reject) => {
            this.backgroundImageInstance = new Image();
            this.backgroundImageInstance.src = param.background;

            this.UIContainer = {};

            this.Characters = [];
            this.sortedCharacters = [];

            this.canvas = document.getElementById(`mapCanvas`);
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

    drawMenuSelector(idx) {
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

    renderUI() {
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

        // Render menu text
        let count = 0;
        const numOfmenu = Object.keys(this.UIContainer.menu).length;
        const rowcol = parseInt(Math.sqrt(numOfmenu))

        for (const menuText in this.UIContainer.menu) {
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

    async _addCharInfo(info) {
        return new Promise((resolve, reject) => {
            const charInfo = info;
            charInfo.turnPoint = 0;
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
        const players = [];
        for (const player of this.Characters) {
            if (player.type === `Player`) {
                players.push(player);
            }
        }

        for (let idx = 0; idx < players.length; idx++) {
            (() => {
                const character = players[idx];

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
                    this.UIContainer.top + 90,
                    (this.UIContainer.width * 0.15) - 20,
                    20,
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
                    this.UIContainer.top + 110,
                    (this.UIContainer.width * 0.15) - 20,
                    20,
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
                    this.UIContainer.top + 20,
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
                    this.UIContainer.top + 20,
                    64, 64);
                this.ctx.font = `14px Arial`;

                const hpmpText = {
                    HP: `${character.HP} / ${character.remainHP}`,
                    MP: character.type === `Player` ?
                        `${character.MP} / ${character.remainMP}` : `?? / ??`,
                }
                this.ctx.textAlign = `center`;
                this.ctx.fillText(hpmpText.HP,
                    (this.UIContainer.left + 55) + (((this.UIContainer.width * 0.15) + 10) * idx),
                    this.UIContainer.top + 105,
                );
                this.ctx.fillText(hpmpText.MP,
                    (this.UIContainer.left + 55) + (((this.UIContainer.width * 0.15) + 10) * idx),
                    this.UIContainer.top + 125,
                );
            })();
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
        const enemies = [];
        for (const enemy of this.Characters) {
            if (enemy.type === `Enemy`) {
                enemies.push(enemy);
            }
        }
        const drawPadding = 10; // Left / right padding
        const drawStartLeftPos = 320 - ((64 + drawPadding / 2) * enemies.length);
        // console.log(`drawStartLeftPos : ${drawStartLeftPos}`)
        /**
         * 가운데 정렬 기준
         * 1개 : 320 - 64 + padding * 0
         * 2개 : 320 - 128 + padding * 0.5
         * 3게 : 320 - 64 - 128 + padding * 1.5
         * 4개 : 320 - 148 - 128 + padding * 2
         */

        for (let idx = 0; idx < enemies.length; idx++) {
            const enemy = enemies[idx];
            enemy.drawStartPos = {
                x: drawStartLeftPos + ((128 + drawPadding) * idx),
                y: 220
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

            this.ctx.drawImage(enemy.imageInfo,
                enemy.drawStartPos.x,
                enemy.drawStartPos.y,
                128, 128);

            // Render HP / MP Bar
            // HP Bar
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = `#FFFFFF`;
            this.ctx.beginPath();
            this.ctx.roundRect(
                enemy.drawStartPos.x + 28,
                enemy.drawStartPos.y + 135,
                (this.UIContainer.width * 0.15) - 20,
                20,
                this.UIContainer.borderRadius / 2
            );
            this.ctx.fillStyle = `rgba(255, 0, 0, 0.5)`
            this.ctx.fill()
            this.ctx.stroke();

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
                HP: `${enemy.HP} / ${enemy.remainHP}`,
                MP: enemy.type === `Player` ?
                    `${enemy.MP} / ${enemy.remainMP}` : `?? / ??`,
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

    async animate() {
        let animateCountForCharacterUIRender = 0;
        this.sortCharacters();
        setInterval(async () => {
            this.ctx.clearRect(0, 0, 640, 640);

            // Render menu arrow
            this.ctx.drawImage(this.backgroundImageInstance, 0, 0, 640, 640);
            this.renderUI();
            this.drawMenuSelector(0); //.drawImage(this.backgroundImageInstance, 0, 0, 640, 640);
            if (animateCountForCharacterUIRender++ > 10) {
                this.sortCharacters();
                animateCountForCharacterUIRender = 0;
            }
            this.drawEnemy();
            this.renderCharacterBattleOrder();
            this.renderPlayerCharacterInUI();
            // for (const instance of NPCList) {
            // console.log(`Render : `, instance.img)
            // instance.renderFrame();
            // }
        }, 1000 / FPS);
    }

}