<template>
    <div>
        <div>{{ $route.params.user }} [{{ $store.state.User.email }}]</div>
        <nuxt-child/>
    </div>
</template>

<script src="../classes/pages/User.ts" />
