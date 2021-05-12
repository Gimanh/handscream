<template>
    <div
        :id="selectedNestedItemId === item.id ? 'goal-nested-items__selected-item' : undefined"
        :key="item.id"
        class="goal-nested-item pb-2"
    >
        <v-row
            class="goal-nested-item__main ma-0"
        >
            <task-checkbox
                :item="item"
            />

            <task-text
                :item="item"
                @addNewTask="emitAddNewTaskToList"
                @deleteTask="deleteEmptyItem($event)"
            />
            <v-col
                v-if="allowSort"
                cols="1"
                align-self="center"
            >
                <app-reorder-btn />
            </v-col>
        </v-row>
        <!-- Additional information -->
        <template v-if="!allowSort && showStatsInListSettings">
            <template>
                <v-row
                    v-if="canShowNotActiveDateCommentRow()"
                    class="goal-nested-item__ui-info pr-1 ma-0"
                >
                    <v-col cols="1" />
                    <v-col
                        cols="11"
                        class="pa-1 pr-3"
                    >
                        <span>
                            <span
                                v-if="item.item_reminder_exp_date"
                                class="goal-nested-item__ui-info--date"
                            >
                                <v-icon>
                                    today
                                </v-icon>
                                {{ getUiDate( item.item_reminder_exp_date ) }}
                            </span>
                            <span
                                class="pl-1 goal-nested-item__ui-info--comment"
                            >
                                {{ item.item_comment_text }}
                            </span>
                        </span>
                    </v-col>
                </v-row>
                <v-row
                    v-if="canShowNotActiveLabelsRow()"
                    class="ma-0 mt-1"
                >
                    <v-col
                        cols="1"
                        class="pa-0"
                    />
                    <v-col
                        cols="11"
                        class="pa-0 pl-1"
                        style="display: flex;"
                    >
                        <div
                            v-for="label in getLabelsForItem()"
                            :key="label.id"
                            :style="{backgroundColor: label.color}"
                            class="mr-1 black--text"
                            style="width: 10px; height: 10px; border-radius: 1em"
                        />
                    </v-col>
                </v-row>
            </template>
        </template>
    </div>
</template>

<script src="./Task.ts" />
