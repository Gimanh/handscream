<template>
    <v-card
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
                height="300"
                sort-by="id"
            >
                <template #[`item.actions`]="{ item }">
                    <v-dialog
                        v-model="dialog"
                        width="350"
                    >
                        <template #activator="{on}">
                            <v-icon
                                v-on="on"
                            >
                                mdi-restore
                            </v-icon>
                        </template>
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
                                    @click="accept(item)"
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
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script src=./TaskHistory.ts />
