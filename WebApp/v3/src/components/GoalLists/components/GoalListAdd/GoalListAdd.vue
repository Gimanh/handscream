<template>
    <v-card
        v-bind="$attrs"
        elevation="0"
    >
        <t-text-field
            v-model="listName"
            :loading="loading"
            :label="$t('msg.addTarget')"
            :placeholder="$t('msg.addTarget')"
            :append-inner-icon="inputIcon"
            variant="underlined"
            hide-details
            @keyup.enter="addList"
        />
    </v-card>
</template>

<script src="./GoalListAdd.ts" lang="ts"/>
