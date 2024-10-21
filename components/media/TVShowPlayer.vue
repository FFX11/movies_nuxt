<script setup lang="ts">
import type { Media } from '~/types';
import { formatTime } from '~/composables/utils';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';



const props = withDefaults(defineProps<{
  item: Media;
}>(), {
  item: () => ({} as Media),
});

const route = useRoute(); // Get route parameters directly

// https://vidsrc.me/embed/tv?tmdb=${tmdbId.value}&season=${season.value}&episode=${episode.value}
// Extracting TMDB ID, season, and episode from route params
const tmdbId = computed(() => Number(route.params.id)); // TMDB ID
const season = computed(() => Number(route.params.season) || 1); // Default to 1 if not provided
const episode = computed(() => Number(route.params.episode) || 1); // Default to 1 if not provided

// Video source for the iframe
const videoSrc = computed(() => {
  return `https://moviesapi.club/tv/${tmdbId.value}-${season.value}-${episode.value}`;
});

// State management for video playback
const isPlaying = ref(false); // To track if the video is playing


const mounted = useMounted();

// Function to load the video
const loadVideo = () => {
  isPlaying.value = true;
};
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
        :src="`/tmdb${item.backdrop_path}`"
        :alt="item.title || item.name"
        h-full w-full object-cover
      />
    </div>

    <!-- Iframe Container -->
    <div class="iframe-container absolute top-0 left-0 right-0">
      <div class="player-container">
        <button v-if="!isPlaying" class="play-button" @click="loadVideo">Play</button>
        <iframe
          v-if="isPlaying"
          :src="videoSrc"
          class="video-iframe"
          frameborder="0"
          referrerpolicy="origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <!-- Overlay for Title and Watch Trailer -->
    <div
       bottom-0 left-0 top-0 px-10
      flex="~ col" justify-center
      lt-lg="bg-gradient-to-t right-0 p10"
      lg="px25 w-2/3 bg-gradient-to-r"
      from-black via-black to-transparent
      z-index="10"
    >
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

.cover-image {
  width: 100%; /* Ensure the image covers the entire area */
  height: 100%;
  object-fit: cover; /* Cover the area without distortion */
  z-index: 0; /* Ensure it's behind the iframe and overlay */
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

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  padding: 2rem; /* Add padding for overlay content */
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align items to the bottom */
  color: white; /* Text color */
  z-index: 10; /* Ensure it is above everything */
}

.title {
  font-size: 2rem;
  margin: 0; /* Remove default margins */
  line-height: 1.2; /* Adjust line height */
}

.meta {
  display: flex; /* Flex container for meta information */
  flex-wrap: wrap; /* Allow wrapping */
  gap: 0.5rem; /* Space between items */
  margin-top: 0.5rem; /* Margin above meta section */
}

.description {
  margin-top: 0.5rem; /* Space above description */
  opacity: 0.8; /* Adjust opacity for readability */
  line-clamp: 3; /* Limit lines */
}

.trailer-button {
  margin-top: 1rem; /* Space above trailer button */
}

.trailer-btn {
  display: flex; /* Flex container for button */
  gap: 0.5rem; /* Space between icon and text */
  padding: 0.5rem 1rem; /* Padding inside button */
  background-color: rgba(255, 255, 255, 0.2); /* Semi-transparent background */
  color: white; /* Button text color */
  border: none; /* Remove border */
  border-radius: 5px; /* Rounded corners */
}

.mobile-trailer-btn {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 66.67%; /* Two-thirds of height for mobile button */
  display: flex; /* Flex container for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

.trailer-btn-mobile {
  font-size: 2.5rem; /* Adjust size for mobile */
  opacity: 0.5; /* Adjust opacity */
  transition: opacity 0.3s ease; /* Smooth transition */
}

.trailer-btn-mobile:hover {
  opacity: 1; /* Full opacity on hover */
}
</style>