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
            <v-card-text
                style="height: 100%;"
            >
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
