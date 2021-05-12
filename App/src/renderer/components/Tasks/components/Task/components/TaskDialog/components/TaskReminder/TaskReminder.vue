<template>
    <v-row
        class="goal-nested-items__info ma-0"
    >
        <v-col
            cols="12"
            class="pa-1"
        >
            <v-card width="100%">
                <v-card-subtitle>
                    {{ $t( 'msg.deadline' ) }}
                </v-card-subtitle>
                <v-card-text>
                    <app-reminder
                        :given-selected-date="item.item_reminder_exp_date"
                        @saveDate="saveDate($event, item)"
                        @resetDate="resetDate(item)"
                    />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script src="./TaskReminder.ts" />
