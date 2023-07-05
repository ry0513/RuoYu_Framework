<template>
  <div v-for="article in useArticleStore().lists" :key="article.articleId">
    <router-link :to="`/article/${article.articleId}`">{{
      article.title
    }}</router-link>
  </div>
</template>

<script lang="ts" setup>
import { useArticleStore } from "@/store";
import { useHead } from "@vueuse/head";
defineOptions({
  name: "list",
  async asyncData({}: any) {
    const articleStore = useArticleStore();
    await articleStore.getList();
  },
});
useHead({
  title: "首页",
  meta: [
    {
      name: "description",
      content: "首页",
    },
  ],
});
</script>
