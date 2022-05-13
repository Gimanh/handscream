<template>
    <v-row no-gutters>
        <v-col>
            <task-add
                v-if="canAddTasks"
                :component-id="componentId"
                @showCompleted="showCompletedTasks"
            />
        </v-col>
    </v-row>
</template>

<script src=./TasksToolbar.ts />
