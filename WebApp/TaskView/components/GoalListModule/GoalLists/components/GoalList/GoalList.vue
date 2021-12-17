<template>
    <v-list-item
        :to="routeTo"
        dense
    >
        <v-list-item-content>
            {{ component.name }}
        </v-list-item-content>
        <v-list-item-action>
            <goal-list-speed-dial
                :list="component"
            />
        </v-list-item-action>
    </v-list-item>
</template>

<script src=./GoalList.ts />
