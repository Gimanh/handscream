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
                    :ripple="false"
                    :title="$t( 'msg.goals' )"
                    density="compact"
                ></v-list-item>
            </template>
            <goals-item
                v-for="item in goals"
                :key="item.id"
                :goal="item"
                @showActions="showActionDialog"
            />
        </v-list-group>

        <context-actions
            :actions="actions"
            :show-menu="dialogStatus"
            :activator="menuActivator"
            @menuClosed="hideMenu"
            @deleteGoal="showDeleteGoal"
            @editGoal="showGoalEdit"
        />

        <form-delete
            v-model="showDeleteDialog"
            :title="deleteDialogTitle"
            :text="$t( 'msg.areYouWantDeleteRecord' )"
            @cancel="cancelDeletion"
            @ok="deleteSelectedGoal"
        />

        <goal-edit
            v-if="showGoalEditDialog"
            v-model="showGoalEditDialog"
            :goal="selectedGoal"
            @cancel="cancelEditGoal"
        />
    </v-list>
</template>

<script src="./Goals.ts" lang="ts" />
