<template>
    <v-list
        nav
        dense
    >
        <v-list-group
            :value="true"
        >
            <template #activator>
                <v-list-item-title>
                    {{ $t( 'task.tasks' ) }}
                </v-list-item-title>
            </template>
            <task-add
                :component-id="componentId"
            />
            <v-list-item-group
                v-model="selected"
            >
                <v-progress-linear
                    v-if="loading"
                    color="green"
                    indeterminate
                    absolute
                    rounded
                    height="4"
                />
                <task
                    v-for="task in tasks"
                    :key="task.id"
                    :task="task"
                />
            </v-list-item-group>

        </v-list-group>
    </v-list>
</template>

<script src=./Tasks.ts />
