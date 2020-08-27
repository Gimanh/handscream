<template>
    <v-layout row align-center justify-center fill-height>
        <v-card>
            <v-card-title primary-title>
                <div>
                    <h2>{{ $t('msg.appLic') }}</h2>
                </div>
            </v-card-title>

            <v-list three-line>
                <v-list-item
                    v-for="item in allLicenses"
                    :key="item.name"
                    :href="item.link"
                >
                    <v-list-item-avatar>
                        <v-icon>code</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <strong>
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </strong>

                        <v-list-item-title>
                            {{ $t('msg.licInfo') }} <strong>{{ item.licenseType }}</strong>
                        </v-list-item-title>
                        <strong>
                            <a :href="item.link">{{ item.link }}</a>
                        </strong>
                    </v-list-item-content>

                    <!--<v-list-item-action>
                        <v-btn icon ripple>
                            <v-icon color="grey lighten-1">info</v-icon>
                        </v-btn>
                    </v-list-item-action>-->
                </v-list-item>
            </v-list>
        </v-card>
        <!--        </v-dialog>-->
    </v-layout>
</template>

<script src="./License.ts"></script>
