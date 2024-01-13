<template>
    <v-card v-bind="$attrs"
            elevation="0"
            class="tv-add-task">
        <t-text-field v-model="taskName"
                      :loading="loading"
                      :label="$t('msg.addTask')"
                      :placeholder="$t('msg.addTask')"
                      :append-inner-icon="inputIcon"
                      variant="underlined"
                      hide-details
                      @keyup.enter="addTask" />
    </v-card>
</template>

<script src="./TaskAdd.ts" lang="ts"/>
