<template>
    <v-card
        elevation="1"
        style="position: sticky; top:0; z-index: 1;"
    >
        <v-card-text
            class="pa-0"
        >
            <v-row
                class="ma-0"
            >
                <v-col
                    class="pb-0 pt-0"
                >
                    <app-switch
                        :label-active="labelActive"
                        :label-passive="labelPassive"
                        v-on="$listeners"
                    />
                </v-col>
                <v-col>
                    <sort-tasks
                        v-on="$listeners"
                    />
                </v-col>
                <v-col
                    class="pb-0 pt-0"
                    align-self="center"
                >
                    <v-text-field
                        prepend-inner-icon="search"
                        filled
                        rounded
                        dense
                        hide-details
                        clearable
                        @input="searchTask"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script src="./AdditionalPanel.ts" />
