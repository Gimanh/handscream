<template>
    <v-dialog
        v-model="dialog"
        :width="baseDialogWidth"
    >
        <goal-form
            :goal="goal"
            :edit-mode="true"
            @cancelForm="close"
            @saveForm="update"
        />
    </v-dialog>
</template>

<script src="./EditGoal.ts" />
