<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { MediaType } from '~/types'

const route = useRoute()
const type = computed(() => route.params.type as MediaType || 'movie')
const id = computed(() => Number(route.params.id)) // Ensure TMDB ID is a number

// Extracting season and episode from route params
const season = computed(() => Number(route.params.season) || 1) // Default to 1 if not provided
const episode = computed(() => Number(route.params.episode) || 1) // Default to 1 if not provided

// Fetching media details and recommendations
const [item, recommendations] = await Promise.all([
  getMedia(type.value, id.value), // Make sure id is being correctly passed as TMDB ID
  getRecommendations(type.value, id.value),
])

const $img = useImage()
if (item) {
  useHead({
    title: item.name || item.title,
    meta: [
      { name: 'description', content: item.overview || '' },
      { property: 'og:image', content: $img(`/tmdb${item.poster_path}`, { width: 1200, height: 630 }) },
    ],
  })
}
else {
  console.error('Item not found for ID:', id.value)
}

// Inject Adsterra ad script
onMounted(() => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = '//fryboldlymalice.com/ce/75/ca/ce75ca7f64dfc655f0d2aa5ea5ca3cae.js'
  script.async = true
  document.body.appendChild(script)

  // Cleanup on unmount
  return () => {
    document.body.removeChild(script)
  }
})
</script>

<template>
  <div>
    <br>
    <MediaTVShowPlayer
      :item="item"
      type="tv"
      :season="season"
      :episode="episode"
    />

    <MediaDetails v-if="item" :item="item" :type="type" />

    <CarouselBase v-if="recommendations?.results?.length">
      <template #title>
        {{ $t('More like this') }}
      </template>
      <MediaCard
        v-for="i of recommendations.results"
        :key="i.id"
        :item="i"
        :type="type"
        flex-1 w-40 md:w-60
      />
    </CarouselBase>

    <TheFooter />
  </div>
</template>
