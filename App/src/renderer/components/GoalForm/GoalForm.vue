<template>
    <v-card
        class="app-form"
    >
        <v-card-title>
            <span class="headline">{{ $t('msg.goal') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-form ref="form">
                    <v-row>
                        <v-col
                            cols="10"
                            class="pa-0"
                        >
                            <v-text-field
                                ref="nameField"
                                v-model="name"
                                :label="$t('msg.goalName')+'*'"
                                required
                                :rules="nameRules"
                            />
                        </v-col>
                        <v-col
                            cols="2"
                            class="pa-0"
                            style="display: flex; align-items: center; justify-content: center;"
                        >
                            <v-btn
                                :color="color"
                                icon
                                @click="generateColors"
                            >
                                <v-icon
                                    class="material-icons-outlined"
                                >
                                    color_lens
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            class="pa-1"
                        >
                            <v-btn
                                v-for="item in colorItems"
                                :key="item"
                                :color="item"
                                :depressed="item !== color"
                                fab
                                class="mr-1"
                                x-small
                                elevation="1"
                                @click="selectedColor(item)"
                            >
                                <v-icon
                                    v-if="color === item"
                                    :color="color === item ? '#000' : item"
                                    class="material-icons-outlined"
                                >
                                    check
                                </v-icon>
                            </v-btn>
                            <v-btn
                                elevation="1"
                                fab
                                class="mr-1 black--text"
                                x-small
                                @click="generateColors"
                            >
                                <v-icon>
                                    sync
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            class="pa-0"
                        >
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
            <small>*{{ $t('msg.requiredField') }}</small>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn
                color="blue--text darken-1"
                elevation="1"
                @click="close"
            >
                {{ $t('msg.cancel') }}
            </v-btn>
            <v-btn
                color="blue--text darken-1"
                elevation="1"
                @click="save"
            >
                {{ editMode ? $t('msg.save') : $t('msg.add') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script src="./GoalForm.ts" />
