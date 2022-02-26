<template>
    <v-list-item
        :to="routeTo"
        dense
    >
        <v-list-item-content>
            {{ goal.name }}
        </v-list-item-content>
        <v-list-item-action
            @click.prevent
        >
            <goal-speed-dial
                v-if="displaySpeedDial"
                :goal="goal"
            />
        </v-list-item-action>
    </v-list-item>
</template>

<script src=./Goal.ts />
