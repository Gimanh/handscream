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
                <task-text
                    :description="detailedTask.description"
                    :show-btn-more="false"
                />

                <task-note />
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
