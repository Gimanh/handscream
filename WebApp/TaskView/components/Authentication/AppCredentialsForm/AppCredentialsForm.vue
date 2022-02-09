<template>
    <v-card
        width="400px"
    >
        <div
            v-if="!resetPassword"
        >
            <v-card-text>
                <v-tabs
                    v-model="tab"
                >
                    <v-tab
                        v-for="(item, index) in tabs"
                        v-if="canDisplayComponent(item)"
                        :key="index"
                        :href="'#tab-' + index"
                    >
                        {{ item.title }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items
                    v-model="tab"
                >
                    <v-tab-item
                        v-for="(item, index) in tabs"
                        v-if="canDisplayComponent(item)"
                        :key="index"
                        :value="'tab-' + index"
                    >
                        <component
                            :is="item.component"
                            @cancelRecovery="setRecoveryMode(false)"
                        />
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <a
                    v-if="!recoveryModeActive"
                    @click="setRecoveryMode(true)"
                >
                    {{ forgotPassword }}
                </a>
            </v-card-actions>
        </div>
        <div
            v-if="resetPassword"
        >
            <reset-password />
        </div>
    </v-card>
</template>

<script src="./AppCredentialsForm.ts" />
