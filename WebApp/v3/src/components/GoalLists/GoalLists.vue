<template>
    <v-row>
        <v-col>
            <context-actions
                :actions="actions"
                :show-menu="dialogStatus"
                :activator="menuActivator"
                @menuClosed="hideMenu"
                @deleteList="showDeleteList"
                @editList="showEditList"
            />

            <form-delete
                v-model="showDeleteDialog"
                :title="deleteDialogTitle"
                :text="$t( 'msg.areYouWantDeleteRecord' )"
                @cancel="cancelDeletion"
                @ok="deleteSelectedList"
            />

            <goal-list-edit
                v-if="showEditDialog"
                v-model="showEditDialog"
                :list="selectedList"
                @cencel="cancelEditGoal"
            />

            <goal-list-add
                :goal-id="goalId"
            />
            <v-list
                lines="two"
            >
                <goal-list-item
                    v-for="list in lists"
                    :key="list.id"
                    :list="list"
                    @showActions="showActions"
                />
            </v-list>
        </v-col>
    </v-row>
</template>

<script src="./GoalLists.ts" lang="ts" />
