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
                    mdi-account-plus
                </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                {{ $t( 'admin.editUser' ) }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 100%;">
                <v-form
                    ref="form"
                    v-model="valid"
                >
                    <v-text-field
                        v-model="login"
                        :rules="loginRules"
                        :label="$t('admin.login')"
                        :loading="loginLoading"
                        required
                        @input="checkUserLogin"
                    />
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        :label="$t('admin.email')"
                        :loading="loading"
                        required
                        @input="checkUserEmail"
                    />
                    <v-text-field
                        v-model="password"
                        :label="$t( 'msg.password' )"
                        :rules="credentialsRules"
                        :type="passwordType"
                        :append-icon="passwordIcon"
                        required
                        @click:append="inversePasswordType"
                    />
                    <v-checkbox
                        v-model="block"
                        :label="$t('admin.block')"
                        required
                    />
                </v-form>
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
                    :disabled="!valid"
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

<script src=./AdminsUsersAdd.ts />
