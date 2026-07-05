<template>
    <div class="project-cards">
        <RevealOnScroll v-for="(item, index) in visibleItems"
                        v-show="item.visible"
                        :key="item.data['id']"
                        tag="article"
                        class="project-card hover-lift"
                        :delay="index * 80"
                        @click="_onItemClicked(item)">

            <div v-if="item.data['badge']" class="project-badge">{{ item.data['badge'] }}</div>
            <p v-if="item.subcategory" class="project-category">{{ item.subcategory['locales']['title'] }}</p>

            <div class="project-card-body">
                <div class="project-icon">
                    <ImageView v-if="item.data['logoUrl']"
                               :src="item.data['logoUrl']"
                               :alt="item.data['title']"
                               class="project-icon-img"/>
                    <i v-else class="fa-solid fa-code project-icon-fallback" aria-hidden="true"/>
                </div>

                <div class="project-info">
                    <h3 class="project-title">{{ item.data['title'] }}</h3>
                    <p class="project-description">{{ _getDescriptionExcerpt(item.data) }}</p>

                    <div v-if="item.data['links']?.length" class="project-links">
                        <a v-for="(link, linkIndex) in item.data['links']"
                           :key="linkIndex"
                           :href="link['href']"
                           target="_blank"
                           class="project-link"
                           @click.stop>
                            {{ _getLinkLabel(link) }} ↗
                        </a>
                    </div>
                </div>
            </div>
        </RevealOnScroll>
    </div>
</template>

<script setup>
import {computed} from "vue"
import ImageView from "../../widgets/ImageView.vue"

/**
 * @property {Object[]} items
 * @property {String} selectedCategoryId
 */
const props = defineProps({
    items: Array,
    selectedCategoryId: String
})

const emit = defineEmits(['open'])

/**
 * @type {import('vue').ComputedRef<Object[]>}
 */
const visibleItems = computed(() => {
    return props.items ?? []
})

/**
 * @param {Object} item
 * @private
 */
const _onItemClicked = (item) => {
    emit('open', item.data)
}

/**
 * @param {Object} projectData
 * @return {string}
 * @private
 */
const _getDescriptionExcerpt = (projectData) => {
    const description = projectData['locales']?.['description'] ?? ''
    const plain = description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

    if (plain.length <= 140) {
        return plain
    }

    return plain.slice(0, 137) + '...'
}

/**
 * @param {Object} link
 * @return {string}
 * @private
 */
const _getLinkLabel = (link) => {
    if (link['href']?.includes('play.google')) {
        return 'google play'
    }
    if (link['href']?.includes('apps.apple')) {
        return 'app store'
    }

    return 'website'
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.project-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.project-card {
    padding: 1.25rem 1.5rem;
    background: var(--color-bg-card);
    backdrop-filter: blur(12px);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: pointer;
}

.project-badge {
    margin-bottom: 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-primary);
}

.project-category {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    color: var(--color-text-muted);
}

.project-card-body {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
}

.project-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    padding: 0.5rem;
    background-color: rgba(var(--color-primary-rgb), 0.08);
    border: 1px solid rgba(var(--color-primary-rgb), 0.18);
    border-radius: 12px;
    overflow: hidden;
}

.project-icon-fallback {
    font-size: 1.25rem;
    color: var(--color-primary);
}

.project-icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.project-info {
    flex: 1;
    min-width: 0;
}

.project-title {
    margin: 0 0 0.5rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-heading);
}

.project-description {
    margin: 0 0 0.75rem;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-text-muted);
}

.project-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.project-link {
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: lowercase;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color 0.15s;

    &:hover {
        color: var(--color-primary);
    }
}
</style>
