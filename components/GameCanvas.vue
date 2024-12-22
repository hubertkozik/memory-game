<script>
    import data from '~/assets/processed_data.json';
    import { useStopwatch } from 'vue-timer-hook';

    import Card from '~/lib/Card';
    import Canvas from '~/lib/Canvas';

    function pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }

    export default {
        provide() {
            return {
                provider: this.provider,
            };
        },

        props: {
            width: {
                type: String,
                default: '0'
            },
            height: {
                type: String,
                default: '0'
            }
        },

        data() {
            return {
                provider: {
                    context: null,
                    canvas: null
                },
                layoutOptions: {
                    width: 0,
                    height: 0
                },
                images: [],
                cards: [],
                activeCards: [],
                moves: 0,
                points: 0,
                time: {
                    seconds: 0
                },
                isWin: false
            };
        },

        mounted() {
            this.good = new Audio('/sounds/good.mp3');
            this.wrong = new Audio('/sounds/wrong.mp3');
            this.victory = new Audio('/sounds/victory.mp3');

            window.addEventListener("resize", this.updateCanvas);

            const canvas = this.provider.canvas = new Canvas(this.$refs['game-canvas']);

            const { images } = this,
                layoutWidth = this.layoutOptions.width = parseInt(this.width),
                layoutHeight = this.layoutOptions.height = parseInt(this.height);

            let nums = new Set();
            while(nums.size !== (layoutWidth * layoutHeight) / 2) {
                nums.add(Math.floor(Math.random() * data.length));
            }
            nums = [...nums];

            for (let i = 0; i < nums.length; i++) {
                images.push({...data[nums[i]]}, {...data[nums[i]]});
            }

            images.sort(() => Math.random() - 0.5);

            for (let i = 0; i < layoutWidth * layoutHeight; i++) {
                const column = i % layoutWidth,
                    row = Math.floor(i / layoutWidth),
                    pos = {
                        row,
                        column
                    };

                const card = new Card(canvas, this.layoutOptions, pos, images[i]);

                card.render();

                this.cards.push(card);
            }

        },

        unmounted() {
            window.removeEventListener("resize", this.updateCanvas);
        },

        methods: {
            updateCanvas() {
                this.provider.canvas.setSize();
                this.cards.forEach(card => {
                    card.render();
                });
            },
            handleMouseUp(e) {
                const { cards } = this,
                    mouseX = e.offsetX,
                    mouseY = e.offsetY;

                if (!this.time.seconds) {
                    this.time = useStopwatch();
                }

                const clickedCard = cards.find(card => card.range.x1 <= mouseX && card.range.x2 >= mouseX && card.range.y1 <= mouseY && card.range.y2 >= mouseY);

                if (!clickedCard || this.activeCards.indexOf(clickedCard) !== -1 || clickedCard.active) {
                    return;
                }

                this.moves++;

                if (this.activeCards.length > 1) {
                    this.activeCards.forEach(card => {
                        card.toggle();
                    });
                    this.activeCards.length = 0;
                }

                clickedCard.toggle();
                this.activeCards.push(clickedCard);
                
                if (this.activeCards.length === 2 && this.activeCards[0].imageData.id === this.activeCards[1].imageData.id) {
                    this.points++;
                    if (JSON.parse(localStorage.getItem('sound'))) {    
                        this.good.play();
                    }
                    this.activeCards.length = 0;

                    if (this.points === cards.length / 2) {
                        if (JSON.parse(localStorage.getItem('sound'))) {
                            this.victory.play();
                        }

                        const currentList = JSON.parse(localStorage.getItem('stats')) || [];

                        currentList.push({
                            type: `${this.layoutOptions.width} x ${this.layoutOptions.height}`,
                            time: `${pad(this.time.hours, 2)}:${pad(this.time.minutes - 1, 2)}:${pad(this.time.seconds, 2)}`,
                            moves: this.moves
                        });

                        localStorage.setItem('stats', JSON.stringify(currentList))

                        this.isWin = true;

                        this.time.pause();
                    }
                } else if (this.activeCards.length === 2 && this.activeCards[0].imageData.id !== this.activeCards[1].imageData.id) {
                    if (JSON.parse(localStorage.getItem('sound'))) {
                        this.wrong.play();
                    }
                }
            },
            handleMouseMove(e) {
                const { cards } = this,
                    mouseX = e.offsetX,
                    mouseY = e.offsetY;

                if (!cards.length) {
                    return;
                }

                const hoveredCard = cards.find(card => card.range.x1 <= mouseX && card.range.x2 >= mouseX && card.range.y1 <= mouseY && card.range.y2 >= mouseY);

                if (hoveredCard?.isAnimating) {
                    return;
                }

                cards.forEach(card => {
                    card.setAngle(0, 0);
                });

                if (!hoveredCard) {
                    return;
                }

                const angleX = ((mouseY / (hoveredCard.y + hoveredCard.height)) - 0.5) * 0.05; // Tilt based on Y
                const angleY = ((mouseX / (hoveredCard.x + hoveredCard.width)) - 0.5) * 0.05; // Tilt based on X

                hoveredCard.setAngle(angleX, angleY);
            }
        },
    };

</script>

<template>
    <div class='wrapper'>
        <StatsBox v-bind:moves="moves" v-bind:points="points" v-bind:time="time" />
        <div class='game-container'>
            <canvas ref='game-canvas' @mouseup="handleMouseUp" @mousemove="handleMouseMove"/>
        </div>

        <div v-if="isWin" class='winPopupContainer'>
            <div class='winPopup' @click="$router.go(-1)">
                <h2>✓</h2>
                <h3>Brawo!</h3>
                <p>Kliknij w popup, aby wybrać kolejną rozrywkę :)</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .game-container {
        height: 100%;
        display: grid;
        place-items: center;
        overflow-y: hidden;
    }

    div.winPopupContainer {
        left: 0;
        top: 0;
        position: absolute;
        width: 100%;
        height: 100svh;
        background-color: rgba(0, 0, 0, 0.6);
        display: grid;
        place-items: center;
        text-align: center;
    }

    div.winPopup {
        background: #141414;
        padding: 1rem 5%;
        border-radius: 1rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

