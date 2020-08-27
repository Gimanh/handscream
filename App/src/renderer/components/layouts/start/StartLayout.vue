<template>
    <v-app
        :dark="dark"
    >
        <v-app-bar app fixed clipped-left>
            <app-title />
            <app-about />
        </v-app-bar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout class="justify-center align-center">
                    <v-flex shrink>
                        <slot />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <z-footer />
    </v-app>
</template>

<script lang="ts" src="./StartLayout.ts"></script>
