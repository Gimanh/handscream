<template>
    <v-bottom-sheet
        :value="value"
        inset
        persistent
    >
        <v-sheet
            class="text-center app-form"
            height="100px"
        >
            <v-icon color="red">
                warning
            </v-icon>
            <h4>
                {{ $t('msg.areYouWantDeleteRecord') }}
            </h4>
            <v-btn
                color="app-form-submit-btn"
                depressed
                @click="emitCancel"
            >
                {{ $t('msg.cancel') }}
            </v-btn>
            <v-btn
                color="app-form-cancel-btn"
                depressed
                @click="emitDelete"
            >
                {{ $t('msg.agree') }}
            </v-btn>
        </v-sheet>
    </v-bottom-sheet>
</template>

<script src="./AppDeleteRecordBottomSheet.ts" />
