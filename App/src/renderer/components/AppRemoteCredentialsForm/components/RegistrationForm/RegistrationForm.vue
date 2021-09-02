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
                    v-model="showAlert"
                    :type="alertType"
                    dismissible
                >
                    <div>
                        {{ messageRegistration }}
                    </div>
                    <div>
                        {{ confirmMessage }}
                    </div>
                </v-alert>
                <v-text-field
                    v-model="server"
                    :label="serverLabel"
                    :rules="credentialsRules"
                    required
                />

                <v-text-field
                    v-model="email"
                    :label="emailLabel"
                    :rules="emailRule"
                    required
                />

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
            <v-spacer />
            <v-btn
                class="mr-4"
                elevation="1"
                @click="submit"
            >
                {{ $t( 'msg.submit' ) }}
            </v-btn>
            <v-btn
                elevation="1"
                @click="cancel"
            >
                {{ $t( 'msg.cancel' ) }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script src="./RegistrationForm.ts" />
