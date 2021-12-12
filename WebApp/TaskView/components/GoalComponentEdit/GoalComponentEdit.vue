<template>
    <v-dialog
        v-model="dialog"
        width="400"
        persistent
    >
        <template #activator="{ on }">
            <v-btn
                icon
                small
                v-on="on"
            >
                <v-icon>
                    mdi-pencil-outline
                </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                {{ $t( 'msg.editing' ) }}
            </v-card-title>
            <v-card-text>
                <v-form
                    ref="form"
                >
                    <v-row>
                        <v-col
                            cols="12"
                        >
                            <v-text-field
                                v-model="name"
                                :label="$t('msg.goalName')+'*'"
                                :rules="componentName"
                                required
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue darken-1"
                    text
                    @click="cancel"
                >
                    {{ $t( 'msg.cancel' ) }}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="update"
                >
                    {{ $t( 'msg.update' ) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src=./GoalComponentEdit.ts />
