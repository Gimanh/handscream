<template>
    <v-row
        class="pa-0 user-container__goal-items-row ma-0"
    >
        <v-col
            v-if="canShowLeftColumn"
            class="pa-0 user-container__goal-items-row__col-left"
            md="4"
            sm="12"
        >
            <v-list class="pb-0 pt-0">
                <v-list-item-group v-model="listModel" dense two-line>
                    <draggable
                        v-model="sortedGoalItems"
                        v-bind="dragOptions"
                        class="w100"
                    >
                        <template v-for="(goalItem) in sortedGoalItems">
                            <goal-item
                                :key="goalItem.id"
                                :drag-enabled="dragEnabled"
                                v-bind="goalItem"
                            />
                        </template>
                    </draggable>
                    <div style="position: sticky; bottom: 0; z-index: 2;">
                        <add-goal-item>
                            <v-list-item
                                inactive
                                class="inactive-add-item"
                                :class="fab ? addListItemActiveFabClass : ''"
                            >
                                <v-list-item-avatar>
                                    <v-progress-circular
                                        :rotate="-90"
                                        :size="40"
                                        :width="5"
                                        :value="100"
                                        :color="colorAddGoal"
                                    >
                                        <v-icon>
                                            add
                                        </v-icon>
                                    </v-progress-circular>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <component :is="addListItemTitleTransition">
                                        <v-list-item-title
                                            v-if="!fab"
                                        >
                                            {{ $t( 'msg.addItem' ) }}
                                        </v-list-item-title>
                                    </component>
                                </v-list-item-content>
                            </v-list-item>
                        </add-goal-item>
                    </div>
                </v-list-item-group>
            </v-list>
        </v-col>
        <v-col
            v-if="showHintSelectComponent"
            class="user-container__goal-items-row__col-right pa-0"
            :class="showHintSelectComponent ? 'app-flex-left-in-center pl-5' : ''"
            md="8"
            sm="12"
        >
            <h3
                v-if="showHintSelectComponent"
                class="font-weight-regular"
            >
                {{ $t( 'msg.selectComponentOrCreateNew' ) }}
            </h3>
        </v-col>
        <router-view />
    </v-row>
</template>

<script src="./GoalItems.ts"></script>
