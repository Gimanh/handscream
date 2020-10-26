<template>
    <div
        class="goal-nested-items"
    >
        <draggable
            v-model="sortedNestedItems"
            class="pa-0"
            v-bind="dragOptions"
        >
            <div
                v-for="item in sortedNestedItems"
                v-if="canShowItem(item)"
                :id="selectedNestedItemId === item.id ? 'goal-nested-items__selected-item' : undefined"
                :key="item.id"
                class="goal-nested-item pb-2"
            >
                <v-row
                    class="goal-nested-item__main ma-0"
                >
                    <v-col
                        cols="1"
                        class="pl-5 pa-1 goal-nested-item__checkbox pt-2"
                    >
                        <v-checkbox
                            :input-value="item.checked"
                            on-icon="check_box"
                            off-icon="check_box_outline_blank"
                            @change="checkBoxStateChanged($event, item)"
                        />
                    </v-col>

                    <v-col
                        :cols="allowSort ? 10 : 11"
                        class="pa-1 pr-5"
                        @click="rowSelected(item)"
                    >
                        <v-textarea
                            :id="'textarea-' + item.id"
                            :value="item.description"
                            rows="1"
                            auto-grow
                            :disabled="allowSort"
                            :placeholder="$t('msg.typeTask')"
                            @change="descriptionChanged($event, item)"
                            @keypress.enter.prevent="addNewTaskToList(item)"
                            @focusout="deleteEmptyItem($event, item)"
                        >
                            <template v-slot:append>
                                <v-btn
                                    icon
                                    :color="canShowAnimationForItem(item) ? 'red' : ''"
                                    @click="runTimerOnItem(item)"
                                >
                                    <v-icon
                                        :class="'material-icons-outlined ' + (canShowAnimationForItem(item) ? 'task-pulse' : '')"
                                    >
                                        {{ canShowPlay(item) ? 'radio_button_checked' : 'stop_circle' }}
                                    </v-icon>
                                </v-btn>
                                <v-btn
                                    icon
                                    @click="setSelectedNestedItem(item)"
                                >
                                    <v-icon
                                        class="material-icons-outlined"
                                    >
                                        info
                                    </v-icon>
                                </v-btn>
                            </template>
                        </v-textarea>
                        <goal-item-nested-dialog
                            v-if="selectedNestedItem !== null && item.id === selectedNestedItem.id"
                            :item="item"
                            @textChanged="textChangedDialog"
                            @deleteTask="deleteTaskDialog"
                            @commentChanged="commentChangedDialog"
                            @saveDate="saveDateDialog"
                            @close="selectedNestedItem = null"
                            @resetDate="resetDate"
                        />
                    </v-col>
                    <v-col
                        v-if="allowSort"
                        cols="1"
                        align-self="center"
                    >
                        <app-reorder-btn />
                    </v-col>
                </v-row>
                <template v-if="!allowSort && showStatsInListSettings">
                    <template>
                        <v-row
                            v-if="canShowNotActiveDateCommentRow(item)"
                            class="goal-nested-item__ui-info pr-1 ma-0"
                        >
                            <v-col cols="1" />
                            <v-col
                                cols="11"
                                class="pa-1 pr-3"
                            >
                                <span @click.stop="rowSelected(item)">
                                    <span
                                        v-if="item.item_reminder_exp_date"
                                        class="goal-nested-item__ui-info&#45;&#45;date"
                                        @click="showDateInfo"
                                    >
                                        <v-icon>
                                            today
                                        </v-icon>
                                        {{ getUiDate(item.item_reminder_exp_date) }}
                                    </span>
                                    <span
                                        class="pl-1 goal-nested-item__ui-info&#45;&#45;comment"
                                    >
                                        {{ item.item_comment_text }}
                                    </span>
                                </span>
                            </v-col>
                        </v-row>
                        <v-row
                            v-if="canShowNotActiveLabelsRow(item)"
                            class="ma-0 mt-1"
                            @click.stop="rowSelected(item)"
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
                                    v-for="label in getLabelsForItem(item)"
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
        </draggable>
        <add-nested-item
            :show-completed="showCompleted"
            @addNewNestedItem="addNewTaskToList"
            @toggleCompleted="toggleCompleted"
        />

        <app-delete-record-bottom-sheet
            :value="deleteDialog"
            @cancel="cancelDelete"
            @delete="deleteItem"
        />
    </div>
</template>

<script src="./GoalItemNested.ts" />

