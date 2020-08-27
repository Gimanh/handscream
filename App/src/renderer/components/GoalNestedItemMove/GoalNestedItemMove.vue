<template>
    <v-dialog
        v-model="dialog"
        width="450"
        persistent
    >
        <template v-slot:activator="{ on: fromSlot }">
            <v-tooltip top>
                <template v-slot:activator="{ on: fromTooltip }">
                    <v-btn
                        icon
                        v-on="{...fromSlot, ...fromTooltip}"
                    >
                        <v-icon>
                            sync_alt
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{ $t('msg.moveTask') }}</span>
            </v-tooltip>
        </template>

        <v-card>
            <v-card-title>
                {{ $t('msg.moveTask') }}
            </v-card-title>

            <v-card-text>
                <v-list v-if="canShowGoals">
                    <v-list-item
                        v-for="(item, index) in goals"
                        :key="index"
                        dense
                        @click="selectGoalId(item.id)"
                    >
                        <v-list-item-action
                            class="ma-0 mr-2"
                        >
                            <v-icon
                                :color="item.color"
                                class="material-icons-outlined"
                            >
                                adjust
                            </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            {{ item.name }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list v-if="canShowList">
                    <v-list-item
                        v-for="(item, index) in lists"
                        v-if="canDisplayListItem(item)"
                        :key="index"
                        dense
                        @click="selectListId(item.id)"
                    >
                        <v-list-item-action
                            class="ma-0 mr-2"
                        >
                            <v-icon
                                class="material-icons-outlined"
                            >
                                check
                            </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            {{ item.name }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-btn
                    v-if="!canShowGoals"
                    icon
                    class="ml-2"
                    @click="goBackToGoals"
                >
                    <v-icon>
                        keyboard_backspace
                    </v-icon>
                </v-btn>
                <v-spacer />
                <v-btn
                    depressed
                    elevation="1"
                    @click="resetState"
                >
                    {{ $t('msg.close') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./GoalNestedItemMove.ts" />
