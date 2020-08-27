<template>
    <v-dialog
        v-model="dialog"
        :width="baseDialogWidth"
    >
        <template v-slot:activator="{ on: onDialog }">
            <div
                v-on="onDialog"
            >
                <v-card
                    :elevation="addBtnElevation - 1"
                >
                    <slot />
                </v-card>
            </div>
        </template>
        <goal-form
            v-if="dialog"
            :edit-mode="false"
            @cancelForm="close"
            @saveForm="save"
        />
    </v-dialog>
</template>

<script src="./AddGoal.ts" />
