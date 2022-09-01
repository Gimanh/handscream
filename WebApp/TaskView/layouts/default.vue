<template>
    <v-app dark>
        <v-navigation-drawer
            v-if="isLoggedIn"
            v-model="drawer"
            :mini-variant="miniVariant"
            :clipped="clipped"
            fixed
            app
        >
            <goals
                v-if="isLoggedIn"
            />
        </v-navigation-drawer>

        <v-app-bar
            :clipped-left="clipped"
            fixed
            app
        >
            <v-app-bar-nav-icon
                v-if="isLoggedIn"
                @click.stop="drawer = !drawer"
            />
            <app-logo />
            <app-versions />
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
            <!--            <v-toolbar-title>-->
            <!--                <img v-if="$vuetify.theme.dark" src="@/assets/logo_dark.svg" alt="Logo" width="140">-->
            <!--                <img v-else src="@/assets/logo.svg" alt="Logo" width="140">-->
            <!--            </v-toolbar-title>-->
            <v-spacer />
            <app-lang />
            <logout
                v-if="isLoggedIn"
            />
        </v-app-bar>
        <v-main>
            <v-container
                fluid
                class="ma-0 pa-1 app-main-container"
            >
                <Nuxt />
            </v-container>
        </v-main>
        <v-footer
            absolute
            app
        >
            <v-spacer />
            <span>&copy; TaskView by Giman Nikolay {{ new Date().getFullYear() }}</span>
            <v-spacer />
        </v-footer>
    </v-app>
</template>
<script src="./Default.ts" />
