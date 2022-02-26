<template>
    <div>
        <goal-edit
            v-if="activeEdit"
            :goal="goal"
            @close="closeEdit"
        />
        <v-speed-dial
            v-model="fab"
            :left="false"
            direction="left"
            transition="slide-x-reverse-transition"
        >
            <template #activator>
                <v-btn
                    v-model="fab"
                    color="blue darken-2"
                    dark
                    fab
                    icon
                    small
                >
                    <v-icon v-if="fab">
                        mdi-close
                    </v-icon>
                    <v-icon v-else>
                        mdi-information-outline
                    </v-icon>
                </v-btn>
            </template>
            <goal-delete
                v-if="canDelete"
                :goal-id="goal.id"
            />
            <v-btn
                v-if="canEdit"
                fab
                small
                color="green"
                @click="openEdit"
            >
                <v-icon>
                    mdi-pencil-outline
                </v-icon>
            </v-btn>
        </v-speed-dial>
    </div>
</template>

<script src=./GoalSpeedDial.ts />
