<template>
    <v-row
        class="ma-0"
    >
        <v-col
            cols="12"
            class="pa-1"
        >
            <v-card>
                <v-card-subtitle>
                    {{ $t( 'msg.taskActivity' ) }}
                </v-card-subtitle>
                <v-card-text>
                    <task-time-records-table
                        :item="item"
                    />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script src="./TaskTimeRecords.ts" />
