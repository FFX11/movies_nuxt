<script setup lang="ts">
import type { Media } from '~/types';
import { ref, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = withDefaults(defineProps<{
  item: Media
}>(), {
  item: () => ({} as Media),
});

const router = useRouter();
const route = useRoute();

// Extract the tmdbId and seasonNumber from the route path
const fullPath = route.path.split('/'); // Split the path into parts
const tmdbId = fullPath[2]; // Get the value after 'tv/'
const seasonNumberFromUrl = Number(fullPath[3]); // Get the value after tmdbId
const episodeNumberFromUrl = Number(fullPath[4]); // Get the value after seasonNumber

// Reactive state to track the selected (expanded) season and the selected episode
const expandedSeasonNumber = ref<number | null>(seasonNumberFromUrl || null);
const selectedEpisodeNumber = ref<number | null>(episodeNumberFromUrl || null);

// Function to toggle the expansion of seasons
const toggleSeason = (seasonNumber: number) => {
  if (expandedSeasonNumber.value === seasonNumber) {
    expandedSeasonNumber.value = null; // Collapse the season if already expanded
    selectedEpisodeNumber.value = null; // Clear selected episode when collapsing
  } else {
    expandedSeasonNumber.value = seasonNumber; // Expand the selected season
    selectedEpisodeNumber.value = 1; // Automatically select the first episode
    router.push(`/tv/${tmdbId}/${seasonNumber}/1`); // Update the URL with the first episode
  }
};

// Function to generate episodes dynamically based on the episode count
const getEpisodes = (season: any) => {
  return Array.from({ length: season.episode_count }, (_, i) => ({
    episode_number: i + 1,
    name: `Episode ${i + 1}`,
  }));
};

// Function to handle episode selection and update the URL
const playEpisode = (seasonNumber: number, episodeNumber: number) => {
  console.log(`Play Season ${seasonNumber}, Episode ${episodeNumber}`);
  selectedEpisodeNumber.value = null; // Clear the highlight first
  // Update the URL
  router.push(`/tv/${tmdbId}/${seasonNumber}/${episodeNumber}`);
  
  // After updating the URL, set the selected episode
  nextTick(() => {
    selectedEpisodeNumber.value = episodeNumber; // Set the selected episode
  });
};

// Computed property to check for specials and filter them
const hasSpecials = computed(() => {
  return props.item.seasons?.some(season => season.season_number === 0);
});

// Filter out special seasons if they exist
const seasonsFiltered = computed(() => {
  return hasSpecials.value
    ? props.item.seasons?.filter(season => season.season_number > 0)
    : props.item.seasons;
});
</script>

<template>
  <div class="content-tab">
    <!-- Season List -->
    <h2 class="section-title">Seasons</h2>
    <div class="season-container">
      <ul class="season-list">
        <li 
          v-for="season in seasonsFiltered" 
          :key="season.id" 
          class="season-item"
          @click="toggleSeason(season.season_number)"
        >
          <span :class="{'active': expandedSeasonNumber === season.season_number}">
            {{ season.season_number }} <!-- Show season number instead of name -->
          </span>
        </li>
      </ul>
    </div>

    <!-- Episodes List -->
    <div v-if="expandedSeasonNumber">
      <div class="episode-title">
        <strong>Episodes for Season {{ expandedSeasonNumber }}</strong>
      </div>
      <div class="episode-container">
        <div 
          v-for="episode in getEpisodes(seasonsFiltered?.find(season => season.season_number === expandedSeasonNumber))" 
          :key="episode.episode_number" 
          class="episode-card"
          @click="playEpisode(expandedSeasonNumber, episode.episode_number)"
          :class="{'selected': selectedEpisodeNumber === episode.episode_number}"
        >
          {{ episode.episode_number }} <!-- Show only episode number -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add futuristic styling */
.content-tab {
  background-color: #111;
  padding: 2rem;
  border-radius: 10px;
  color: white;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #0ff;
}

.season-container {
  overflow-x: auto; /* Allow horizontal scrolling if needed */
}

.season-list {
  list-style: none;
  padding: 0;
  display: flex; /* Display seasons in a row */
  flex-wrap: nowrap; /* Prevent wrapping */
  gap: 0.5rem; /* Reduced space between seasons */
}

.season-item {
  cursor: pointer;
  color: #0ff;
  flex: 0 0 auto; /* Prevent flex shrinking */
  padding: 0.25rem 0.5rem; /* Smaller padding for season items */
  font-size: 1.2rem; /* Smaller font size */
  border: 1px solid transparent; /* Border for hover effect */
  transition: border 0.3s ease;
}

.season-item:hover {
  border: 1px solid #0ff; /* Border change on hover */
}

.episode-container {
  display: flex; /* Display episodes in a row */
  flex-wrap: wrap; /* Allow wrapping */
  gap: 0.5rem; /* Space between episode cards */
  margin-top: 1rem; /* Space above episodes */
}

.episode-title {
  font-size: 1.25rem; /* Slightly larger for title */
  color: #0ff;
  margin-bottom: 0.5rem;
}

.episode-card {
  background-color: #222;
  padding: 0.5rem; /* Consistent padding for episodes */
  border-radius: 8px;
  width: calc(20% - 0.5rem); /* Adjust width for smaller cards */
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  font-size: 1.2rem; /* Smaller font size for episode numbers */
}

.episode-card:hover {
  transform: scale(1.05);
}

/* Highlight the selected episode */
.episode-card.selected {
  background-color: #444; /* Change background for selected episode */
  border: 2px solid #0ff; /* Add a border for better visibility */
}
</style>
