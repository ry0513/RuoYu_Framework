<template>
  <div class="header">
    <router-link to="/">HOME</router-link>
    |
    <router-link to="/article/9">article-9</router-link>
    |
    <router-link to="/article/5">article-5</router-link>
    |
    <router-link to="/about">ABOUT</router-link>
  </div>
  <router-view />
</template>
<script setup lang="ts"></script>

<style>
.header {
  line-height: 50px;
  border-bottom: 1px solid #e40a0a;
  margin-bottom: 20px;
}
</style>
