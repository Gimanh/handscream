<template>
    <div>
        <v-navigation-drawer
            v-model="appStore.drawer"

            elevation="1"
            permanent
        >
            <goals />
        </v-navigation-drawer>
        <RouterView />
    </div>
</template>

<script src="./UserPage.ts" />
