<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on:onDialog }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on : onTooltip }">
                    <v-btn
                        icon
                        style="opacity: .5"
                        v-on="{ ...onDialog, ...onTooltip }"
                        @click="tabsModel = 0"
                    >
                        <v-icon class="material-icons-outlined">
                            info
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{ $t('msg.licInfo') }}</span>
            </v-tooltip>
        </template>

        <v-card>
            <v-tabs
                v-model="tabsModel"
                fixed-tabs
            >
                <v-tab
                    ripple
                >
                    {{ $t('msg.about') }}
                </v-tab>
                <v-tab
                    ripple
                >
                    {{ $t('msg.licInfo') }}
                </v-tab>

                <v-tab @click="dialog = false">
                    {{ $t('msg.close') }}
                    <!--                    <v-icon>close</v-icon>-->
                </v-tab>

                <v-tab-item>
                    <v-timeline class="mt-5">
                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.information') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>{{ $t('msg.version') }} {{ version }}</h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>

                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.a1h') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>
                                        {{ $t('msg.a1') }}
                                    </h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>

                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.a2h') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>
                                        {{ $t('msg.a2') }}
                                    </h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.a3h') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>
                                        {{ $t('msg.a3') }}
                                    </h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.a4h') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>
                                        {{ $t('msg.a4') }}
                                    </h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                        <!--<v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.a5h') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>
                                        {{ $t('msg.a5') }}
                                    </h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>-->
                        <!--<v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.a6h') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>
                                        {{ $t('msg.a6') }}
                                    </h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>-->
                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.a7h') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>
                                        {{ $t('msg.a7') }}
                                    </h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.a8h') }}</h2>
                            </template>
                            <v-card class="elevation-2">
                                <v-card-text>
                                    <h3>
                                        {{ $t('msg.a8') }}
                                    </h3>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>


                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.authors') }}</h2>
                            </template>
                            <v-card class="elevation-2 pa-5">
                                <v-list three-line>
                                    <v-list-item style="height: 120px!important;">
                                        <v-list-item-avatar size="100">
                                            <img src="@/assets/about/7.jpg" class="w100"
                                                 alt="Giman"
                                            >
                                        </v-list-item-avatar>
                                        <v-list-item-content class="ml-3">
                                            <v-list-item-title>
                                                {{ $t('msg.authorsExplainGiman') }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ $t('msg.authorsExplainGimanPosition') }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-timeline-item>
                        <v-timeline-item
                            color="red lighten-2"
                            large
                        >
                            <template v-slot:opposite>
                                <h2>{{ $t('msg.contacts') }}</h2>
                            </template>
                            <v-card class="elevation-2 pa-5">
                                <a href="mailto:hello@handscream.com">
                                    hello@handscream.com
                                </a>
                                <br />
                                <a href="mailto:support@handscream.com">
                                    support@handscream.com
                                </a>
                            </v-card>
                        </v-timeline-item>
                    </v-timeline>
                </v-tab-item>
                <v-tab-item>
                    <license />
                </v-tab-item>
            </v-tabs>
        </v-card>
    </v-dialog>
</template>

<script src="./AppAbout.ts"></script>
