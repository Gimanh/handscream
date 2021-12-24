<template>
    <v-textarea
        v-model="noteModel"
        :label="$t('msg.note')"
        :error-messages="errorMessage"
        :hide-details="hideDetails"
        rows="1"
        auto-grow
        dense
        :append-icon="sendUpdateAgain"
        @change="updateNote"
        @click:append="updateNote"
        @keypress.enter.prevent
    />
</template>

<script src=./TaskNote.ts />
