<template>
    <div class="pa-1">
        <v-list-item
            dense
            :to="routeTo"
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
                    :show-btn-more="!restrictedMode"
                    @change="descriptionChanged"
                    @deleteTask="deleteThisTask"
                    @showDetails="goToDetails"
                />
            </v-list-item-content>
        </v-list-item>
        <div v-if="showSubTasks">
            <v-row class="ma-0">
                <v-col cols="1" class="pa-0" />
                <v-col class="pa-0">
                    <task-add
                        :component-id="$route.params.list"
                        :mode-subtask="true"
                        :parent-id="task.id"
                    />
                </v-col>
            </v-row>
            <v-row
                v-for="subtask in task.subtasks"
                :key="subtask.id"
                class="ma-0"
            >
                <v-col cols="1" class="pa-0" />
                <v-col class="pa-0">
                    <task
                        :task="subtask"
                        :subtask="true"
                    />
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script src=./Task.ts />
