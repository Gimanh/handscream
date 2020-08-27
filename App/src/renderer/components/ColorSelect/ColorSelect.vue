<template>
    <div class="text-xs-center">
        <v-menu offset-y>
            <template v-slot:activator="{ on: onMenu }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                        <v-btn

                            icon
                            v-on="{ ...onMenu, ...onTooltip }"
                            @click="generateColors"
                        >
                            <v-icon>
                                color_lens
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('msg.changeColor') }}</span>
                </v-tooltip>
            </template>
            <v-list>
                <v-list-item
                    v-for="item in colorItems"
                    :key="item"
                    :style="{background:item}"
                    @click="selectedColor(item)"
                >
                    <v-list-tile-title />
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
<script src="./ColorSelect.ts"></script>
