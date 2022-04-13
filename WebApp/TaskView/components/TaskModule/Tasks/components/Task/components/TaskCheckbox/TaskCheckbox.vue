<template>
    <v-checkbox
        dense
        :disabled="!allowed"
        :input-value="complete"
        @change="emitChange"
        @click.prevent
    />
</template>

<script src=./TaskCheckbox.ts />
