<template>
    <v-card v-bind="$attrs"
            elevation="0"
            class="tv-add-list">
        <t-text-field v-model="listName"
                      :loading="loading"
                      :label="$t('msg.addList')"
                      :placeholder="$t('msg.addList')"
                      :append-inner-icon="inputIcon"
                      variant="underlined"
                      hide-details
                      @keyup.enter="addList" />
    </v-card>
</template>

<script src="./GoalListAdd.ts" lang="ts"/>
