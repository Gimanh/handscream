<template>
    <v-app dark>
        <v-app-bar
            clipped-left
            fixed
            app
        >
            <v-toolbar-title>
                <img v-if="$vuetify.theme.dark" src="@/assets/logo_dark.svg" alt="Logo" width="140">
                <img v-else src="@/assets/logo.svg" alt="Logo" width="140">
            </v-toolbar-title>
        </v-app-bar>
        <v-main>
            <v-container
                style="height: 100%"
            >
                <Nuxt />
            </v-container>
        </v-main>
        <v-footer
            absolute
            app
        >
            <span>&copy; TaskView by Giman Nikoay {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>
