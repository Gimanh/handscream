<template>
    <v-list-item
        :to="routeTo"
        dense
    >
        <v-list-item-content>
            {{ component.name }}
        </v-list-item-content>
    </v-list-item>
</template>

<script src=./GoalComponent.ts />
