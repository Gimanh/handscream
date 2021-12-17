<template>
    <v-list-item
        :to="routeTo"
        dense
    >
        <v-list-item-content>
            {{ list.name }}
        </v-list-item-content>
        <v-list-item-action>
            <goal-list-speed-dial
                :list="list"
            />
        </v-list-item-action>
    </v-list-item>
</template>

<script src=./GoalList.ts />
