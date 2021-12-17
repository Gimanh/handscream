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
                    :goal-id="goal.id"
                />
                <goal-edit
                    :goal="goal"
                />
            </v-speed-dial>
        </v-list-item-action>
    </v-list-item>
</template>

<script src=./Goal.ts />
