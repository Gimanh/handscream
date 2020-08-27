<template>
    <v-btn
        depressed
        icon
        small
        class="app-reorder-icon-color"
        :class="reorderHandleClass"
        @click.prevent.stop
    >
        <v-icon>
            reorder
        </v-icon>
    </v-btn>
</template>

<script src="./AppReorderBtn.ts" />
