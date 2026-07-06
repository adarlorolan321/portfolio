<template>
    <SectionTemplate :section-data="props.sectionData">
        <div class="play-arcade">
            <RevealOnScroll class="play-arcade__main">
                <div class="play-arcade__game-row">
                    <TypingSprint :content="props.sectionData.content"
                                    @completed="onGameCompleted"/>
                    <PlayLeaderboard :records="leaderboard"
                                     :locales="locales"
                                     :loading="leaderboardLoading"/>
                </div>
            </RevealOnScroll>

            <div class="play-arcade__soon">
                <RevealOnScroll v-for="(cabinet, index) in soonCabinets"
                                :key="cabinet.id"
                                class="play-cabinet play-cabinet--locked"
                                tag="article"
                                :delay="120 + index * 80">
                    <div class="play-cabinet__screen">
                        <span class="play-cabinet__lock" aria-hidden="true">?</span>
                        <h3 class="play-cabinet__title">{{ cabinet.title }}</h3>
                        <p class="play-cabinet__soon">{{ locales.comingSoon }}</p>
                    </div>
                </RevealOnScroll>
            </div>
        </div>
    </SectionTemplate>
</template>

<script setup>
import {computed, onMounted, ref} from "vue"
import {loadPlayRecords, savePlayRecord} from "../../../composables/playRecords.js"
import SectionTemplate from "../_templates/SectionTemplate.vue"
import PlayLeaderboard from "./PlayLeaderboard.vue"
import TypingSprint from "./TypingSprint.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const leaderboard = ref([])
const leaderboardLoading = ref(true)

/**
 * @type {import('vue').ComputedRef<Object>}
 */
const locales = computed(() => {
    return props.sectionData?.content?.locales ?? {}
})

/**
 * @type {import('vue').ComputedRef<Array>}
 */
const soonCabinets = computed(() => {
    return [
        {id: 'memory', title: locales.value.memoryTitle},
        {id: 'snake', title: locales.value.snakeTitle}
    ]
})

/**
 * @return {Promise<void>}
 */
const refreshLeaderboard = async () => {
    leaderboardLoading.value = true

    try {
        leaderboard.value = await loadPlayRecords(10, 'score')
    } catch {
        leaderboard.value = []
    } finally {
        leaderboardLoading.value = false
    }
}

/**
 * @param {{message: string, score: number}} payload
 * @return {Promise<void>}
 */
const onGameCompleted = async (payload) => {
    try {
        await savePlayRecord(payload)
    } catch {
        // API unavailable in plain Vite dev — local best score still works.
    }

    await refreshLeaderboard()
}

onMounted(() => {
    refreshLeaderboard()
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.play-arcade {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.play-arcade__game-row {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
}

.play-arcade__soon {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}

.play-cabinet {
    --arcade-font-title: 'Press Start 2P', monospace;
    --arcade-font-body: 'VT323', monospace;

    padding: 0.75rem;
    background: linear-gradient(180deg, #1f0d29 0%, #14081c 100%);
    border: 3px solid #3a184d;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.35);
    opacity: 0.72;
}

.play-cabinet__screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    min-height: 6.5rem;
    padding: 1rem;
    background: #07020d;
    border: 2px solid #291334;
}

.play-cabinet__lock {
    font-family: var(--arcade-font-title);
    font-size: 0.85rem;
    color: #5f3d72;
}

.play-cabinet__title {
    margin: 0;
    font-family: var(--arcade-font-title);
    font-size: 0.45rem;
    line-height: 1.6;
    letter-spacing: 0.06em;
    text-align: center;
    color: #8b6a9d;
}

.play-cabinet__soon {
    margin: 0;
    font-family: var(--arcade-font-body);
    font-size: 1.1rem;
    letter-spacing: 0.12em;
    color: #6d4f82;
}

@include media-breakpoint-down(lg) {
    .play-arcade__game-row {
        grid-template-columns: 1fr;
    }
}

@include media-breakpoint-down(sm) {
    .play-arcade__soon {
        grid-template-columns: 1fr;
    }
}
</style>
