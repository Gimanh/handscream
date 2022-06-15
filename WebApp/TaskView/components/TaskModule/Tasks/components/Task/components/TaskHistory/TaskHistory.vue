<template>
    <v-card
        v-if="task.permissions.task_can_access_history"
        elevation="1"
    >
        <v-card-subtitle>
            {{ $t( 'msg.history' ) }}
        </v-card-subtitle>
        <v-card-text>
            <v-data-table
                :headers="headers"
                :items="taskHistory.items"
                :items-per-page="10"
                item-key="historyId"
                height="300"
                sort-by="id"
            >
                <template #[`item.actions`]="{ item }">
                    <v-icon
                        v-if="!item.canNotRecovery && task.permissions.task_can_recovery_history"
                        @click="openDialogFor(item)"
                    >
                        mdi-restore
                    </v-icon>
                </template>
                <template #[`item.priority`]="{ item }">
                    <div>{{ getLabel( item ) }}</div>
                </template>
            </v-data-table>
            <v-dialog
                v-model="dialog"
                persistent
                hide-overlay
                width="350"
            >
                <v-card>
                    <v-card-subtitle>
                        {{ $t( 'task.recover' ) }}
                    </v-card-subtitle>
                    <v-card-text>
                        {{ $t( 'task.recoverState' ) }}
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            color="error"
                            text
                            @click="accept"
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
        </v-card-text>
    </v-card>
</template>

<script src=./TaskHistory.ts />
