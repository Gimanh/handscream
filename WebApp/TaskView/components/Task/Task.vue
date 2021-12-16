<template>
    <v-list-item
        dense
    >
        <v-list-item-action>
            <task-checkbox
                :complete="task.complete"
                @change="statusChanged"
            />
        </v-list-item-action>
        <v-list-item-content
            class="pb-5"
        >
            <task-text
                :description="task.description"
            />
        </v-list-item-content>
    </v-list-item>
</template>

<script src=./Task.ts />
