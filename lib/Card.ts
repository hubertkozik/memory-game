import { gsap } from 'gsap';
import type Canvas from "./Canvas";

function adjust(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

const config = import.meta.client ? useRuntimeConfig() : {};

interface LayoutOptions {
    width: number,
    height: number
}

interface PosObject {
    column: number,
    row: number
}

interface ImageOptions {
    x: number,
    y: number,
    width: number,
    height: number,
    image: any
}

interface ImageData {
    id: string,
    image: string,
    name: string,
    rarity: {
        color: string,
        id: string,
        name: string
    },
    weapon: {
        id: string,
        name: string
    }
}

export default class Card {
    canvas: Canvas;
    layoutOptions: LayoutOptions;
    pos: PosObject;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string | CanvasGradient = '#fbed2c';
    gradientColor: string;
    angleX: number = 0;
    angleY: number = 0;
    imgOptions?: ImageOptions;
    active: boolean = false;
    imageData: ImageData;
    range?: {
        x1: number,
        x2: number,
        y1: number,
        y2: number
    };
    isAnimating: boolean = false;
    radius: number = 15;

    constructor(canvas: Canvas, layoutOptions: LayoutOptions, pos: PosObject, imageData: ImageData) {
        const boxWidth = canvas.width / layoutOptions.width,
            boxHeight = canvas.height / layoutOptions.height,
            boxMargin = Math.max(canvas.width, canvas.height) / 100;

        this.canvas = canvas;
        this.layoutOptions = layoutOptions;
        this.pos = pos;

        this.x = boxMargin / 2 + boxWidth * pos.column;
        this.y = boxMargin / 2 + boxHeight * pos.row;
        this.width = boxWidth - boxMargin;
        this.height = boxHeight - boxMargin;

        this.setRange();

        this.gradientColor = imageData.rarity.color;

        this.imageData = imageData;
    }

    setRange() {
        this.range = {
            x1: this.x,
            x2: this.x + this.width,
            y1: this.y,
            y2: this.y + this.height
        };
    }

    toggle() {
        if (this.isAnimating) {
            this.render();
        }

        const animate = () => {
            this.render(true);
        }

        gsap.ticker.add(animate);

        this.isAnimating = true;

        gsap.timeline()
            .to(this, {
                x: this.x + this.width / 2,
                width: 0,
                duration: 0.25,
                radius: 0,
                onComplete: () => {
                    this.active = !this.active;
                }
            })
            .to(this, {
                x: this.x,
                width: this.width,
                radius: 15,
                duration: 0.25,
                onComplete:() => {
                    gsap.ticker.remove(animate);
                    this.isAnimating = false;
                }
            });
    }

    setAngle(angleX: number, angleY: number) {
        const animate = () => {
            this.render(true);
        }

        gsap.ticker.add(animate);

        gsap.timeline()
            .to(this, {
                duration: 0.1
            })
            .to(this, {
                angleX,
                angleY,
                duration: 0.1,
                onComplete:() => {
                    gsap.ticker.remove(animate);
                }
            });
    }


    public render(animate: boolean = false) {
        function drawRoundedRectPath(corners: any, radius: number) {
            if (!ctx) {
                return;
            }
            ctx.beginPath();
            ctx.moveTo(corners[0].x + radius, corners[0].y);
            ctx.lineTo(corners[1].x - radius, corners[1].y);
            ctx.quadraticCurveTo(corners[1].x, corners[1].y, corners[1].x, corners[1].y + radius);
            ctx.lineTo(corners[2].x, corners[2].y - radius);
            ctx.quadraticCurveTo(corners[2].x, corners[2].y, corners[2].x - radius, corners[2].y);
            ctx.lineTo(corners[3].x + radius, corners[3].y);
            ctx.quadraticCurveTo(corners[3].x, corners[3].y, corners[3].x, corners[3].y - radius);
            ctx.lineTo(corners[0].x, corners[0].y + radius);
            ctx.quadraticCurveTo(corners[0].x, corners[0].y, corners[0].x + radius, corners[0].y);
            ctx.closePath();
        }

        const card = this,
            img = new Image();

        img.src = (config.public.baseUrl || '') + '/images/' + this.imageData.image;

        const boxWidth = this.canvas.width / this.layoutOptions.width,
            boxHeight = this.canvas.height / this.layoutOptions.height,
            boxMargin = Math.max(this.canvas.width, this.canvas.height) / 100,
            cardX = boxMargin / 2 + boxWidth * this.pos.column,
            cardY = boxMargin / 2 + boxHeight * this.pos.row,
            cardWidth = boxWidth - boxMargin,
            cardHeight = boxHeight - boxMargin;

        if (!animate) {
            this.x = cardX;
            this.y = cardY;
            this.width = cardWidth;
            this.height = cardHeight;
        }

        this.setRange();

        const ctx = card.canvas.ctx;

        if (!ctx) {
            return;
        }

        const { x, y, width, height, angleX, angleY, active, gradientColor, imgOptions, radius } = card;

        let { fill } = card;

        ctx.clearRect(cardX - (boxMargin / 4), cardY - (boxMargin / 4), cardWidth + (boxMargin / 2), cardHeight + (boxMargin / 2));

        const cx = x + width / 2; // Center x
        const cy = y + height / 2; // Center y

        const corners = [
            { x: -width / 2, y: -height / 2 }, // Top-left
            { x: width / 2, y: -height / 2 },  // Top-right
            { x: width / 2, y: height / 2 },  // Bottom-right
            { x: -width / 2, y: height / 2 }  // Bottom-left
        ];

        const perspectiveCorners = corners.map(corner => {
            const dx = corner.x;
            const dy = corner.y;

            // Apply perspective transformation based on mouse angles
            const x = dx + Math.tan(angleY) * dy;
            const y = dy + Math.tan(angleX) * dx;

            return { x: cx + x, y: cy + y };
        });

        // Fill the rectangle with a color
        ctx.save();
        drawRoundedRectPath(perspectiveCorners, radius);

        if (active && gradientColor) {
            const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
            gradient.addColorStop(0, adjust(gradientColor, 75));
            gradient.addColorStop(0.5, gradientColor);
            gradient.addColorStop(1, adjust(gradientColor, 75));
            fill = gradient;
        }

        ctx.fillStyle = fill;
        ctx.fill();

        if (active && imgOptions) {
            // Map the image onto the transformed rectangle
            ctx.clip();
            ctx.drawImage(imgOptions.image, imgOptions.x, imgOptions.y, imgOptions.width, imgOptions.height);
            ctx.restore();
        }

        // Draw the rectangle outline
        ctx.save();
        drawRoundedRectPath(perspectiveCorners, radius);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.restore();

        if (!active) {
            ctx.save();
            ctx.font = `bold ${width / 100}rem Lato`;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('CS2', cx, cy);
            ctx.restore();
        }

        img.onload = function () {
            const ratio = img.naturalWidth / img.naturalHeight,
            imgWidth = Math.min(card.width, card.height),
            imgHeight = imgWidth / ratio,
            offsetLeft = (card.width - imgWidth) / 2,
            offsetTop = (card.height - imgHeight) / 2;

            card.imgOptions = {
                x: card.x + offsetLeft,
                y: card.y + offsetTop,
                width: imgWidth,
                height: imgHeight,
                image: this
            };

        }

    }
}
