<template>
    <v-dialog
        v-model="dialog"
        width="350"
    >
        <v-card>
            <v-card-title>
                {{ $t( 'task.deleteTitle' ) }}
            </v-card-title>
            <v-card-text>
                {{ $t( 'task.deleteQuestion' ) }}
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="error"
                    text
                    @click="apply"
                >
                    {{ $t( 'msg.accept' ) }}
                </v-btn>
                <v-btn
                    text
                    @click="cancel"
                >
                    {{ $t( 'msg.cancel' ) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src=./TaskDeleteDialog.ts />
