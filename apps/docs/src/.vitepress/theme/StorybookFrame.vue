<script setup lang="ts">
import { computed } from 'vue';
import { STORYBOOK_STORIES, type StorybookStoryKey } from './storybookStories';

const props = withDefaults(
  defineProps<{
    id?: string;
    story?: StorybookStoryKey;
    title: string;
    height?: number | string;
    storybookUrl?: string;
  }>(),
  {
    height: 360,
    storybookUrl: 'https://storybook.vellira.dev',
  }
);

const resolvedId = computed(() => {
  if (props.story) {
    return STORYBOOK_STORIES[props.story];
  }

  return props.id;
});

const frameHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
);

const frameStyle = computed(() => ({
  '--docs-storybook-height': frameHeight.value,
  height: frameHeight.value,
}));

const source = computed(() => {
  const base = props.storybookUrl.replace(/\/$/, '');
  const params = new URLSearchParams({
    id: resolvedId.value ?? '',
    viewMode: 'story',
  });

  return `${base}/iframe.html?${params.toString()}`;
});

const storyUrl = computed(() => {
  const base = props.storybookUrl.replace(/\/$/, '');

  return `${base}/?path=/story/${resolvedId.value ?? ''}`;
});
</script>

<template>
  <figure class="docs-storybook-frame">
    <iframe
      :src="source"
      :title="title"
      :style="frameStyle"
      loading="lazy"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
    />
    <figcaption>
      <span>{{ title }}</span>
      <a :href="storyUrl" target="_blank" rel="noreferrer">
        Open in Storybook
      </a>
    </figcaption>
  </figure>
</template>
