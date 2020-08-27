<template>
    <v-btn
        fab
        small
        depressed
        color="app-form-warning"
        class="mr-2"
        @click.stop.prevent="goBack"
    >
        <v-icon>
            arrow_back
        </v-icon>
    </v-btn>
</template>

<script src="./AppGoBackBtn.ts" />
