<template>
    <div>
        <v-form
            ref="form"
        >
            <v-text-field
                v-model="taskName"
                :error="invalidName"
                :error-messages="errorMessage"
                :label="label"
                :placeholder="label"
                :append-icon="iconForInput"
                @input="inputHandler"
                @keypress.enter="add"
            />
        </v-form>
    </div>
</template>

<script src=./TaskAdd.ts />
