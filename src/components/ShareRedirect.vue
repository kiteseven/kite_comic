<template>
  <div>正在跳转...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const targetUrl = route.query.redirect;

  if (targetUrl) {
    // 解码并跳转（需验证域名安全性）
    const decodedUrl = decodeURIComponent(targetUrl);

    // 示例安全校验：仅允许跳转本站链接
    if (decodedUrl.startsWith(window.location.origin)) {
      window.location.href = decodedUrl;
    } else {
      router.push('/error?code=invalid_redirect');
    }
  } else {
    router.push('/');
  }
});
</script>