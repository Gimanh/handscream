<template>
    <v-row class="ma-0">
        <v-col
            cols="12"
            class="pa-1"
        >
            <v-card>
                <v-card-subtitle>
                    {{ $t( 'msg.labels' ) }}
                </v-card-subtitle>
                <v-card-text>
                    <task-labels-chips
                        :selected-labels="item.labels"
                        :nested-item-id="item.id"
                        @change="emitChange"
                    />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script src="./TaskLabels.ts" />
