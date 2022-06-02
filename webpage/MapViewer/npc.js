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

    static ctx;

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


    constructor(filename) {
        return new Promise((resolve, reject) => {
            this.canvas = document.getElementById(`mapCanvas`);
            this.container = document.getElementById(`container`);

            // this.canvas.classList.add(`npc`)
            this.isShow = true;
            this.currentTimestamp = 0;
            this.showTimestamp = 0;
            this.ctx = this.canvas.getContext(`2d`);


            this.canvas.width = 320 * zoomRatio;
            this.canvas.height = 320 * zoomRatio;
            this.canvas.imageSmoothingEnabled = false;

            NPC.ctx = this.ctx;
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
                this.spriteSize.width = this.imgTag.naturalWidth / 6;
                this.spriteSize.height = this.imgTag.naturalHeight / 4;
                // this.canvas.width = this.spriteSize.width;
                // this.canvas.height = this.spriteSize.height;
                // this.canvas.width = 640;
                // this.canvas.height = 640;
                // console.log(`Each sprite size : ${this.spriteSize.width} x ${this.spriteSize.height}`)
                this.ctx.drawImage(this.imgTag, 0, 0, this.spriteSize.width, this.spriteSize.height,
                    this.renderPosition.x * zoomRatio, this.renderPosition.y * zoomRatio, this.spriteSize.width * zoomRatio, this.spriteSize.height * zoomRatio);
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

    setStartTime(timestamp) {
        this.showTimestamp = timestamp;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    setPosition(x, y) {
        this.used = true;
        // console.log(`Set position to [${x} x ${y}]`)
        // this.canvas.style.left = `${x}px`;
        // this.canvas.style.top = `${y}px`;
        this.originalPosition.x = x;
        this.originalPosition.y = y;
        this.renderPosition.x = x;
        this.renderPosition.y = y;
        this.ctx.drawImage(this.imgTag, 0, 0,
            this.spriteSize.width, this.spriteSize.height,
            this.renderPosition.x * zoomRatio, this.renderPosition.y * zoomRatio,
            this.spriteSize.width * zoomRatio, this.spriteSize.height * zoomRatio);
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

    setAnimationDelay(delay) {
        this.animationDelay = delay;
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
        setInterval(() => {
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.clearRect(0, 0, 320 * zoomRatio, 320 * zoomRatio);
            this.ctx.drawImage(this.mapImage, 0, 0, 320 * zoomRatio, 320 * zoomRatio);
            for (const instance of NPCList) {
                // console.log(`Render : `, instance.img)
                instance.timestamp = new Date().getTime() - startTimestamp;
                if (instance.timestamp > instance.showTimestamp) {
                    instance.isShow = true;
                    instance.renderFrame();
                }
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
        if (this.img.includes(`Thief1_USM`)) {
            // console.log(this.direction)
        }

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
        this.ctx.drawImage(this.imgTag,
            this.spriteSize.width * SPRITE_ORDER[this.spriteImageIndex], this.spriteSize.height * this.direction,
            this.spriteSize.width, this.spriteSize.height,
            this.renderPosition.x * zoomRatio, this.renderPosition.y * zoomRatio,
            this.spriteSize.width * zoomRatio, this.spriteSize.height * zoomRatio);
    }
}