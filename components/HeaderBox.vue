<script>
    export default {
        data() {
            return {
                soundOn() {
                    if (!localStorage) {
                        return false;
                    }
                    return JSON.parse(localStorage.getItem('sound'));
                }
            }
        },
        computed: {
            showBack() {
                return this?.$route.name !== 'index'
            }
        },
        methods: {
            handleMute() {
                localStorage.setItem('sound', !JSON.parse(localStorage.getItem('sound')));
                this.soundOn = !this.soundOn;
            }
        }
    }
</script>

<template>
    <header class='header'>
        <AppLogo />
        <div class='buttons'>
            <button
                :style="showBack ? 'opacity: 1' : 'opacity: 0'"
                @click="$router.go(-1)"
            >
                <BackIcon />
            </button>
            <button v-if="soundOn" @click="handleMute"><SoundIcon /></button>
            <button v-else @click="handleMute"><MuteIcon /></button>
            <button>
                <NuxtLink to="/stats">
                    <StatsIcon />
                </NuxtLink>
            </button>
        </div>
    </header>
</template>

<style>
    header.header {
        padding: 1rem 5%;
        display: flex;
        justify-content: space-between;
    }

    div.buttons {
        display: flex;
        gap: 5%;
    }

    div.buttons > button {
        background: inherit;
        border: none;
        cursor: pointer;
        transition: all 0.25s ease-out;
    }

    div.buttons > button:hover {
        transform: scale(1.2);
    }

    div.buttons > button > svg, div.buttons > button > a > svg {
        width: 2rem;
        height: 2rem;
        fill: #fff;
        margin: 0.5rem;
    }

    @media (orientation: portrait) {
          header.header {
                flex-direction: column;
                place-items: center;
                gap: 1rem;
          }

        div.buttons {
            justify-content: space-between;
            width: 100%;
        }
    }
</style>
