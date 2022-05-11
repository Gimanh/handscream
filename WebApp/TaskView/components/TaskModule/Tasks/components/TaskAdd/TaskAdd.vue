<template>
    <v-card
        :elevation="showMoreFiltersPanel ? 1 : 0"
    >
        <v-card-text class="pa-0 pl-3">
            <v-row
                no-gutters
                style="position: relative"
            >
                <v-col
                    v-if="!showMoreFiltersPanel"
                    :cols="modeSubtask ? 12 : 11"
                    :style="colStyle"
                >
                    <!--TODO display component for add or search or other components-->
                    <v-form
                        ref="form"
                        @submit.prevent
                    >
                        <v-text-field
                            v-model="taskName"
                            :error="invalidName"
                            :error-messages="errorMessage"
                            :label="label"
                            :placeholder="label"
                            :append-icon="iconForInput"
                            @input="inputHandler"
                            @keypress.enter="add"
                        />
                    </v-form>
                </v-col>
                <v-col
                    v-if="!modeSubtask && showMoreFiltersPanel"
                    :style="{...colStyle, ...{display: 'flex', 'align-items': 'center', 'justify-content': 'end'}}"
                    align-self="center"
                >
                    <tasks-filters
                        @showCompleted="showCompletedTasks"
                    />
                    <v-btn
                        icon
                        fab
                        small
                    >
                        <v-icon>
                            mdi-magnify
                        </v-icon>
                    </v-btn>
                </v-col>
                <v-col
                    v-if="!modeSubtask"
                    cols="1"
                    align-self="center"
                    style="display:flex; justify-content: center;"
                >
                    <!--                <tasks-filters
                                        @showCompleted="showCompletedTasks"
                                    />-->
                    <v-btn
                        icon
                        fab
                        small
                        @click="showMoreFiltersPanel = !showMoreFiltersPanel"
                    >
                        <v-icon>
                            {{ showMoreFiltersPanel ? 'mdi-chevron-triple-right' : 'mdi-chevron-triple-left' }}
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script src=./TaskAdd.ts />
