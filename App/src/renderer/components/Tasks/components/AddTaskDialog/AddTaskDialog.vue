<template>
    <v-dialog
        :value="true"
        scrollable
        :max-width="dialogWidth"
        persistent
    >
        <v-card>
            <v-card-title>
                {{ title }}
            </v-card-title>
            <v-card-text
                class="pt-3"
                style="height: auto;"
            >
                <app-text-area
                    :props="textAreaProps"
                    @change="textUpdated"
                />
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <app-btn
                    :props="closeBtnProps"
                    @click="goBack(1)"
                />
                <app-btn
                    :props="addBtnProps"
                    @click="addNewTask"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./AddTaskDialog.ts" />
