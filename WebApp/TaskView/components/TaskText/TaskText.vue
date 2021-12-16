<template>
    <v-textarea
        :value="description"
        dense
        hide-details
        rows="1"
        auto-grow
        @keypress.enter.prevent="updateDescription"
        @change="updateDescription"
    />
</template>

<script src=./TaskText.ts />
