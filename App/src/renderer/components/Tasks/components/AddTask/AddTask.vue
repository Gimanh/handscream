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
                            {{ $t( 'msg.addTask' ) }}
                        </v-list-item-title>
                    </component>
                </v-list-item-content>
            </v-list-item>
        </v-card>
    </v-list-item-group>
</template>

<script src="./AddTask.ts" />
