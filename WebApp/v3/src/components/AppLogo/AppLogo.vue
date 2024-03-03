<template>
    <v-toolbar-title class="pt-2">
        <img v-if="!circleMode && $vuetify.theme.name === 'dark'"
             src="@/assets/logo_dark.svg"
             alt="Logo"
             width="140">
        <img v-else-if="!circleMode && $vuetify.theme.name === 'light'"
             src="@/assets/logo.svg"
             alt="Logo"
             width="140">
        <img v-else-if="circleMode && $vuetify.theme.name === 'light'"
             src="@/assets/logo-circle.svg"
             alt="Logo"
             width="140">
        <img v-else-if="circleMode && $vuetify.theme.name === 'dark'"
             src="@/assets/logo_dark-circle.svg"
             alt="Logo"
             width="140">
    </v-toolbar-title>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';

const { circleMode } = defineProps({
    circleMode: {
        type: Boolean as PropType<boolean>,
        default: false
    }
});

const canShowFullLogo = computed(() => {
    return
});
</script>