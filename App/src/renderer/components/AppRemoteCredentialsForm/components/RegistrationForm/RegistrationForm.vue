<template>
    <v-form
        ref="form"
        v-model="valid"
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

        <v-btn
            class="mr-4"
            @click="submit"
        >
            {{ $t( 'msg.submit' ) }}
        </v-btn>
        <v-btn @click="cancel">
            {{ $t( 'msg.cancel' ) }}
        </v-btn>
    </v-form>
</template>

<script src="./RegistrationForm.ts" />
