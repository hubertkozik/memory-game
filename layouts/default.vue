<template>
    <div class='app-container'>
        <HeaderBox />
        <slot />
    </div>
</template>

<style>
    .app-container {
        height: 100svh;
        display: flex;
        flex-direction: column;
    }
</style>
