<template>
    <v-card elevation="0">
        <v-card-text class="pa-0">
            <v-form ref="form"
                    v-model="valid"
                    class="pa-2"
                    @submit.prevent>
                <v-alert v-model="showAlert"
                         :type="alertType"
                         dismissible>
                    <div>
                        {{ messageRegistration }}
                    </div>
                    <div>
                        {{ confirmMessage }}
                    </div>
                </v-alert>
                <v-text-field v-model="email"
                              :label="emailLabel"
                              :rules="emailRule"
                              required />

                <v-text-field v-model="login"
                              :label="loginLabel"
                              :rules="loginRules"
                              :loading="checkInProcess"
                              required
                              @change="checkLoginOnServer" />

                <v-text-field v-model="password"
                              :label="passwordLabel"
                              :rules="credentialsRules"
                              :type="passwordType"
                              :append-inner-icon="passwordIcon"
                              required
                              @click:append="inversePasswordType" />

                <v-text-field v-model="passwordRepeat"
                              :label="passwordLabelRepeat"
                              :rules="passwordRepeatRule"
                              :type="passwordRepeatType"
                              :append-inner-icon="passwordRepeatIcon"
                              required
                              @click:append="inversePasswordRepeatType" />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn :disabled="!termAccepted && !checkInProcess"
                   elevation="1"
                   @click="submit">
                {{ $t('msg.submit') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script src="./RegistrationForm.ts" />

