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
                <v-btn v-bind="closeBtnParams">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <app-progress
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
                        <task-text
                            :description="detailedTask.description"
                            :show-btn-more="false"
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
                        <task-deadline />
                    </v-col>
                </v-row>


                <h1>
                    {{ detailedTask }}
                    Component TaskDetails {{ $route.params.task }}
                </h1>
            </v-card-text>
            <v-card-actions>

            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src=./TaskDetails.ts />
