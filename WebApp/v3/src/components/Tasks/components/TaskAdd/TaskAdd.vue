<template>
    <v-card
        v-bind="$attrs"
        elevation="0"
    >
        <t-text-field
            v-model="taskName"
            :loading="loading"
            :label="$t('msg.addTarget')"
            :placeholder="$t('msg.addTarget')"
            :append-inner-icon="inputIcon"
            variant="underlined"
            hide-details
            @keyup.enter="addTask"
        />
    </v-card>
</template>

<script src="./TaskAdd.ts" lang="ts"/>
