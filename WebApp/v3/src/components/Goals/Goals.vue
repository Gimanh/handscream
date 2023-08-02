<template>
    <v-list
        v-model:opened="open"
        lines="two"
        density="compact"
    >
        <v-list-group
            value="goals"
        >
            <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    :title="$t( 'msg.goals' )"
                ></v-list-item>
            </template>
            <goals-item
                v-for="item in goals"
                :key="item.id"
                :goal="item"
                @showActions="showActionDialog"
            />
        </v-list-group>

        <goal-actions
            :show-menu="dialogStatus"
            :activator="menuActivator"
            :goal="selectedGoal"
            @menuClosed="hideMenu"
        />

    </v-list>
</template>

<script src="./Goals.ts" lang="ts" />
