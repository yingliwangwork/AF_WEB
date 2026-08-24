<template>
    <q-layout view="hHh Lpr lff" container class="window-height">
        <q-header class="bg-primary">
            <q-toolbar>
                <q-btn flat @click="drawer = !drawer" dense icon="menu" />
                <q-toolbar-title>
                    <router-link to="/" class="text-white">
                        DEMO
                    </router-link>
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="drawer" bordered class="bg-green-1">
            <q-scroll-area class="fit">
                <q-tree :nodes="navCollection" node-key="label" children-key="items" default-expand-all>
                    <template v-slot:default-header="props">
                        <template v-if="props?.node?.url">
                            <router-link :to="props?.node?.url" class="text-dark row">
                                <span class="cub-icon-info_18 cxl-font-24" :class="props?.node?.icon"></span>
                                {{ props?.node?.label }}
                            </router-link>
                        </template>
                        <template v-else>
                            <span class="cub-icon-info_18 cxl-font-24" :class="props?.node?.icon"></span>
                            {{ props?.node?.label }}
                        </template>
                    </template>
                </q-tree>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <q-page padding>
                <slot></slot>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
    import { ref } from 'vue'
    import navCollection from "@/service/NavCollection.js";
    const drawer = ref(false)
</script>

<style scoped>
a {
    text-decoration: none;
}
</style>