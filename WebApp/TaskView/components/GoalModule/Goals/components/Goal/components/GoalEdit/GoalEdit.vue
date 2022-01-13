<template>
    <div
        style="transition-delay: 0.15s;"
    >
        <v-dialog
            v-model="dialog"
            width="400"
            persistent
        >
            <!--            <template #activator="{ on }">
                            <div
                                style="transition-delay: 0.15s;"
                            >
                                <v-btn
                                    fab
                                    small
                                    color="green"
                                    v-on="on"
                                >
                                    <v-icon>
                                        mdi-pencil-outline
                                    </v-icon>
                                </v-btn>
                            </div>
                        </template>-->
            <v-card>
                <v-card-title>
                    {{ $t( 'msg.editing' ) }}
                </v-card-title>
                <v-card-text>
                    <v-form
                        ref="form"
                        v-model="valid"
                    >
                        <v-alert
                            v-if="showWarning"
                            type="warning"
                        >
                            {{ $t( 'goal.canNotUpdate' ) }}
                        </v-alert>
                        <v-row>
                            <v-col
                                cols="12"
                            >
                                <v-text-field
                                    v-model="name"
                                    :label="$t('msg.goalName')+'*'"
                                    :rules="checkGoalName"
                                    required
                                />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="description"
                                    rows="2"
                                    auto-grow
                                    :label="$t('msg.goalDescription')"
                                />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="cancel"
                    >
                        {{ $t( 'msg.cancel' ) }}
                    </v-btn>
                    <v-btn
                        :disabled="!valid"
                        color="blue darken-1"
                        text
                        @click="update"
                    >
                        {{ $t( 'msg.update' ) }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src=./GoalEdit.ts />
