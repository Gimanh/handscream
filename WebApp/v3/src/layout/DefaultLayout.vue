<template>
    <v-app>
        <v-app-bar
            :clipped-left="true"
            fixed
            app
        >
            <div>
                <app-logo />
            </div>
            <v-spacer />
            <div>
                <v-btn
                    fab
                    icon
                    @click="toggleTheme"
                >
                    <v-icon>
                        {{ mdiInvertColors }}
                    </v-icon>
                </v-btn>
            </div>
            <div class="app-lang">
                <app-lang />
            </div>
            <div>
                <app-logout
                    v-if="isLoggedIn"
                />
            </div>
            <div>
                <v-btn
                    v-if="!isLoggedIn"
                    text
                    @click="goToLoginPage"
                >
                    {{ $t( 'msg.login' ) }}
                </v-btn>
            </div>
        </v-app-bar>
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
<script src="./DefaultLayout.ts" />
