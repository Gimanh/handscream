<template>
    <div>
        <h1>{{ $store.state.User.login }}</h1>
        <div>{{ $route.params.user }} [{{ $store.state.User.email }}]</div>
        <nuxt-child/>
    </div>
</template>

<script src="../classes/pages/User.ts" />
