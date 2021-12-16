<template>
    <v-list
        nav
        dense
    >
        <v-list-group
            :value="showGroup"
        >
            <template #activator>
                <v-list-item-title>{{ $t( 'msg.goals' ) }}</v-list-item-title>
            </template>
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
        </v-list-group>
    </v-list>
</template>

<script src=./Goals.ts />
