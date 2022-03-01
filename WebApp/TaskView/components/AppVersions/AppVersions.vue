<template>
    <v-dialog
        v-model="dialog"
        scrollable
        max-width="500px"
        persistent
    >
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
            >
                <v-icon>
                    mdi-information-outline
                </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                {{ about }}
            </v-card-title>
            <v-divider />
            <v-card-text
                style="height: 300px;"
            >
                <v-card
                    v-for="(item, key) in items"
                    :key="key"
                >
                    <v-card-title>
                        {{ key }} [ {{ item.description }} ]
                    </v-card-title>
                    <v-card-subtitle>
                        {{ $t( 'task.date' ) }} {{ getDateFormat( item.date ) }}
                    </v-card-subtitle>
                    <v-divider />
                    <v-card-text>
                        <ul>
                            <li
                                v-for="(k, i) in item.items"
                                :key="i"
                            >
                                {{ k }}
                            </li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                >
                    {{ closeTitle }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src=./AppVersions.ts />
