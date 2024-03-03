<template>
    <v-app>
        <v-app-bar
            :clipped-left="true"
            :location="drawerDisplayMode"
            fixed
            app
            elevation="1"
        >
            <v-app-bar-nav-icon
                variant="text"
                @click.stop="appStore.setDrawer(!appStore.drawer)"
            />
            <v-spacer />
            <ToggleCompletedTasks />
        </v-app-bar>

        <v-navigation-drawer
            v-model="appStore.drawer"
            elevation="1"
            :permanent="false"
            class="pt-2"
        >
            <goal-add class="pl-4 pr-4" :style="addGoalStyles" />
            <goals />
            <UserUiUtils />
        </v-navigation-drawer>

        <v-main>
            <v-container
                fluid
                class="ma-0 pa-1 app-main-container overflow-auto"
            >
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/app.store';
import { computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import Goals from '@/components/Goals';
import { GoalAdd } from '@/components/Goals/components/GoalAdd';
import UserUiUtils from '@/components/UserUiUtils.vue';
import ToggleCompletedTasks from '@/components/Atoms/ToggleCompletedTasks.vue';

const appStore = useAppStore();
const display = useDisplay();
const isMobile = computed(() => display.sm.value || display.xs.value);

const drawerDisplayMode = computed(() => isMobile.value ? 'bottom' : 'top');

function addGoalStyles() {
    return {
        position: 'sticky',
        top: 0,
        zIndex: 1,
    };
}

onMounted(() => {
    if (isMobile.value) {
        setTimeout(() => appStore.setDrawer(true), 500);
    }
});
</script>
