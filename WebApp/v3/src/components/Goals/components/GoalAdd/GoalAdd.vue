<template>
    <v-card
        v-bind="$attrs"
        elevation="0"
    >
        <t-text-field
            v-model="projectName"
            :loading="loading"
            :label="$t('msg.addTarget')"
            :placeholder="$t('msg.addTarget')"
            :append-inner-icon="inputIcon"
            variant="underlined"
            hide-details
            @keyup.enter="addGoal"
        />
    </v-card>
</template>

<script src="./GoalAdd.ts" lang="ts" />
