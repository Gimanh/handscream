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
                    v-model="email"
                    :label="emailLabel"
                    :rules="emailRule"
                    required
                />

                <v-text-field
                    v-model="login"
                    :label="loginLabel"
                    :rules="loginRules"
                    required
                />

                <v-text-field
                    v-model="password"
                    :label="passwordLabel"
                    :rules="credentialsRules"
                    :type="passwordType"
                    :append-icon="passwordIcon"
                    required
                    @click:append="inversePasswordType"
                />

                <v-text-field
                    v-model="passwordRepeat"
                    :label="passwordLabelRepeat"
                    :rules="passwordRepeatRule"
                    :type="passwordRepeatType"
                    :append-icon="passwordRepeatIcon"
                    required
                    @click:append="inversePasswordRepeatType"
                />

                <term-of-use
                    v-slot="{attrs, on}"
                    @accept="termAcceptSuccessHandler"
                    @cancel="termAcceptCancelHandler"
                >
                    <div
                        style="color: #195288"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-row>
                            <v-col
                                cols="1"
                            >
                                <v-checkbox
                                    :value="isAccepted"
                                    :disabled="true"
                                    color="primary"
                                    hide-details
                                />
                            </v-col>
                            <v-col>
                                <div>
                                    {{ $t( 'msg.readTermOfUse' ) }}
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </term-of-use>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn
                :disabled="!termAccepted"
                elevation="1"
                @click="submit"
            >
                {{ $t( 'msg.submit' ) }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script src="./RegistrationForm.ts" />
