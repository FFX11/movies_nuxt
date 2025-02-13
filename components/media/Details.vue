<script setup lang="ts">
import TVShowPlayer from './TVShowPlayer.vue'
import type TVShow from './TVShow.vue'
import type { Media, MediaType } from '~/types'

defineProps<{
  item: Media
  type: MediaType
}>()

const tab = ref<'content' | 'overview' | 'videos' | 'photos'>('content')
</script>

<template>
  <div flex items-center justify-center py6>
    <button n-tab :class="{ 'n-tab-active': tab === 'content' }" @click="tab = 'content'">
      {{ $t('Content') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'overview' }" @click="tab = 'overview'">
      {{ $t('Overview') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'videos' }" @click="tab = 'videos'">
      {{ $t('Videos') }}
    </button>
    <button n-tab :class="{ 'n-tab-active': tab === 'photos' }" @click="tab = 'photos'">
      {{ $t('Media Photos') }}
    </button>
  </div>
  <MediaTVShow v-if="type === 'tv' && tab === 'content'" :item="item" :type="type" />
  <MediaOverview v-if="tab === 'overview'" :item="item" :type="type" />
  <MediaVideos v-if="tab === 'videos'" :item="item" />
  <MediaPhotos v-if="tab === 'photos'" :item="item" />
</template>
