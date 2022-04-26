<template>
    <v-dialog
        v-model="dialog"
        width="450"
    >
        <v-card>
            <v-card-title>
                {{ $t( 'msg.editLabel' ) }}
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="tagName"
                    :label="$t('msg.editLabel')"
                    autofocus
                >
                    <template #append>
                        <v-icon
                            :color="color"
                        >
                            mdi-tag
                        </v-icon>
                    </template>
                </v-text-field>
                <v-row justify="center">
                    <v-icon
                        @click="toggleColors"
                    >
                        {{ showColor ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                </v-row>
                <v-row
                    v-if="showColor"
                >
                    <v-color-picker
                        v-model="color"
                        flat
                        show-swatches
                        hide-canvas
                        hide-mode-switch
                        width="100%"
                        :hide-inputs="true"
                        swatches-max-height="250"
                    />
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    text
                    @click="closeDialog"
                >
                    {{ $t( 'msg.close' ) }}
                </v-btn>
                <v-btn
                    text
                    :disabled="saveDisabled"
                    @click="updateTagHandler"
                >
                    {{ $t( 'msg.save' ) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src=./TasksTagEdit.ts />
