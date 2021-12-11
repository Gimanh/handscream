<template>
    <v-list
        nav
    >
        <goal-add-components />
        <v-list-item-group>
            <goal-component
                v-for="component in components"
                :key="component.id"
                :component="component"
            />
        </v-list-item-group>
    </v-list>
</template>

<script src=./GoalComponents.ts />
