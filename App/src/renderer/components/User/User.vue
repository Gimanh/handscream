<template>
    <div>
        <v-content>
            <v-container
                fluid
                class="pa-0 user-container"
            >
                <v-row
                    v-if="showHintSelectGoal"
                >
                    <v-col
                        v-if="activeDatabase"
                        :class="showHintSelectGoal ? 'app-flex-left-in-center pl-5' : ''"
                    >
                        <h3
                            class="font-weight-regular"
                        >
                            {{ $t('msg.selectGoalOrCreate') }}
                        </h3>
                    </v-col>
                    <v-col
                        v-else
                        cols="12"
                        class="d-flex align-center justify-center"
                    >
                        <v-alert type="info" class="">
                            <template v-slot:prepend>
                                <v-icon
                                    class="pr-4 material-icons-outlined"
                                >
                                    info
                                </v-icon>
                            </template>
                            {{ $t('msg.createLocalStorage') }}

                            <template v-slot:append>
                                <div class="ml-2 app-start-database">
                                    <database />
                                </div>
                            </template>
                        </v-alert>
                    </v-col>
                </v-row>
                <router-view />
            </v-container>
        </v-content>
    </div>
    <!--<v-layout>
        <v-row v-if="activeDatabase" class="hs-lists-container ma-0">
            <v-col cols="4" class="hs-list pa-3 pr-3">
                <express-list
                    v-if="activeDatabase"
                    v-bind="expressList.props"
                />
            </v-col>
            <v-col cols="4" class="hs-list pa-3 pl-0">
                <targets
                    v-if="activeDatabase"
                />
            </v-col>
            <v-col cols="4" class="hs-list pa-3 pl-0">
                <app-calendar
                    v-if="false"
                />
            </v-col>
        </v-row>
        <v-row v-if="!activeDatabase">
            <v-col cols="12" class="d-flex align-center justify-center">
                <v-alert type="info" class="">
                    <template v-slot:prepend>
                        <v-icon class="pr-4">
                            info
                        </v-icon>
                    </template>
                    {{ $t('msg.createLocalStorage') }}

                    <template v-slot:append>
                        <div class="ml-2 app-start-database">
                            <database />
                        </div>
                    </template>
                </v-alert>
            </v-col>
        </v-row>
    </v-layout>-->
</template>

<script src="./User.ts"></script>
