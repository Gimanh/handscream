<template>
    <v-dialog
        v-model="dialog"
        width="500"
        persistent
        scrollable
    >
        <v-card>
            <v-toolbar>
                <v-toolbar-title>
                    {{ $t( 'task.task' ) }}
                </v-toolbar-title>
                <v-spacer />
                <v-btn
                    v-bind="closeBtnParams"
                    @click="goBack"
                >
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <app-progress
                :class="loading ? 'ma-5' : ''"
                :loading-active="loading"
            />
            <v-card-text
                v-if="!loading"
                style="height: 100%;"
                class="pt-4"
            >
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <task
                            :task="detailedTask"
                            :restricted-mode="true"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <task-note
                            :note="detailedTask.note"
                            :task-id="detailedTask.id"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <task-deadline
                            :deadline="detailedTask.deadline"
                            :task-id="detailedTask.id"
                            :can-edit="canEditDeadline"
                        />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script src=./TaskDetails.ts />
