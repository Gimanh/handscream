<template>
    <div>
        <v-textarea
            v-model="descriptionValue"
            :label="label"
            :disabled="!allowed"
            :append-icon="appendIcon"
            dense
            rows="1"
            auto-grow
            hide-details
            @keypress.enter.prevent="updateDescription"
            @change="updateDescription"
            @click:append="showDetails"
        />
        <task-delete-dialog
            v-if="deleteActive"
            @cancel="cancelDelete"
            @apply="deleteTask"
        />
    </div>
</template>

<script src=./TaskText.ts />
