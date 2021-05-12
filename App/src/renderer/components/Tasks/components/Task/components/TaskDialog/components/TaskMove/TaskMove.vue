<template>
    <v-row>
        <v-col>
            <v-card>
                <v-card-subtitle>
                    {{ $t( 'msg.moreActions' ) }}
                </v-card-subtitle>
                <v-card-text>
                    <goal-nested-item-move
                        :item="item"
                        @moveComplete="emitChange"
                    />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script src="./TaskMove.ts" />
