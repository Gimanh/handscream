<template>
    <div>
        <v-row>
            <v-col>
                <v-dialog
                    v-model="dialog"
                    persistent
                    width="600px"
                >
                    <template #activator="{ on, attrs }">
                        <v-text-field
                            :value="fullDeadline"
                            :label="$t('task.deadline')"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        />
                    </template>
                    <v-card>
                        <v-card-title>
                            {{ $t( 'task.deadline' ) }} {{ fullDeadline }}
                        </v-card-title>
                        <v-card-text class="pa-5">
                            <v-alert
                                v-if="showWarning"
                                type="warning"
                            >
                                {{ $t( 'task.updateDeadlineFailed' ) }}
                            </v-alert>
                            <v-row justify="space-around">
                                <v-date-picker
                                    v-model="date"
                                    type="date"
                                    scrollable
                                    show-current
                                    @change="dateChanged"
                                />
                                <v-time-picker
                                    v-model="time"
                                    :disabled="isTimeDisabled"
                                    scrollable
                                    format="24hr"
                                    @change="dateChanged"
                                />
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                :disabled="saveDisabled"
                                @click="save"
                            >
                                {{ $t( 'msg.save' ) }}
                            </v-btn>
                            <v-btn
                                @click="cancel"
                            >
                                {{ $t( 'msg.cancel' ) }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </div>
</template>

<script src=./TaskDeadline.ts />
