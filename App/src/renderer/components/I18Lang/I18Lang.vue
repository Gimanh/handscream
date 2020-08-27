<template>
    <div>
        <v-menu
            left
            bottom
        >
            <template v-slot:activator="{ on: onMenu }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                        <v-btn icon v-on="{...onMenu, ...onTooltip }">
                            <v-icon>
                                language
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('msg.locale') }}</span>
                </v-tooltip>
            </template>
            <v-list>
                <v-list-item
                    v-for="(item, index) in languages"
                    :key="index"
                    @click="setLocale(item.locale)"
                >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script src="./I18Lang.ts"></script>
