<template>
    <v-app dark>
        <v-navigation-drawer
            v-model="drawer"
            :mini-variant="miniVariant"
            :clipped="clipped"
            fixed
            app
        >
            <goals />
        </v-navigation-drawer>

        <v-app-bar
            :clipped-left="clipped"
            fixed
            app
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <!--            <v-btn
                            icon
                            @click.stop="miniVariant = !miniVariant"
                        >
                            <v-icon>mdi-{{ `chevron-${ miniVariant ? 'right' : 'left' }` }}</v-icon>
                        </v-btn>-->
            <!--            <v-btn
                            icon
                            @click.stop="clipped = !clipped"
                        >
                            <v-icon>mdi-application</v-icon>
                        </v-btn>-->
            <v-toolbar-title>
                <img v-if="$vuetify.theme.dark" src="@/assets/logo_dark.svg" alt="Logo" width="140">
                <img v-else src="@/assets/logo.svg" alt="Logo" width="140">
            </v-toolbar-title>
        </v-app-bar>
        <v-main>
            <v-container
                style="height: calc(100vh - 100px);"
                class="ma-0 pa-1"
            >
                <Nuxt />
            </v-container>
        </v-main>
        <v-footer
            absolute
            app
        >
            <v-spacer />
            <span>&copy; TaskView by Giman Nikoay {{ new Date().getFullYear() }}</span>
            <v-spacer />
        </v-footer>
    </v-app>
</template>
<script src="./Default.ts" />
