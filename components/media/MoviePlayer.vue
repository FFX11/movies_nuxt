<script setup lang="ts">
import type { Media } from '~/types'
import { formatTime } from '~/composables/utils'
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  item: Media
}>(), {
  item: () => ({} as Media),
})

// State management for video playback
const isPlaying = ref(false) // To track if the video is playing
const mounted = useMounted()

// Function to load the video
const loadVideo = () => {
  isPlaying.value = true
}
</script>

<template>
  <div :key="item.id" class="container bg-black rounded-lg shadow-lg">
    <!-- Movie Cover Image -->
    <div
      class="cover-image-container"
      absolute top-0 right-0
      lt-lg="left-0"
      lg="bottom-0 left-1/3"
    >
      <NuxtImg
        width="1220"
        height="659"
        format="webp"
        :src="`/tmdb${props.item.backdrop_path}`"
        :alt="props.item.title || props.item.name"
        h-full w-full object-cover
      />
    </div>

    <!-- Iframe Container -->
    <!-- :src="`https://vidsrc.me/embed/movie?tmdb=${props.item.id}`" -->

    <div class="iframe-container absolute top-0 left-0 right-0">
      <div class="player-container">
        <button v-if="!isPlaying" class="play-button" @click="loadVideo">Play</button>
        <iframe
          v-if="isPlaying"
          :src="`https://moviesapi.club/movie/${props.item.id}`"
          class="video-iframe"
          frameborder="0"
          referrerpolicy="origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    </div>
</template>

<style scoped>
.hero-enter-active,
.hero-leave-active {
  transition: transform .75s cubic-bezier(.4, .25, .3, 1), opacity .3s cubic-bezier(.4, .25, .3, 1);
}

.hero-enter-from,
.hero-leave-to {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}

.hero-enter-to,
.hero-leave-from {
  opacity: 1;
  transform: translateZ(0);
}

/* Styles for the Iframe */
.iframe-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  z-index: 5; /* Ensure iframe is below overlay */
}

.player-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  background-color: #ff0000; /* Change as needed */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s ease;
}

.play-button:hover {
  background-color: #d70000; /* Darker red on hover */
}

.container {
  position: relative;
  max-width: 1200px; /* Set a maximum width for larger screens */
  max-height: 700px; /* Set a maximum height */
  margin: auto; /* Center the container */
  padding: 16px; /* Add padding inside the container */
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Arrange content vertically */
  justify-content: center; /* Center content vertically */
  align-items: center; /* Center content horizontally */
  overflow: hidden; /* Prevent overflow */
  border-radius: 10px; /* Rounded corners for aesthetics */
}

.cover-image-container {
  position: absolute;
  max-width: 90%;
  max-height: 90%;
  top: 6%;
  left: 4%;
  right: 0;
  bottom: 0;
  overflow: hidden; /* Prevent overflow */
}
</style>
