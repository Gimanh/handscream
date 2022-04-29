<template>
    <div>
        <v-row
            no-gutters
        >
            <v-col
                :cols="modeSubtask ? 12 : 11"
                style="height: 70px;"
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
                v-if="!modeSubtask"
                cols="1"
                align-self="center"
                style="display:flex; justify-content: center;"
            >
                <tasks-filters
                    @showCompleted="showCompletedTasks"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script src=./TaskAdd.ts />
