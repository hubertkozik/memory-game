<script>
    export default {
        props: {
            moves: {
                type: Number,
                default: 0
            },
            points: {
                type: Number,
                default: 0
            },
            time: {
            }
        },
        methods: {
            pad(num, size) {
                num = num.toString();
                while (num.length < size) num = "0" + num;
                return num;
            }
        }
    }
</script>

<template>
    <div v-if="moves > 0" class="statsContainer">
        <div>Ruchy: {{moves}}</div>
        <div>Zdobyte punkty: {{points}}</div>
        <div>Czas gry: {{pad(time.hours, 2)}}:{{pad(time.minutes - 1, 2)}}:{{pad(time.seconds, 2)}}</div>
    </div>
    <div v-else class='start'>
        Kliknij w kartę, aby rozpocząć!
    </div>
</template>

<style>
    div.statsContainer {
        display: flex;
        justify-content: space-between;
        padding: 2rem 5%;
    }

    div.start {
        padding: 2rem 5%;
        text-align: center;
    }
</style>
