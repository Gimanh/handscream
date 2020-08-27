<template>
    <div>
        <v-combobox
            v-model="select"
            :items="labels"
            :label="$t('msg.selectLabel')"
            item-text="name"
            item-value="id"
            hide-selected
            multiple
            dense
            solo
            @input="inputHandler"
        >
            <template v-slot:item="{ item, on, attrs }">
                <v-list-item

                    :color="item.color"
                    :style="{height: itemHeight, backgroundColor: getBackgroundColorWithOpacity(item.color, 0.2)}"
                    v-on="on"
                >
                    <!--<v-list-item-action>
                        <v-checkbox
                            v-model="attrs.inputValue"
                            on-icon="check_box"
                            off-icon="check_box_outline_blank"
                        />
                    </v-list-item-action>-->
                    <v-list-item-action
                        class="mr-1"
                    >
                        <v-icon
                            :color="item.color"
                        >
                            label
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        {{ item.name }}
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn
                            icon
                            @click="deleteLabel(item)"
                        >
                            <v-icon>
                                close
                            </v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </template>
            <template v-slot:selection="data">
                <v-chip
                    :key="data.item.id"
                    v-bind="data.attrs"
                    :color="data.item.color"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    label
                    small
                    @click:close="data.parent.selectItem(data.item)"
                >
                    <v-icon
                        left
                        style="filter: invert(30%)"
                    >
                        label
                    </v-icon>
                    {{ data.item.name }}
                </v-chip>
            </template>

            <template
                v-if="labels.length === 0"
                v-slot:no-data
            >
                <v-list-item
                    :style="{ backgroundColor: backgroundAddItemColor }"
                >
                    <v-list-item-content
                        class="pa-0"
                    >
                        <v-row
                            class="ma-0 w100"
                        >
                            <v-col
                                cols="12"
                                class="pa-0"
                            >
                                <v-text-field
                                    v-model="newLabelName"
                                    dense
                                    full-width
                                    :label="$t('msg.addNewLabel')"
                                    @keypress.enter="addNewLabel"
                                >
                                    <template v-if="hasNewLabelNameValue" v-slot:append>
                                        <v-btn
                                            icon
                                            :color="colorAddGoal"
                                            @click="addNewLabel"
                                        >
                                            <v-icon>
                                                save
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col
                                v-if="hasNewLabelNameValue"
                                cols="12"
                                class="pa-0"
                            >
                                <v-chip
                                    v-for="color in colors"
                                    :key="color"
                                    :color="color"
                                    class="ma-1 black--text app-label-chip pr-5"
                                    style="max-width: 150px;"
                                    small
                                    label
                                    @click="selectColor(color)"
                                >
                                    <v-icon
                                        v-if="color === newLabelColor"
                                        left
                                    >
                                        label
                                    </v-icon>
                                    {{ newLabelName }}
                                </v-chip>
                                <v-btn
                                    icon
                                >
                                    <v-icon
                                        @click="regenerateColors"
                                    >
                                        refresh
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
            </template>

            <template v-else v-slot:append-item>
                <v-divider class="mt-1" />
                <v-list-item
                    :style="{ backgroundColor: backgroundAddItemColor }"
                    class="mt-1"
                >
                    <v-list-item-content
                        class="pa-0"
                    >
                        <v-row
                            class="ma-0 w100"
                        >
                            <v-col
                                cols="12"
                                class="pa-0"
                            >
                                <v-text-field
                                    v-model="newLabelName"
                                    dense
                                    full-width
                                    :label="$t('msg.addNewLabel')"
                                    @keypress.enter="addNewLabel"
                                >
                                    <template v-if="hasNewLabelNameValue" v-slot:append>
                                        <v-btn
                                            :color="colorAddGoal"
                                            icon
                                            @click="addNewLabel"
                                        >
                                            <v-icon>
                                                save
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col
                                v-if="hasNewLabelNameValue"
                                cols="12"
                                class="pa-0"
                            >
                                <v-chip
                                    v-for="color in colors"
                                    :key="color"
                                    :color="color"
                                    class="ma-1 black--text app-label-chip pr-5"
                                    style="max-width: 150px;"
                                    small
                                    label
                                    @click="selectColor(color)"
                                >
                                    <v-icon
                                        v-if="color === newLabelColor"
                                        left
                                    >
                                        label
                                    </v-icon>
                                    {{ newLabelName }}
                                </v-chip>
                                <v-btn
                                    icon
                                >
                                    <v-icon
                                        @click="regenerateColors"
                                    >
                                        refresh
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-1" />
            </template>
        </v-combobox>
    </div>
</template>

<script src="./TaskLabels.ts" />
