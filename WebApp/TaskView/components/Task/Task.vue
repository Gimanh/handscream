<template>
    <v-list-item
        dense
    >
        <v-list-item-action>
            <task-checkbox
                :task="task.complete"
            />
        </v-list-item-action>
        <v-list-item-content>
            <task-text
                :task="task.description"
            />
        </v-list-item-content>
    </v-list-item>
</template>

<script src=./Task.ts />
