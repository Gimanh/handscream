<template>
    <v-list
        nav
    >
        <v-list-group
            :value="true"
        >
            <template #activator>
                <v-list-item-title>{{ $t( 'goal.components' ) }}</v-list-item-title>
            </template>
            <goal-add-components />
            <v-list-item-group>
                <goal-component
                    v-for="component in components"
                    :key="component.id"
                    :component="component"
                />
            </v-list-item-group>
        </v-list-group>
    </v-list>
</template>

<script src=./GoalComponents.ts />
