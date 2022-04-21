<template>
    <v-dialog
        v-model="dialog"
        width="350"
    >
        <v-card>
            <v-card-title>
                {{ $t( 'task.deleteTagTitle' ) }}
            </v-card-title>
            <v-card-text>
                {{ $t( 'task.deleteTagQuestion' ) }}
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    @click="apply"
                >
                    {{ $t( 'msg.accept' ) }}
                    <v-icon
                        right
                    >
                        mdi-delete
                    </v-icon>
                </v-btn>
                <v-btn
                    @click="cancel"
                >
                    {{ $t( 'msg.cancel' ) }}
                    <v-icon
                        right
                    >
                        mdi-cancel
                    </v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src=./TagDeleteDialog.ts />
