<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
            <v-btn
                icon
                v-on="on"
            >
                <v-icon
                    class="material-icons-outlined"
                >
                    description
                </v-icon>
            </v-btn>
        </template>
        <v-card
            v-if="dialog"
        >
            <v-toolbar
                :elevation="1"
            >
                <v-btn
                    icon
                    @click="dialog = false"
                >
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
                <v-toolbar-title>
                    {{ $t('msg.reports') }}
                </v-toolbar-title>
                <v-spacer />
            </v-toolbar>

            <v-card-text>
                <v-alert
                    v-if="fetchedResults.length === 0 && selectedDates.length > 1"
                    type="warning"
                    icon="warning"
                    dismissible
                >
                    {{ $t('rep.noTasks') }}
                    <br>
                    <template v-slot:close="{ toggle }">
                        <v-btn
                            icon
                            small
                            @click="toggle"
                        >
                            <v-icon>
                                close
                            </v-icon>
                        </v-btn>
                    </template>
                </v-alert>
                <v-row>
                    <v-col
                        cols="7"
                    >
                        <v-card>
                            <v-card-subtitle
                                class="pa-2 pl-4"
                            >
                                {{ $t('rep.firstStep') }}

                                <v-btn
                                    text
                                    disabled
                                    small
                                >
                                    {{ dateStartForUi ? $t('rep.from') : '' }}
                                    {{ dateStartForUi }}
                                    {{ dateEndForUi ? $t('rep.to') : '' }}
                                    {{ dateEndForUi }}
                                </v-btn>
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12">
                                        <v-card>
                                            <v-card-subtitle
                                                class="pa-2 pl-4"
                                            >
                                                {{ $t('rep.planing') }}
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon
                                                            class="material-icons-outlined"
                                                            color="info"
                                                            v-on="on"
                                                        >
                                                            info
                                                        </v-icon>
                                                    </template>
                                                    <div>
                                                        {{ $t('rep.exportPlanInfo') }}
                                                    </div>
                                                </v-tooltip>
                                            </v-card-subtitle>
                                            <v-card-text
                                                class="pb-0"
                                            >
                                                <v-checkbox
                                                    v-model="exportPlan"
                                                    on-icon="check_box"
                                                    off-icon="check_box_outline_blank"
                                                    :label="$t('rep.fetchWithDeadLines')"
                                                />
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card
                                            class="mb-1"
                                        >
                                            <v-card-subtitle
                                                class="pa-2 pl-4"
                                            >
                                                {{ $t('rep.selectRange') }}
                                            </v-card-subtitle>
                                            <v-card-text
                                                class="pa-1"
                                            >
                                                <v-list dense>
                                                    <v-list-item-group>
                                                        <v-list-item
                                                            v-for="(item, i) in shortcuts"
                                                            :key="i"
                                                            @click="runAction(item.handler)"
                                                        >
                                                            <v-list-item-content>
                                                                <v-list-item-title
                                                                    v-text="item.text"
                                                                />
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-list-item-group>
                                                </v-list>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col>
                                        <v-card
                                            elevation="1"
                                        >
                                            <v-date-picker
                                                v-if="showCalendar"
                                                v-model="selectedDates"
                                                :locale="$i18n.locale"
                                                range
                                                show-week
                                                width="100%"
                                                next-icon="navigate_next"
                                                prev-icon="navigate_before"
                                            />
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="5">
                        <v-card
                            elevation="1"
                        >
                            <v-card-subtitle
                                class="pa-2 pl-4"
                            >
                                {{ $t('rep.secondStep') }}
                            </v-card-subtitle>

                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <v-card>
                                            <v-card-subtitle
                                                class="pa-2 pl-4"
                                            >
                                                {{ $t('rep.columns') }}
                                            </v-card-subtitle>
                                            <v-list dense>
                                                <v-list-item-group>
                                                    <v-list-item
                                                        v-for="(item, i) in reportHeaders"
                                                        :key="i"
                                                    >
                                                        <v-list-item-action
                                                            class="mr-3"
                                                        >
                                                            <v-btn
                                                                fab
                                                                x-small
                                                                :color="item.active ? 'accent' : 'grey'"
                                                                elevation="1"
                                                                :depressed="!item.active"
                                                                @click="toggleActiveOnItem(item)"
                                                            >
                                                                <v-icon>
                                                                    check
                                                                </v-icon>
                                                            </v-btn>
                                                        </v-list-item-action>
                                                        <v-list-item-content>
                                                            <v-list-item-title
                                                                v-if="!item.edit"
                                                                :class="!item.active ? 'grey--text' : ''"
                                                                v-text="item.text"
                                                            />
                                                            <v-text-field
                                                                v-else
                                                                v-model="item.text"
                                                                dense
                                                                @blur="item.edit = false"
                                                            />
                                                        </v-list-item-content>
                                                        <v-list-item-action>
                                                            <v-btn
                                                                fab
                                                                icon
                                                                x-small
                                                                elevation="1"
                                                                :depressed="!item.active"
                                                                @click="editItem(item)"
                                                            >
                                                                <v-icon
                                                                    class="material-icons-outlined"
                                                                >
                                                                    {{ item.edit ? 'save' : 'edit'
                                                                    }}
                                                                </v-icon>
                                                            </v-btn>
                                                        </v-list-item-action>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        md="4"
                                    >
                                        <v-card>
                                            <v-card-subtitle
                                                class="pa-2"
                                            >
                                                {{ $t('msg.labels') }}

                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon
                                                            class="ml-1 material-icons-outlined"
                                                            color="info"
                                                            v-on="on"
                                                        >
                                                            info
                                                        </v-icon>
                                                    </template>
                                                    <span>
                                                        {{ $t('rep.withSelectedLabels') }}
                                                    </span>
                                                </v-tooltip>
                                            </v-card-subtitle>
                                            <v-card-text
                                                v-if="labels && labels.length > 0"
                                                class="pa-1"
                                            >
                                                <v-chip

                                                    v-for="(item, i ) in labels"
                                                    :key="i"
                                                    :color="item.color"
                                                    label
                                                    :class="'ma-1 ' + getChipClass(item.id)"
                                                    @click="toggleLable(item.id)"
                                                >
                                                    <v-icon>
                                                        label
                                                    </v-icon>
                                                    {{ item.name }}
                                                </v-chip>
                                            </v-card-text>
                                            <v-card-text v-else>
                                                {{ $t('msg.noLabelsFound') }}
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <!--<v-row>
                                    <v-col>

                                    </v-col>
                                </v-row>-->
                            </v-card-text>
                        </v-card>

                        <v-dialog
                            :value="fetchedResults.length > 0"
                            scrollable
                            persistent
                            max-width="80%"
                        >
                            <v-card>
                                <v-card-title>
                                    {{ $t('rep.report') }}

                                    <v-spacer />

                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-chip
                                                label
                                                small
                                                color="inherit"
                                                v-on="on"
                                            >
                                                <v-icon
                                                    small
                                                    class="material-icons-outlined"
                                                >
                                                    date_range
                                                </v-icon>
                                                {{ dateStartForUi }} - {{ dateEndForUi }}
                                            </v-chip>
                                        </template>
                                        <span>{{ $t('rep.selectedDates') }}</span>
                                    </v-tooltip>
                                    <v-spacer />
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn
                                                icon
                                                @click="downloadReport"
                                                v-on="on"
                                            >
                                                <v-icon
                                                    class="material-icons-outlined"
                                                >
                                                    save
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ $t('msg.saveLocal') }}</span>
                                    </v-tooltip>

                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn
                                                icon
                                                @click="closeDialog"
                                                v-on="on"
                                            >
                                                <v-icon>
                                                    close
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ $t('msg.close') }}</span>
                                    </v-tooltip>
                                </v-card-title>
                                <v-divider />
                                <v-card-text
                                    class="pa-0"
                                >
                                    <v-data-table
                                        :headers="onlyActiveHeaders"
                                        :items="fetchedResults"
                                        disable-pagination
                                        fixed-header
                                        height="400px"
                                        item-key="name"
                                        show-select
                                        class="elevation-1"
                                        hide-default-footer
                                    >
                                        <template v-slot:item.labels="{ item }">
                                            <v-chip
                                                v-for="(label, index) in item.labels"
                                                :key="index"
                                                :color="label.color"
                                                class="mr-1"
                                                label
                                                x-small
                                            >
                                                {{ label.name }}
                                            </v-chip>
                                        </template>
                                    </v-data-table>
                                </v-card-text>
                                <v-divider />
                            </v-card>
                        </v-dialog>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script src="./AppDocReport.ts" />
