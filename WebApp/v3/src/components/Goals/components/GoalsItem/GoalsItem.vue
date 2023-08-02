<template>
    <v-list-item
        lines="two"
        :value="goal"
        :ripple="false"
    >
        <v-list-item-title>
            {{ goal.name }}
        </v-list-item-title>
        <template #append>
            <tv-btn
                icon
                :size="'x-small'"
                @click.stop="showActionDialog($event)"
            >
                <v-icon>
                    {{ mdiDotsVertical }}
                </v-icon>
            </tv-btn>
        </template>
    </v-list-item>
</template>

<script src="./GoalsItem.ts" lang="ts" />
