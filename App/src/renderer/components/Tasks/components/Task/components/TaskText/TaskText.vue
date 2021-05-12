<template>
    <v-col
        :cols="allowSort ? 10 : 11"
        class="pa-1 pr-5"
        @click="selectRow"
    >
        <v-textarea
            :id="textareaId"
            :value="taskDescription"
            :disabled="allowSort"
            :placeholder="placeholder"
            auto-grow
            rows="1"
            @change="descriptionChanged"
            @keypress.enter.prevent="emitAddNewTask"
            @focusout="emitDeleteTask($event)"
        >
            <template v-slot:append>
                <v-btn
                    icon
                    :color="recordIconColor"
                    @click="runTimerOnItem"
                >
                    <v-icon
                        :class="recordIconAnimationClass"
                    >
                        {{ recordIcon }}
                    </v-icon>
                </v-btn>
                <v-btn
                    icon
                    @click="goToDialog"
                >
                    <v-icon
                        class="material-icons-outlined"
                    >
                        info
                    </v-icon>
                </v-btn>
            </template>
        </v-textarea>
    </v-col>
</template>

<script src="./TaskText.ts" />
