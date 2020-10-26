<template>
    <div class="text-xs-center">
        <form>
            <v-row>
                <v-col style="display: flex; justify-content: center;">
                    <v-btn
                        :disabled="!appliedTerms"
                        color="success"
                        class="mr-1"
                        @click="useLocal"
                    >
                        {{ $t( 'msg.local' ) }}
                    </v-btn>
                    <v-btn
                        :disabled="true"
                        color="blue-grey"
                    >
                        {{ $t( 'msg.remote' ) }}
                    </v-btn>
                </v-col>
            </v-row>


            <v-row
                class="ma-0"
            >
                <v-dialog
                    v-model="showLicenseDialog"
                    fullscreen
                    hide-overlay
                    transition="dialog-bottom-transition"
                    scrollable
                >
                    <template v-slot:activator="{ on }">
                        <div>
                            <v-row v-on="on">
                                <v-col
                                    cols="12"
                                    class="pa-0"
                                    style="display: flex; justify-content: center;"
                                >
                                    {{ $t( 'msg.beforeStart' ) }}
                                </v-col>
                                <v-col
                                    cols="12"
                                    class="pa-0"
                                    style="display: flex; justify-content: center;"
                                >
                                    <a>
                                        {{ $t( 'msg.agreeTerms' ) }}
                                    </a>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col
                                    cols="12"
                                    class="pa-0"
                                    style="display: flex; justify-content: center;"
                                >
                                    <a :href="repository">
                                        {{ $t( 'msg.git' ) }}
                                    </a>
                                </v-col>
                            </v-row>
                        </div>
                    </template>

                    <v-card>
                        <v-card-title
                            style="justify-content: center;"
                        >
                            {{ $t( 'msg.beforeStart' ) }}
                        </v-card-title>
                        <v-card-text>
                            <v-layout align-center justify-center row>
                                <v-flex md6 style="white-space: pre-wrap; text-align: justify;">
                                    <div style="text-align: center;">
                                        {{ licenseText }}
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="red red-1" @click="disagree">
                                {{ $t( 'msg.disagree' ) }}
                            </v-btn>
                            <v-btn color="green darken-1" @click="agree">
                                {{ $t( 'msg.agree' ) }}
                            </v-btn>
                            <v-spacer />
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </form>
    </div>
</template>

<script lang="ts" src="./Start.ts"></script>
