<template>
    <div>
        <v-form
            v-if="inlineMode"
            ref="form"
        >
            <v-text-field
                v-model="name"
                :error="invalidName"
                :error-messages="errorMessage"
                :label="$t( 'msg.add' )"
                :placeholder="$t( 'msg.add' )"
                :append-icon="iconForInput"
                @input="inputHandler"
                @keypress.enter="add"
            />
        </v-form>
        <v-dialog
            v-else
            v-model="dialog"
            persistent
            width="400"
            max-width="600px"
        >
            <template #activator="{ on, attrs }">
                <v-btn
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                >
                    {{ $t( 'msg.addGoal' ) }}
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ $t( 'msg.goal' ) }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form
                            ref="form"
                        >
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
                    </v-container>
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
                        color="blue darken-1"
                        text
                        @click="add"
                    >
                        {{ $t( 'msg.add' ) }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src=./GoalAdd.ts />
