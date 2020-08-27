<template>
    <v-list-item-group
        style="position: sticky; bottom: 0;"
    >
        <v-card
            :elevation="addBtnElevation - 1"
        >
            <v-list-item
                inactive
                class="inactive-add-item"
                @click="addNestedItem"
            >
                <app-go-back-btn
                    v-if="$vuetify.breakpoint.sm"
                />
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
                        <v-list-item-title>
                            {{ $t('msg.addTask') }}
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
                                :disabled="allowSort"
                                :elevation="addBtnElevation"
                                @mousedown.stop
                                @click="toggleCompleted"
                                v-on="on"
                            >
                                <v-icon
                                    class="material-icons-outlined"
                                >
                                    {{ (showCompleted ? "visibility_off" : "visibility") }}
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>
                            {{ showCompleted ? $t('msg.hideCompletedTasks') : $t('msg.showCompletedTasks') }}
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
                                @click="toggleCompleted"
                            >
                                &lt;!&ndash;                                <v-icon>more_horiz</v-icon>&ndash;&gt;
                                <v-icon>
                                    {{ (showCompleted ? "visibility_off" : "visibility") }}
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-btn
                            fab
                            small
                            :elevation="addBtnElevation"
                            @click="toggleCompleted"
                            @mousedown.stop
                        >
                            <v-icon>{{ (false ? "visibility_off" : "visibility") }}</v-icon>
                        </v-btn>
                    </v-speed-dial>-->
                </v-list-item-action>
            </v-list-item>
        </v-card>
    </v-list-item-group>
</template>

<script src="./AddNestedItem.ts" />
