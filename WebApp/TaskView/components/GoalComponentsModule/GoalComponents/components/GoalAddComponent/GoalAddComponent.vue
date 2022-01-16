<template>
    <div>
        <v-form
            v-if="inlineMode"
            ref="form"
        >
            <v-text-field
                v-model="name"
                :error="invalidName"
                :error-messages="errorMessage"
                :label="$t( 'msg.addItem' )"
                :placeholder="$t( 'msg.addItem' )"
                :append-icon="iconForInput"
                @input="inputHandler"
                @keypress.enter="add"
            />
        </v-form>
    </div>
</template>

<script src=./GoalAddComponent.ts />
