<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Toggle navigation" @click="$emit('toggle-drawer')" />

      <q-toolbar-title>
        <q-btn flat no-caps label="AF_WEB" to="/" />
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup>
  defineEmits(['toggle-drawer'])
</script>
