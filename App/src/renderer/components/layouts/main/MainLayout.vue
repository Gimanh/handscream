<template>
    <v-app id="inspire">
        <v-app-bar app fixed clipped-left>
            <v-app-bar-nav-icon
                v-if="showMenuIcon"
                @click="drawer = !drawer"
            >
                <v-icon>
                    menu
                </v-icon>
            </v-app-bar-nav-icon>
            <app-title />
            <app-about />
            <v-spacer />

            <app-doc-report />

            <app-settings />

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                        v-if="activeDatabase"
                        icon
                        :class="allowSort ? 'app-reorder-icon-color' : '' "
                        @click="setAllowSort(!allowSort)"
                        v-on="on"
                    >
                        <v-icon>
                            reorder
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{ $t('msg.reorderItems') }}</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="toggleTheme">
                        <v-icon>
                            invert_colors
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{ $t( dark ? 'msg.themeLight' :'msg.themeDark') }}</span>
            </v-tooltip>
            <i-18-lang />
            <database />
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            app
            clipped
            left
        >
            <goals
                v-if="activeDatabase"
            />
        </v-navigation-drawer>
        <slot />
    </v-app>
</template>

<script lang="ts" src="./MainLayout.ts"></script>
