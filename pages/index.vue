<script>
    export default {
        data() {
            return {
                levels: [{
                    width: 4,
                    height: 3,
                    name: 'Początkujący'
                }, {
                    width: 4,
                    height: 4,
                    name: 'Spokojny'
                }, {
                    width: 4,
                    height: 5,
                    name: 'Łatwy'
                }, {
                    width: 5,
                    height: 6,
                    name: 'Normalny'
                }, {
                    width: 6,
                    height: 6,
                    name: 'Wyzywający'
                }, {
                    width: 8,
                    height: 8,
                    name: 'Trudny'
                }, {
                    width: 10,
                    height: 10,
                    name: 'Bardzo trudny'
                }]
            };
        }
    }
</script>

<template>
    <div class='container'>
        <div class='levels'>
            <h2>Wybierz poziom trudności gry</h2>
            <LevelBox v-for='level in levels' v-bind:level='level' />
        </div>
    </div>
    <footer>
        Realizacja - Hubert Kozik
    </footer>
</template>

<style>
    div.container {
        height: 100%;
        display: grid;
        place-items: center;
        text-align: center;
    }

    div.levels {
        width: 100%;
        display: flex;
        flex-direction: column;
        place-items: center;
        gap: 1.5rem;
    }

    footer {
        text-align: center;
        padding: 1rem 0;
    }
</style>
