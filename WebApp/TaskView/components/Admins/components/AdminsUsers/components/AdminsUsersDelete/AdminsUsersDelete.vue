<template>
    <v-dialog
        v-model="dialog"
        scrollable
        max-width="300px"
        persistent
    >
        <template #activator="{ on, attrs }">
            <v-btn
                :disabled="disabled"
                icon
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
            >
                <v-icon>
                    mdi-delete
                </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                {{ $t( 'admin.deleteUser' ) }}
            </v-card-title>
            <v-divider />
            <v-card-text style="height: 100%;">
                {{ $t( 'admin.doDeleting' ) }} [{{ userData.login }}]
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue darken-1"
                    text
                    @click="cancel"
                >
                    {{ $t( 'msg.close' ) }}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                >
                    {{ $t( 'msg.save' ) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src=./AdminsUsersDelete.ts />
