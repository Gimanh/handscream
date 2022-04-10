<template>
    <v-dialog
        v-model="dialog"
        scrollable
        max-width="700px"
        persistent
    >
        <template #activator="{ on: fromSlot }">
            <v-tooltip
                top
            >
                <template #activator="{ on: fromTooltip }">
                    <v-btn
                        fab
                        icon
                        v-on="{...fromSlot, ...fromTooltip}"
                    >
                        <v-icon>
                            mdi-arrow-collapse-right
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{ $t( 'msg.moveTask' ) }}</span>
            </v-tooltip>
        </template>
        <v-card>
            <v-card-title>{{ $t( 'msg.moveTask' ) }}</v-card-title>
            <v-divider />
            <v-card-text style="height: 300px;">
                <v-list
                    v-if="!canShowLists"
                >
                    <v-list-item
                        v-for="(goal, index) in goals"
                        :key="index"
                        dense
                        @click="fetchGoalList(goal.id)"
                    >
                        <v-list-item-action
                            class="ma-0 mr-2"
                        >
                            <v-icon
                                :color="goal.color"
                                class="material-icons-outlined"
                            >
                                mdi-alpha-g-circle-outline
                            </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            {{ goal.name }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list
                    v-if="canShowLists"
                >
                    <v-list-item
                        v-for="(list, index) in goalLists"
                        v-if="currentListId !== list.id"
                        :key="index"
                        dense
                        @click="moveTaskToList(list.id)"
                    >
                        <v-list-item-action
                            class="ma-0 mr-2"
                        >
                            <v-icon
                                :color="list.color"
                                class="material-icons-outlined"
                            >
                                mdi-alpha-g-circle-outline
                            </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            {{ list.name }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-btn
                    v-if="canShowLists"
                    icon
                    @click="clearLists"
                >
                    <v-icon>
                        mdi-arrow-left
                    </v-icon>
                </v-btn>
                <v-spacer />
                <v-btn
                    elevation="1"
                    @click="dialog = false"
                >
                    {{ $t( 'msg.cancel' ) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src=./ActionMoveTask.ts />
