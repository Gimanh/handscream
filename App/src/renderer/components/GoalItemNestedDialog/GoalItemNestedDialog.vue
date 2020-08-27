<template>
    <v-dialog
        :value="true"
        scrollable
        max-width="500px"
        persistent
    >
        <v-card
            v-if="item"
        >
            <v-card-title>
                <v-textarea
                    :id="'textarea-dialog' + item.id"
                    :value="item.description"
                    :label="$t('msg.task')"
                    rows="1"
                    auto-grow
                    :disabled="allowSort"
                    :placeholder="$t('msg.typeTask')"
                    @change="emitTaskChanged($event, item)"
                    @focusout="emitDeleteTask($event, item)"
                />
            </v-card-title>
            <v-card-text
                class="pt-3"
                style="height: auto;"
            >


                <v-row
                    class="goal-nested-items__info ma-0"
                >
                    <v-col
                        cols="12"
                        class="pa-0 goal-nested-item__info__comment pt-1"
                    >
                        <app-comment
                            :comment="item.item_comment_text"
                            @commentChanged="emitCommentChanged($event, item)"
                        />
                    </v-col>
                </v-row>
                <v-row
                    class="goal-nested-items__info ma-0"
                >
                    <v-col
                        cols="12"
                        class="pa-1"
                    >
                        <v-card width="100%">
                            <v-card-subtitle>
                                {{ $t('msg.deadline') }}
                            </v-card-subtitle>
                            <v-card-text>
                                <app-reminder
                                    :given-selected-date="item.item_reminder_exp_date"
                                    @saveDate="emitSaveDate($event, item)"
                                    @resetDate="emitResetDate(item)"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col
                        cols="12"
                        class="pa-1"
                    >
                        <v-card>
                            <v-card-subtitle>
                                {{ $t('msg.labels') }}
                            </v-card-subtitle>
                            <v-card-text>
                                <task-labels-chips
                                    :selected-labels="item.labels"
                                    :nested-item-id="item.id"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row
                    class="ma-0"
                >
                    <v-col
                        cols="12"
                        class="pa-1"
                    >
                        <v-card>
                            <v-card-subtitle>
                                {{ $t('msg.taskActivity') }}
                            </v-card-subtitle>
                            <v-card-text>
                                <goal-item-nested-task-time-records
                                    :item="item"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-card>
                            <v-card-subtitle>
                                {{ $t('msg.moreActions') }}
                            </v-card-subtitle>
                            <v-card-text>
                                <goal-nested-item-move
                                    :item="item"
                                    @moveComplete="emitClose"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue--text darken-1"
                    elevation="1"
                    @click="emitClose"
                >
                    {{ $t('msg.close') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./GoalItemNestedDialog.ts" />

<style>
    .i-want-delete .v-messages {
        display: none !important;
    }
</style>
