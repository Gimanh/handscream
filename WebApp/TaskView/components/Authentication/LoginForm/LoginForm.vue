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
                    v-model="login"
                    :label="loginLabel"
                    :rules="credentialsRules"
                    required
                />

                <v-text-field
                    v-model="password"
                    :label="passwordLabel"
                    :rules="credentialsRules"
                    type="password"
                    required
                />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn
                elevation="1"
                @click="submit"
            >
                {{ $t( 'msg.submit' ) }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script src="./LoginForm.ts" />
