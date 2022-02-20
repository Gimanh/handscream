<template>
    <div>
        <goal-component-edit
            v-if="activeEdit"
            :list="list"
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
            <goal-component-delete
                :list="list"
            />
            <v-btn
                fab
                dark
                small
                color="green"
                @click="openEdit"
            >
                <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
        </v-speed-dial>
    </div>
</template>

<script src=./GoalComponentSpeedDial.ts />
