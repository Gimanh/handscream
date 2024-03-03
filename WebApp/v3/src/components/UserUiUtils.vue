<template>
    <v-list v-model:opened="open"
            lines="one"
            density="compact">
        <!-- <v-list-group value="ui-utils">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props"
                             :ripple="false"
                             :title="'Ui utils'"
                             density="compact" />
            </template>

            

        </v-list-group> -->
        <v-list-subheader>{{ $t('msg.settings') }}</v-list-subheader>

        <AppLang>
            <template #activator="{ props }">
                <v-list-item v-bind="props"
                             title="Lang">
                    <template #prepend>
                        <v-icon>
                            {{ mdiWeb }}
                        </v-icon>
                    </template>
                </v-list-item>
            </template>
        </AppLang>
        <!-- <AppLogout></AppLogout> -->
        <v-list-item title="Log out"
                     @click="logoutFromApp">
            <template #prepend>
                <v-icon>
                    {{ mdiExitToApp }}
                </v-icon>
            </template>
        </v-list-item>
        <v-list-item title="Theme"
                     @click="toggleTheme">
            <template #prepend>
                <v-icon>
                    {{ mdiInvertColors }}
                </v-icon>
            </template>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { mdiWeb, mdiExitToApp, mdiInvertColors } from '@mdi/js';
import { logout } from '@/composition/useLogout';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify'

const router = useRouter();
const theme = useTheme();
const AppLang = defineAsyncComponent(() =>
    import('@/components/AppLang')
);
const open = ref<string[]>(['ui-utils']);
const toggleTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';

async function logoutFromApp() {
    await logout();
    await router.push('/');
}
</script>