<template>
    <v-checkbox
        dense
        :disabled="!allowed"
        :input-value="complete"
        @change="emitChange"
    />
</template>

<script src=./TaskCheckbox.ts />
