<template>
    <v-card
        width="400px"
    >
        <v-card-text>
            <v-tabs
                v-model="tab"
            >
                <v-tab
                    v-for="(item, index) in tabs"
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
                    :key="index"
                    :value="'tab-' + index"
                >

                    <component
                        :is="item.component"
                    />
                </v-tab-item>
            </v-tabs-items>
        </v-card-text>
    </v-card>
</template>

<script src="./AppCredentialsForm.ts" />
