<template>
    <div class="pa-1">
        <v-list-item dense
                     :to="routeTo">
            {{ task }}
            <v-list-item-action>
                <task-checkbox :task="task"
                               :key="checkboxKey"
                               :complete="task.complete"
                               :allowed="canEditStatus"
                               @change="statusChanged" />
            </v-list-item-action>
            <v-list-item-content class="pb-5">
                <task-text :key="descriptionKey"
                           :description="task.description"
                           :show-btn-more="!restrictedMode"
                           :allowed="canEditDescription"
                           :can-watch-details="canWatchDetails"
                           :can-delete-task="canDeleteTask"
                           @change="descriptionChanged"
                           @deleteTask="deleteThisTask"
                           @showDetails="goToDetails" />
            </v-list-item-content>
            <task-visual-info :task="task" />
        </v-list-item>
        <div v-if="canWatchSubtasks">
            <v-row v-if="canAddSubtasks"
                   class="ma-0">
                <v-col cols="1"
                       class="pa-0" />
                <v-col class="pa-0">
                    <task-add :component-id="$route.params.list"
                              :mode-subtask="true"
                              :parent-id="task.id" />
                </v-col>
            </v-row>
            <v-row v-for="subtask in task.subtasks"
                   :key="subtask.id"
                   class="ma-0">
                <v-col cols="1"
                       class="pa-0" />
                <v-col class="pa-0">
                    <task :task="subtask"
                          :subtask="true"
                          :restricted-mode="restrictedMode" />
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script src=./Task.ts />
