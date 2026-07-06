<template>
    <aside class="play-leaderboard" aria-label="High scores">
        <div class="play-leaderboard__header">
            <span class="play-leaderboard__title">{{ locales.highScores }}</span>
            <span v-if="loading" class="play-leaderboard__status">{{ locales.loadingScores }}</span>
        </div>

        <p v-if="!loading && !records.length" class="play-leaderboard__empty">
            {{ locales.noScores }}
        </p>

        <ol v-else class="play-leaderboard__list">
            <li v-for="(record, index) in records"
                :key="record.id"
                class="play-leaderboard__row">
                <span class="play-leaderboard__rank">{{ formatRank(index) }}</span>
                <span class="play-leaderboard__command" :title="record.message">{{ record.message }}</span>
                <span class="play-leaderboard__score">{{ record.score }} {{ locales.wpm }}</span>
            </li>
        </ol>
    </aside>
</template>

<script setup>
/**
 * @property {Array} records
 * @property {Object} locales
 * @property {Boolean} loading
 */
defineProps({
    records: {
        type: Array,
        default: () => []
    },
    locales: {
        type: Object,
        default: () => ({})
    },
    loading: {
        type: Boolean,
        default: false
    }
})

/**
 * @param {number} index
 * @return {string}
 */
const formatRank = (index) => {
    return String(index + 1).padStart(2, '0')
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.play-leaderboard {
    --arcade-font-title: 'Press Start 2P', monospace;
    --arcade-font-body: 'VT323', monospace;

    padding: 0.85rem;
    background: linear-gradient(180deg, #1f0d29 0%, #14081c 100%);
    border: 3px solid #3a184d;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.35);
}

.play-leaderboard__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.play-leaderboard__title {
    font-family: var(--arcade-font-title);
    font-size: 0.48rem;
    letter-spacing: 0.08em;
    color: #00f5ff;
    text-shadow: 0 0 8px rgba(0, 245, 255, 0.45);
}

.play-leaderboard__status,
.play-leaderboard__empty {
    margin: 0;
    font-family: var(--arcade-font-body);
    font-size: 1.2rem;
    color: #8b6a9d;
    letter-spacing: 0.06em;
}

.play-leaderboard__list {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.play-leaderboard__row {
    display: grid;
    grid-template-columns: 2rem 1fr auto;
    gap: 0.65rem;
    align-items: center;
    padding: 0.45rem 0.55rem;
    background: rgba(7, 2, 13, 0.85);
    border: 1px solid #291334;
}

.play-leaderboard__rank {
    font-family: var(--arcade-font-title);
    font-size: 0.42rem;
    color: #ff2bd6;
}

.play-leaderboard__command {
    overflow: hidden;
    font-family: var(--arcade-font-body);
    font-size: 1.15rem;
    line-height: 1.2;
    color: #d8c4e6;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.play-leaderboard__score {
    font-family: var(--arcade-font-body);
    font-size: 1.2rem;
    color: #ffe566;
    white-space: nowrap;
}
</style>
