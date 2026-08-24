<template>
  <WaterMaker
      :show="true"
      :default-display="true"
      :input-text="inputText"
  ></WaterMaker>
  <CustomLayout>
    <RouterView />
  </CustomLayout>
</template>
<script setup>
import { ref } from "vue";
import WaterMaker from "@/components/common/WaterMaker.vue";
import CustomLayout from "@/components/CustomLayout.vue";
const inputText = ref('demo');
</script>