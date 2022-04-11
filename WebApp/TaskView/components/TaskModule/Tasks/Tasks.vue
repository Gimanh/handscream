<template>
    <v-list
        nav
        dense
    >
        <!--        <v-list-group
                    :value="true"
                >
                    <template #activator>
                        <v-list-item-title>
                            {{ $t( 'task.tasks' ) }}
                        </v-list-item-title>
                    </template>-->
        <task-add
            v-if="canAddTasks"
            :component-id="componentId"
        />
        <v-list-item-group
            v-if="canWatchTasks"
            ref="list"
            v-model="selected"
            class="app-scrolled-list"
        >
            <app-progress
                :loading-active="loading"
            />
            <task
                v-for="task in tasks"
                :key="task.id"
                :task="task"
                :can-add-subtasks-in-component="canAddSubtasksInComponent(task.goalListId)"
            />
        </v-list-item-group>

        <!--        </v-list-group>-->
    </v-list>
</template>

<script src=./Tasks.ts />
