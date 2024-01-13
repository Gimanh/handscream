<template>
    <div class="justify-center d-flex align-center index-page-container start-page-height bg-grey-lighten-4">
        <ABtn :to="{ name: 'login' }"
              size="x-large"
              color="red-lighten-1">
            {{ $t('msg.login') }}
        </ABtn>
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import ABtn from '@/components/Atoms/ABtn/ABtn.vue';
</script>
