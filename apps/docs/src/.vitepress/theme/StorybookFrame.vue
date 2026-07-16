<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    id: string;
    title: string;
    height?: number | string;
    storybookUrl?: string;
  }>(),
  {
    height: 360,
    storybookUrl: 'https://storybook.vellira.dev',
  },
);

const frameHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
);

const source = computed(() => {
  const base = props.storybookUrl.replace(/\/$/, '');
  const params = new URLSearchParams({
    id: props.id,
    viewMode: 'story',
  });

  return `${base}/iframe.html?${params.toString()}`;
});

const storyUrl = computed(() => {
  const base = props.storybookUrl.replace(/\/$/, '');

  return `${base}/?path=/story/${props.id}`;
});
</script>

<template>
  <figure class="docs-storybook-frame">
    <iframe
      :src="source"
      :title="title"
      :style="{ height: frameHeight }"
      loading="lazy"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
    />
    <figcaption>
      <span>{{ title }}</span>
      <a
        :href="storyUrl"
        target="_blank"
        rel="noreferrer"
      >
        Open in Storybook
      </a>
    </figcaption>
  </figure>
</template>
