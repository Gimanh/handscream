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
                @submit.prevent
            >
                <v-text-field
                    v-model="email"
                    :label="emailLabel"
                    :rules="emailRule"
                    required
                />
                <v-alert
                    v-if="emailSent"
                    :type="alertType"
                >
                    {{ alertInfo }}
                </v-alert>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn
                icon
                fab
                @click="emitCancel"
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

<script src=./PasswordRecovery.ts />
