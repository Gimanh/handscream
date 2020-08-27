<template>
    <v-dialog
        v-model="dialog"
        persistent
        :width="baseDialogWidth"
    >
        <template v-slot:activator="{ on: onDialog }">
            <div
                v-on="onDialog"
            >
                <v-card
                    :elevation="addBtnElevation - 1"
                >
                    <slot />
                </v-card>
            </div>
        </template>
        <v-card
            class="app-form"
        >
            <v-card-title>{{ $t('msg.addItem') }}</v-card-title>
            <v-card-text>
                <!--<v-row
                    style="height: 100px;"
                >
                    <v-col class="pl-0 pr-0">
                        <v-btn
                            depressed
                            x-large
                            class="fill-all-space"
                            @click="selectComponent('list')"
                        >
                            <v-icon
                                left
                                x-large
                                :color="selectedComponent === 'list' ? 'success' : ''"
                            >
                                check
                            </v-icon>
                            {{ $t('msg.list') }}
                        </v-btn>
                    </v-col>
                </v-row>-->
                <v-row
                    v-if="dialog"
                >
                    <v-col class="pr-0 pl-0">
                        <v-form
                            v-model="valid"
                        >
                            <v-text-field
                                ref="nameField"
                                v-model="name"
                                :rules="nameRules"
                                :label="$t('msg.goalName')+'*'"
                                required
                            />

                            <v-textarea
                                v-model="description"
                                rows="1"
                                auto-grow
                                :rules="descriptionRules"
                                :label="$t('msg.description')"
                            />
                        </v-form>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue--text darken-1"
                    elevation="1"
                    @click="cancel"
                >
                    {{ $t('msg.cancel') }}
                </v-btn>
                <v-btn
                    color="blue--text darken-1"
                    elevation="1"
                    :disabled="!valid"
                    @click="addComponent"
                >
                    {{ $t('msg.add') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./AddGoalItem.ts" />
