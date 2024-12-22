<script>
    export default {
        computed: {
            getList() {
                return JSON.parse(localStorage.getItem('stats'));
            }
        }
    }
</script>

<template>
    <div class='fullStatsContainer'>
        <h2>Twoje statystyki</h2>
        <table class='statsTable'>
            <thead>
                <tr>
                    <td>No.</td>
                    <td>Typ rozgrywki</td>
                    <td>Czas gry</td>
                </tr>
            </thead>
            <tr v-for="(item, i) in getList" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.time }}</td>
            </tr>
        </table>
    </div>
</template>

<style>
    div.fullStatsContainer {
        display: flex;
        flex-direction: column;
        place-items: center;
    }

    table.statsTable {
        width: 100%;
        text-align: center;
        margin-bottom: auto;
    }

    table.statsTable td {
        padding: 1rem 0;
    }

    table>*:nth-child(odd) {
        background-color: #ebebeb;
        color: black;
    }
</style>
