<template>
    <v-list
        nav
    >
        <goal-add
            :mode="goalAddMode"
        />
        <v-list-item-group
            v-model="selected"
        >
            <goal
                v-for="goal in goals"
                :key="goal.id"
                :goal="goal"
            />
        </v-list-item-group>
    </v-list>
</template>

<script src=./Goals.ts />
