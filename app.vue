<script>
    export default {
        mounted() {
            if (!localStorage.getItem('sound')) {
                localStorage.setItem('sound', true);
            }
        }
    }
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
    body {
        font-family: Lato, sans-serif;
        background-color: #141414;
        color: #fff;
    }
</style>
