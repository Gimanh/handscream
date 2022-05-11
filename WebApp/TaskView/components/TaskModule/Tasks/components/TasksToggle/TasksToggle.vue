<template>
    <v-btn
        icon
        fab
        small
        @click="showCompletedTasks"
    >
        <v-icon>
            {{ filterIcon }}
        </v-icon>
    </v-btn>
</template>

<script src=./TasksToggle.ts />
