<template>
    <v-card
        elevation="0"
    >
        <v-card-text
            class="pa-0"
        >
            <v-form
                ref="form"
                v-model="valid"
                class="pa-2"
            >
                <v-alert
                    v-if="!reset"
                    type="info"
                >
                    {{ errorResetAlert }}
                </v-alert>

                <v-text-field
                    v-model="password"
                    :label="passwordLabel"
                    :rules="passwordRules"
                    type="password"
                    required
                />
                <v-text-field
                    v-model="passwordRepeat"
                    :label="passwordLabelRepeat"
                    :rules="passwordRepeatRule"
                    type="password"
                    required
                />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn
                icon
                fab
                @click="cancel"
            >
                <v-icon>
                    mdi-arrow-left
                </v-icon>
            </v-btn>
            <v-spacer />
            <v-btn
                class="mr-4"
                elevation="1"
                @click="submit"
            >
                {{ $t( 'msg.submit' ) }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script src=./ResetPassword.ts />
