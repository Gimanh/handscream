<template>
    <v-list-item-group
        v-model="listModel"
        dense
        two-line
    >
        <draggable
            v-model="sortedGoals"
            class="pa-0"
            v-bind="dragOptions"
        >
            <template
                v-for="card in sortedGoals"
            >
                <v-list-item
                    v-if="canShowGoal(card)"
                    :key="card.id"
                    class="pr-0 pl-1"
                    :class="Number( $route.params.id ) !== Number( card.id ) ? 'pl-4':'' "
                    :to="{ name: 'goal-id', params: { id: card.id } }"
                    :style="getStyleBorderForGoal(card)"
                >
                    <v-list-item-avatar>
                        <v-progress-circular
                            :rotate="-90"
                            :size="40"
                            :width="5"
                            :value="card.progress"
                            :color="card.color"
                        >
                            <v-carousel-transition>
                                <span v-if="card.progress < 100">
                                    {{ card.progress }}
                                </span>
                                <v-icon
                                    v-else
                                    :color="completeGoalIconColor"
                                >
                                    adjust
                                </v-icon>
                            </v-carousel-transition>
                        </v-progress-circular>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title
                            :class="showArchive && card.archive ? archivedGoalsClass : ''"
                        >
                            {{ card.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                            :class="showArchive && card.archive ? archivedGoalsClass : ''"
                        >
                            {{ card.description }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <goal-item-more-actions
                            v-if="!allowSort"
                            :id="card.id"
                            :archive="card.archive"
                            @delete="deleteGoal($event, card)"
                            @edit="editGoal($event, card)"
                            @archiveGoal="archiveGoal"
                        />
                        <app-reorder-btn
                            v-else
                        />
                    </v-list-item-action>
                </v-list-item>
            </template>
        </draggable>

        <div style="position: sticky; bottom: 0;">
            <add-goal>
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
                                {{ $t('msg.addGoal') }}
                            </v-list-item-title>
                        </component>
                    </v-list-item-content>
                    <v-list-item-action
                        @click.stop
                        @mousedown.prevent
                    >
                        <v-tooltip
                            top
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    fab
                                    small
                                    :elevation="addBtnElevation"
                                    @mousedown.stop
                                    @click="toggleArchived"
                                    v-on="on"
                                >
                                    <v-icon
                                        class="material-icons-outlined"
                                    >
                                        {{ (showArchive ? "visibility_off" : "visibility") }}
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>
                                {{ showArchive ? $t('msg.hideArchived') : $t('msg.showArchived') }}
                            </span>
                        </v-tooltip>
                        <!--<v-speed-dial
                            v-model="fab"
                            :direction="'left'"
                            :transition="addBtnTransition"
                        >
                            <template v-slot:activator>
                                <v-btn
                                    fab
                                    small
                                    color="grey lighten-2"
                                    :elevation="addBtnElevation"
                                    @mousedown.stop
                                >
                                    <v-icon>more_horiz</v-icon>
                                </v-btn>
                            </template>
                            <v-btn
                                fab
                                small
                                :elevation="addBtnElevation"
                                @mousedown.stop
                            >
                                <v-icon>{{ (false ? "visibility_off" : "visibility") }}</v-icon>
                            </v-btn>
                        </v-speed-dial>-->
                    </v-list-item-action>
                </v-list-item>
            </add-goal>
        </div>


        <edit-goal
            v-if="editingGoal"
            :goal="editingGoal"
            @editingEnd="editingEnd"
        />
    </v-list-item-group>
</template>

<script src="./Goals.ts"></script>
