<template>
    <v-toolbar-title class="pt-2">
        <img v-if="$vuetify.theme.dark" src="@/assets/logo_dark.svg" alt="Logo" width="140">
        <img v-else src="@/assets/logo.svg" alt="Logo" width="140">
    </v-toolbar-title>
</template>

<script src="./AppTitle.ts"></script>
