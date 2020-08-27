<template>
    <v-dialog
        :value="value"
        width="450"
        persistent
    >
        <v-row class="ma-0">
            <v-col class="pa-0">
                <v-card
                    elevation="0"
                >
                    <v-card-subtitle>
                        {{ $t('msg.addNewLabel') }}
                    </v-card-subtitle>
                    <v-card-text>
                        <v-row dense>
                            <v-col
                                cols="12"
                                class="app-label-input-col"
                            >
                                <v-text-field
                                    v-model="newLabelName"
                                    :label="$t('msg.labelName')"
                                    dense
                                    autofocus
                                >
                                    <template v-slot:prepend-inner>
                                        <v-icon
                                            :color="selectedColorForLabel"
                                        >
                                            label
                                        </v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-row class="ma-0">
                                    <v-color-picker
                                        v-model="additionalColor"
                                        :class="'app-new-label ' + (showAdditionalColorInputs ? '' : 'app-new-label-close-range')"
                                        flat
                                        show-swatches
                                        hide-canvas
                                        hide-mode-switch
                                        width="100%"
                                        :hide-inputs="!showAdditionalColorInputs"
                                        swatches-max-height="250"
                                    />
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            icon
                            @click="showAdditionalColorInputs = !showAdditionalColorInputs"
                        >
                            <v-icon
                                dense
                                class="material-icons-outlined"
                            >
                                color_lens
                            </v-icon>
                        </v-btn>
                        <v-btn
                            color="blue--text darken-1"
                            elevation="1"
                            @click="close"
                        >
                            {{ $t('msg.close') }}
                        </v-btn>
                        <v-btn
                            color="blue--text darken-1"
                            elevation="1"
                            @click="saveChanges"
                        >
                            {{ hasLabelForEdit ? $t('msg.save') : $t('msg.add') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-dialog>
</template>

<script src="./AddEditLabelDialog.ts" />

<style>
    .app-label-input-col .v-text-field__details {
        display: none !important;
    }

    .app-new-label .v-color-picker__swatches > div {
        justify-content: center;
    }

    .app-new-label-close-range .v-color-picker__controls {
        display: none;
    }
</style>
