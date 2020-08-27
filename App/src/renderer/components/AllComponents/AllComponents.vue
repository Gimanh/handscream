<template>
    <div class="text-xs-center">
        <v-menu offset-y>
            <template v-slot:activator="{ on: onMenu }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                        <v-btn
                            :color="actionsBtnColor"
                            icon
                            :disabled="disabled"
                            v-on="{ ...onMenu, ...onTooltip }"
                        >
                            <v-icon>
                                add
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('msg.addComponent') }}</span>
                </v-tooltip>
            </template>
            <v-list>
                <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    @click="selectComponent(item.componentName)"
                >
                    <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script src="./AllComponents.ts"></script>
