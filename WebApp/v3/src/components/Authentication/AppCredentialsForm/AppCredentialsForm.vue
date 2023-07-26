<template>
    <v-card
        width="400px"
        density="compact"
    >
        <div
            v-if="!resetPassword"
        >
            <v-card-text>
                <v-tabs
                    v-model="tab"
                >
                    <template
                        v-for="(item, index) in tabs"
                        :key="index"
                    >
                        <v-tab
                            v-if="canDisplayComponent(item)"
                            :value="item.component"
                        >
                            {{ item.title }}
                        </v-tab>
                    </template>

                </v-tabs>
                <v-window
                    v-model="tab"
                >
                    <v-window-item
                        v-for="(item, index) in tabs"
                        :key="index"
                        :value="item.component"
                    >
                        <div
                            v-if="canDisplayComponent(item)"
                        >
                            <component
                                :is="item.component"
                                @cancelRecovery="setRecoveryMode(false)"
                            />
                        </div>
                    </v-window-item>
                </v-window>
            </v-card-text>
            <v-card-actions
                v-if="!recoveryModeActive"
            >
                <v-spacer />
                <a
                    style="cursor: pointer;"
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
