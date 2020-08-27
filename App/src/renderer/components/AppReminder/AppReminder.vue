<template>
    <v-dialog
        v-model="dialog"
        persistent
        :width="baseDialogWidth"
    >
        <template v-slot:activator="{ on }">
            <v-btn
                depressed
                class="app-reminder-activator"
                small
                color="primary"
                v-on="on"
            >
                <v-icon>
                    today
                </v-icon>
                <div>
                    {{ uiDate }}
                </div>
            </v-btn>
        </template>

        <v-card>
            <v-progress-linear
                v-if="dialog && !canShowCalendar"
                indeterminate
            />
            <v-card-text
                v-if="canShowCalendar"
                class="pa-0"
            >
                <vue-ctk-date-time-picker
                    v-model="selectedDate"
                    :dark="dark"
                    format="YYYY-MM-DD HH:mm"
                    :label="$t('msg.selectDateTime')"
                    no-shortcuts
                    minute-interval="5"
                    inline
                />
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue--text darken-1"
                    elevation="1"
                    @click="resetDate"
                >
                    {{ $t('msg.reset') }}
                </v-btn>
                <v-btn
                    color="blue--text darken-1"
                    elevation="1"
                    @click="saveDate"
                >
                    {{ $t('msg.save') }}
                </v-btn>
                <v-btn
                    color="blue--text darken-1"
                    elevation="1"
                    @click="dialog = false"
                >
                    {{ $t('msg.cancel') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./AppReminder.ts"></script>
