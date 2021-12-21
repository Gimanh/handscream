<template>
    <div>
        <v-textarea
            v-model="descriptionValue"
            dense
            hide-details
            rows="1"
            auto-grow
            @keypress.enter.prevent="updateDescription"
            @change="updateDescription"
        />
        <task-delete-dialog
            v-if="deleteActive"
            @cancel="cancelDelete"
            @apply="deleteTask"
        />
    </div>
</template>

<script src=./TaskText.ts />
