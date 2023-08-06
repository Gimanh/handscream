<template>
    <v-row>
        <v-col>
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
        <!--        Component GoalLists {{ $route.params.goalId }}-->
    </v-row>
</template>

<script src="./GoalLists.ts" lang="ts" />
