const SPRITE_DIRECTION = {
    UP: 3,
    DOWN: 0,
    LEFT: 1,
    RIGHT: 2
}
const MOVING_DISTANCE = {
    x: 4,
    y: 4
}
const FPS = 10;

const SPRITE_ORDER = [0, 1, 2, 1]

const mapImage = new Image();
mapImage.src = "./map.png";

let zoomRatio = 1;

let NPCList = [];
let startTimestamp = 0;

class NPC {
    // size : 16 x 16

    static ctx = null;

    static DIRECTION = SPRITE_DIRECTION;

    static mapImage = new Image();
    static async setMapImage(src) {
        console.log(`Load map image : `, src)
        return new Promise((resolve, reject) => {
            try {
                this.mapImage.src = src;

                this.mapImage.onload = () => {
                    console.log(`Load map image : done`);
                    resolve();
                };
            } catch (err) {
                reject(err);
            }
        });
    }

    static _DEBUG_SCENARIO_TIMESTAMP = 0;
    static _DEBUG_SET_SCENARIO_INDEX_ENABLED = false;
    static _DEBUG_DISABLE() {
        this._DEBUG_SET_SCENARIO_INDEX_ENABLED = false;
    }
    static _DEBUG_SET_SCENARIO_TIMESTAMP(timestamp) {
        this._DEBUG_SET_SCENARIO_INDEX_ENABLED = true;
        this._DEBUG_SCENARIO_TIMESTAMP = timestamp;
    }

    constructor(filename, options = {}) {
        return new Promise((resolve, reject) => {
            this.canvas = document.getElementById(`mapCanvas`);
            this.container = document.getElementById(`container`);

            this.options = options;
            // this.canvas.classList.add(`npc`)
            this.isShow = true;
            this.currentTimestamp = 0;

            this.currentEvent = ``;
            this.timestampEvent = []; // {event, timestamp}
            this.timestampEventIndex = 0;
            this.showTimestamp = 0;
            this.opacity = 1;

            this.animateOrderIndex = 0;

            this.ctx = this.canvas.getContext(`2d`);


            this.canvas.width = 640;
            this.canvas.height = 640;

            // this.canvas.width = ScreenSize.x * zoomRatio;
            // this.canvas.height = ScreenSize.y * zoomRatio;
            this.canvas.imageSmoothingEnabled = false;
            if (NPC.ctx === null) {
                NPC.ctx = this.ctx;
            }

            this.type = ``;
            this.sprite = {
                row: 0,
                col: 0
            }
            this.positionList = []; // {x, y, timestamp}
            this.currentPositionListIndex = 0;
            this.currentPositionRenderingIndex = 0;
            this.pattern = `n`;
            this.distance = 0;
            this.direction = ``;
            this.img = `npc/${filename}`;
            this.spriteImageIndex = 0;
            this.used = false;
            this.originalPosition = {
                x: 0,
                y: 0
            }
            this.renderPosition = {
                x: 0,
                y: 0
            }
            this.animationDelay = 1;
            this._currentDelay = 0;
            this.speed = 4;
            // console.log(`NPC Created : `, filename)

            this.spriteSize = {
                width: 0,
                height: 0
            }

            this.imgTag = new Image();
            this.imgTag.src = this.img;
            this.imgTag.onload = () => {
                // console.log(`Imagefile size : ${this.imgTag.naturalWidth} x ${this.imgTag.naturalHeight}`)

                if (this.options.type === `item`) {
                    this.spriteSize.width = this.imgTag.naturalWidth;
                    this.spriteSize.height = this.imgTag.naturalHeight;
                    // this.setMovingPattern(`s`);
                } else if (this.options.type === `animateItem`) {
                    this.spriteSize.width = this.imgTag.naturalWidth / this.options.sprite.col;
                    this.spriteSize.height = this.imgTag.naturalHeight / this.options.sprite.row;
                    this.setMovingPattern(`s`);
                } else {
                    // Default NPC images
                    this.spriteSize.width = this.imgTag.naturalWidth / 6;
                    this.spriteSize.height = this.imgTag.naturalHeight / 4;
                }

                // this.canvas.width = this.spriteSize.width;
                // this.canvas.height = this.spriteSize.height;
                // this.canvas.width = 640;
                // this.canvas.height = 640;
                // console.log(`Each sprite size : ${this.spriteSize.width} x ${this.spriteSize.height}`)
                // this.ctx.drawImage(this.imgTag, 0, 0, this.spriteSize.width, this.spriteSize.height,
                //     this.renderPosition.x * zoomRatio, this.renderPosition.y * zoomRatio, this.spriteSize.width * zoomRatio, this.spriteSize.height * zoomRatio);
                // console.log(`Draw NPC to canvas`);
                this.container.appendChild(this.canvas);
                NPCList.push(this);
                resolve(this);
            }
        });
    }

    static zoom(ratio) {
        zoomRatio = ratio;
    }

    show() {
        this.isShow = true;
    }

    hide() {
        this.isShow = false;
    }

    _eventSort() {
        this.timestampEvent.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });
    }

    fadein(timestamp) {
        this.timestampEvent.push({
            event: `fadein`,
            timestamp
        });
    }

    fadeout(timestamp) {
        this.timestampEvent.push({
            event: `fadeout`,
            timestamp
        });
    }

    setStartVisible(visible = true) {
        if (visible === true) {
            this.opacity = 1;
            this.isShow = true;
        } else {
            this.opacity = 0;
            this.isShow = false;
        }
    }

    setOpacity(opacity) {
        this.opacity = opacity;
    }

    setStartTime(timestamp) {
        this.timestampEvent.push({
            event: `show`,
            timestamp: timestamp
        });
        this.showTimestamp = timestamp;
        this.opacity = 0;
    }

    setDirection(direction, timestamp = 0) {
        this.timestampEvent.push({
            event: `setDirection`,
            direction: direction,
            timestamp: timestamp
        });
        if (timestamp === 0) {
            this.direction = direction;
        }

    }

    setPosition(x, y, timestamp = 0) {
        if ((typeof x !== `number`) || (typeof y !== `number`)) {
            throw new Error(`${this.img}.setPosition() : invalid position value : (${x}, ${y}, ${timestamp})`);
        }
        this.positionList.push({
            x,
            y,
            timestamp
        });
        this.used = true;
    }

    setMovingPattern(pattern, distance) {
        this.pattern = pattern;
        this.distance = distance;
        if (pattern === `h`) {
            if (distance > 0) {
                this.direction = SPRITE_DIRECTION.RIGHT;
            } else {
                this.direction = SPRITE_DIRECTION.LEFT;
            }
        } else if (pattern === `v`) {

            if (distance > 0) {
                this.direction = SPRITE_DIRECTION.DOWN;
            } else {
                this.direction = SPRITE_DIRECTION.UP;
            }
            // No moving, but animate
        } else if (pattern === `s`) {

        }
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setAnimationDelay(delay, timestamp = 0) {
        if (timestamp === 0) {
            this.animationDelay = delay;
        } else {

            this.timestampEvent.push({
                event: `setAnimationDelay`,
                animationDelay: delay
            });
        }
    }

    setSprite(idx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.imgTag,
            this.spriteSize.width * idx, 0,
            this.spriteSize.width, this.spriteSize.height,
            this.renderPosition.x * zoomRatio, this.renderPosition.y * zoomRatio,
            this.spriteSize.width * zoomRatio, this.spriteSize.height * zoomRatio);
    }

    static animate() {
        startTimestamp = new Date().getTime();

        for (const instance of NPCList) {
            instance._eventSort();
        }

        setInterval(() => {
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.clearRect(0, 0, 240 * zoomRatio, 240 * zoomRatio);
            this.ctx.drawImage(this.mapImage, 0, 0, this.mapImage.naturalWidth * zoomRatio, this.mapImage.naturalHeight * zoomRatio);
            for (const instance of NPCList) {
                // console.log(`Render : `, instance.img)
                if (NPC._DEBUG_SET_SCENARIO_INDEX_ENABLED === false) {
                    instance.timestamp = new Date().getTime() - startTimestamp;
                } else {
                    instance.timestamp = NPC._DEBUG_SCENARIO_TIMESTAMP;
                }
                instance.renderFrame();
            }
        }, 1000 / FPS);
    }

    renderFrame() {
        // console.log(`Rendering ${this.img}...`);
        // this.ctx.clearRect(0, 0, this.spriteSize.width, this.spriteSize.height);
        // console.log(`Animation start`)
        if (this.used === false ||
            this.isShow === false) {
            return;
        }

        this._currentDelay = (this._currentDelay + 1) % this.animationDelay;

        if (this._currentDelay === 0) {
            if (this.distance === 0) {}

            if (this.pattern !== `n`) {
                this.spriteImageIndex = ++this.spriteImageIndex % SPRITE_ORDER.length;

                if (this.pattern === `h`) {
                    if (this.distance === 0) {
                        this.renderPosition.x = this.renderPosition.x;
                        this.renderPosition.y = this.renderPosition.y;
                    } else if (this.distance > 0) {
                        if (this.direction === SPRITE_DIRECTION.RIGHT) {
                            this.renderPosition.x += this.speed;
                            if (this.originalPosition.x + this.distance < this.renderPosition.x) {
                                this.direction = SPRITE_DIRECTION.LEFT;
                            }
                        } else {
                            this.renderPosition.x -= this.speed;

                            if (this.originalPosition.x > this.renderPosition.x) {
                                this.direction = SPRITE_DIRECTION.RIGHT;
                            }

                        }
                    } else {
                        if (this.direction === SPRITE_DIRECTION.RIGHT) {
                            this.renderPosition.x += this.speed;
                            if (this.originalPosition.x < this.renderPosition.x) {
                                this.direction = SPRITE_DIRECTION.LEFT;
                            }
                        } else {
                            this.renderPosition.x -= this.speed;
                            if (this.originalPosition.x + this.distance > this.renderPosition.x) {
                                this.direction = SPRITE_DIRECTION.RIGHT;
                            }

                        }
                    }
                } else if (this.pattern === `v`) {
                    if (this.distance > 0) {
                        if (this.direction === SPRITE_DIRECTION.DOWN) {
                            this.renderPosition.y += this.speed;
                            if (this.originalPosition.y + this.distance < this.renderPosition.y) {
                                this.direction = SPRITE_DIRECTION.UP;
                            }
                        } else {
                            this.renderPosition.y -= this.speed;

                            if (this.originalPosition.y > this.renderPosition.y) {
                                this.direction = SPRITE_DIRECTION.DOWN;
                            }
                        }
                    } else {
                        if (this.direction === SPRITE_DIRECTION.DOWN) {
                            this.renderPosition.y += this.speed;
                            if (this.originalPosition.y < this.renderPosition.y) {
                                this.direction = SPRITE_DIRECTION.UP;
                            }
                        } else {
                            this.renderPosition.y -= this.speed;

                            if (this.originalPosition.y + this.distance > this.renderPosition.y) {
                                this.direction = SPRITE_DIRECTION.DOWN;
                            }
                        }
                    }
                }
            }
        }
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Position related
        if (this.positionList[this.currentPositionListIndex] &&
            this.positionList[this.currentPositionListIndex].timestamp <= this.timestamp) {
            // if (this.img.includes(`Male_A`)) {
            //     console.log(`[${this.timestamp}] Render : `, this.currentPositionListIndex)
            // }
            // this.currentPositionRenderingIndex = this.currentPositionListIndex
            const positionInfo = this.positionList[this.currentPositionListIndex];
            this.originalPosition.x = positionInfo.x;
            this.originalPosition.y = positionInfo.y;
            this.renderPosition.x = positionInfo.x;
            this.renderPosition.y = positionInfo.y;

            if ((this.positionList[this.currentPositionListIndex + 1] &&
                    this.positionList[this.currentPositionListIndex + 1].timestamp <= this.timestamp) &&
                (this.positionList.length - 1 > this.currentPositionListIndex)) {
                this.currentPositionListIndex++;
            }
        }

        // Event related
        if (this.timestampEvent[this.timestampEventIndex] &&
            this.timestampEvent[this.timestampEventIndex].timestamp <= this.timestamp) {
            // if (this.img.includes(`Male_A`)) {
            //     console.log(`[${this.timestamp}] Event : `, this.timestampEvent[this.timestampEventIndex])
            //     console.log(this.opacity)
            // }
            this.currentEvent = this.timestampEvent[this.timestampEventIndex];

            switch (this.currentEvent.event) {
                case `fadein`:
                    this.opacity += 0.1;
                    if (this.opacity >= 1) {
                        this.opacity = 1;
                    }
                    break;
                case `fadeout`:
                    this.opacity -= 0.1;
                    if (this.opacity <= 0) {
                        this.opacity = 0;
                    }
                    break;
                case `setDirection`:
                    this.direction = this.currentEvent.direction;
                    break;
                case `setAnimationDelay`:
                    this.animationDelay = this.currentEvent.animationDelay;
                    break;

            }

            if (this.timestampEvent[this.timestampEventIndex + 1] &&
                this.timestampEvent[this.timestampEventIndex + 1].timestamp <= this.timestamp) {
                this.timestampEventIndex++;

            }
        }

        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        if (this.options.type === `animateItem`) {
            const col = this.animateOrderIndex % this.options.sprite.col;
            const row = parseInt(this.animateOrderIndex / this.options.sprite.col);
            this.ctx.drawImage(this.imgTag,
                this.spriteSize.width * col, this.spriteSize.height * row,
                this.spriteSize.width, this.spriteSize.height,
                this.renderPosition.x * zoomRatio, this.renderPosition.y * zoomRatio,
                this.spriteSize.width * zoomRatio, this.spriteSize.height * zoomRatio);
            this.ctx.restore();

            this.animateOrderIndex++;
            if (this.animateOrderIndex > this.options.sprite.row * this.options.sprite.col - 1) {
                this.animateOrderIndex = 0;
            }

        } else {
            this.ctx.drawImage(this.imgTag,
                this.spriteSize.width * SPRITE_ORDER[this.spriteImageIndex], this.spriteSize.height * this.direction,
                this.spriteSize.width, this.spriteSize.height,
                this.renderPosition.x * zoomRatio, this.renderPosition.y * zoomRatio,
                this.spriteSize.width * zoomRatio, this.spriteSize.height * zoomRatio);
            this.ctx.restore();
        }
    }
}