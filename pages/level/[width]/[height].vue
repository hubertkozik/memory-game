<script>
    export default {
        data() {
            return {
                level: {
                    width: this.$route.params.width,
                    height: this.$route.params.height
                }
            }
        }
    }
</script>

<template>
    <GameCanvas v-bind:width='level.width' v-bind:height='level.height'/>
</template>
