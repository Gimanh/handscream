<template>
    <v-list-item
        :to="{
            name: 'nested-components',
            params: {
                nestedId: id.toString()
            }
        }"
    >
        <v-list-item-action
            v-if="showStatsInListSettings"
            class="ma-0 mr-3"
        >
            <v-progress-circular
                :value="stat"
                size="30"
                width="2"
                :color="progressColor"
            >
                <span
                    v-if="stat < 100"
                    style="font-size: 12px"
                >
                    {{ stat }}
                </span>
                <v-icon
                    v-else
                    small
                    :color="progressColor"
                >
                    check
                </v-icon>
            </v-progress-circular>
        </v-list-item-action>
        <v-list-item-content>
            <v-list-item-title>
                {{ name }}
            </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
            <v-menu
                v-if="!allowSort"
                transition="slide-y-transition"
            >
                <template v-slot:activator="{ on: onMenu }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                            <v-btn
                                icon
                                v-on="{ ...onMenu, ...onTooltip }"
                                @click.stop
                            >
                                <v-icon>
                                    more_horiz
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t('msg.moreActions') }}</span>
                    </v-tooltip>
                </template>
                <v-list>
                    <v-list-item
                        @click="openEditDialog"
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ $t('msg.edit') }}
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-icon
                                right
                                class="material-icons-outlined"
                            >
                                edit
                            </v-icon>
                        </v-list-item-action>
                    </v-list-item>
                    <v-list-item
                        class="red darken-2"
                        @click="deleteDialog = true"
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ $t('msg.delete') }}
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-icon
                                right
                                class="material-icons-outlined"
                            >
                                delete
                            </v-icon>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-menu>
            <app-reorder-btn
                v-else
            />
            <app-delete-record-bottom-sheet
                :value="deleteDialog"
                @cancel="deleteDialog = false"
                @delete="deleteItem"
            />
            <!--<v-bottom-sheet
                v-model="deleteDialog"
                inset
                persistent
            >
                <v-sheet
                    class="text-center app-form"
                    height="100px"
                >
                    <v-icon color="red">
                        warning
                    </v-icon>
                    <h4>
                        {{ $t('msg.areYouWantDeleteRecord') }}
                    </h4>
                    <v-btn
                        class="app-form-submit-btn"
                        depressed
                        @click="deleteDialog = false"
                    >
                        {{ $t('msg.cancel') }}
                    </v-btn>
                    <v-btn
                        class="app-form-cancel-btn"
                        depressed
                        @click="deleteItem"
                    >
                        {{ $t('msg.agree') }}
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>-->
            <v-divider />
        </v-list-item-action>
        <v-dialog
            v-model="editNameDialog"
            width="500"
        >
            <v-card>
                <v-card-title>{{ $t('msg.itemNameEditing') }}</v-card-title>
                <v-divider />
                <v-card-text style="height: 100px;">
                    <v-text-field
                        v-model="newName"
                        :value="name"
                    />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="blue--text darken-1"
                        elevation="1"
                        @click="cancelEditing"
                    >
                        {{ $t('msg.cancel') }}
                    </v-btn>
                    <v-btn
                        color="blue--text darken-1"
                        elevation="1"
                        :disabled="disabledSaveBtn"
                        @click="updateName"
                    >
                        {{ $t('msg.save') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-list-item>
</template>

<script src="./GoalItem.ts"></script>
