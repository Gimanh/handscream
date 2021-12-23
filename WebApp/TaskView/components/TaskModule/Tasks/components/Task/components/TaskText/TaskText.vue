<template>
    <div>
        <v-textarea
            v-model="descriptionValue"
            dense
            hide-details
            rows="1"
            auto-grow
            :label="label"
            :append-icon="appendIcon"
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
