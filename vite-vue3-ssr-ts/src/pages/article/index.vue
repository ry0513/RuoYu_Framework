<template>
  <div v-if="useArticleStore().details">
    <div class="article-title" v-html="useArticleStore().details?.title"></div>
    <div
      class="article-html"
      v-html="useArticleStore().details?.formatHtml"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { useArticleStore } from "@/store";
import "@/style/vs2015.min.css";
import { useHead } from "@vueuse/head";
import { computed } from "vue";

defineOptions({
  name: "list",
  async asyncData({ route }: any) {
    const articleStore = useArticleStore();
    await articleStore.getDetails(route.params.articleId);
  },
});
useHead({
  title: computed(() => useArticleStore().details?.title || ""),
  meta: [
    {
      name: "description",
      content: "关于",
    },
  ],
});
</script>

<style lang="scss" scoped>
.article-title {
  font-size: 24px;
  text-align: center;
}
.article-html {
  :deep(blockquote) {
    border-left: 8px solid #d0e5f2;
    padding: 10px 10px;
    margin: 10px 0;
    background-color: #f1f1f1;
  }
  :deep(img) {
    max-width: 100%;
  }
  :deep(pre) {
    background-color: #1e1e1e;
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    border-radius: 3px;
    color: #abb2bf;
  }
}
</style>
