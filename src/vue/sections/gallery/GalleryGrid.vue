<template>
    <div class="project-grid">
        <RevealOnScroll v-for="(item, index) in displayedItems"
                        :key="item.data['id']"
                        tag="article"
                        class="project-card hover-lift"
                        :class="{
                            'project-card--featured': _isFeatured(item, index),
                            'project-card--compact': !_isFeatured(item, index)
                        }"
                        :delay="index * 70"
                        @click="_onItemClicked(item)">

            <div class="project-card-inner">
                <div class="project-preview">
                    <div class="project-browser" aria-hidden="true">
                        <div class="project-browser-bar">
                            <span class="project-browser-dot"/>
                            <span class="project-browser-dot"/>
                            <span class="project-browser-dot"/>
                            <span class="project-browser-url">{{ _getPreviewUrl(item.data) }}</span>
                        </div>
                        <div class="project-browser-screen">
                            <ImageView v-if="_getPreviewImage(item.data)"
                                       :src="_getPreviewImage(item.data)"
                                       :alt="item.data['title']"
                                       class="project-screenshot"/>
                            <div v-else class="project-screenshot-fallback">
                                <i :class="_getFallbackIcon(item.data)" aria-hidden="true"/>
                            </div>
                        </div>
                    </div>
                    <div class="project-preview-shine"/>
                </div>

                <div class="project-body">
                    <div class="project-meta">
                        <span class="project-index">{{ _formatIndex(index) }}</span>
                        <span v-if="item.data['badge']" class="project-badge">{{ item.data['badge'] }}</span>
                        <span v-if="item.subcategory" class="project-type">{{ item.subcategory['locales']['title'] }}</span>
                    </div>

                    <div class="project-title-row">
                        <div v-if="item.data['logoUrl']" class="project-logo">
                            <ImageView :src="item.data['logoUrl']"
                                       :alt="item.data['title']"
                                       class="project-logo-img"/>
                        </div>
                        <h3 class="project-title">{{ item.data['title'] }}</h3>
                    </div>

                    <p class="project-description">{{ _getDescriptionExcerpt(item.data) }}</p>

                    <div v-if="_getTags(item.data).length" class="project-tags">
                        <span v-for="(tag, tagIndex) in _getTags(item.data)"
                              :key="tagIndex"
                              class="project-tag">
                            {{ tag }}
                        </span>
                    </div>

                    <div class="project-footer">
                        <span class="project-cta">
                            <span class="project-cta-label">{{ data.getString('viewProject') }}</span>
                            <i class="fa-solid fa-arrow-right project-cta-icon" aria-hidden="true"/>
                        </span>

                        <div v-if="item.data['links']?.length" class="project-links">
                            <a v-for="(link, linkIndex) in item.data['links']"
                               :key="linkIndex"
                               :href="link['href']"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="project-link"
                               :title="_getLinkLabel(link)"
                               @click.stop>
                                <i :class="link['faIcon'] || 'fa-solid fa-arrow-up-right-from-square'" aria-hidden="true"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </RevealOnScroll>
    </div>
</template>

<script setup>
import {computed} from "vue"
import {useData} from "../../../composables/data.js"
import ImageView from "../../widgets/ImageView.vue"

const data = useData()

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
 * @type {import('vue').ComputedRef<Object[]>}
 */
const displayedItems = computed(() => {
    return visibleItems.value.filter((item) => item.visible)
})

/**
 * @param {Object} item
 * @param {number} index
 * @return {boolean}
 * @private
 */
const _isFeatured = (item, index) => {
    return index === 0
}

/**
 * @param {number} index
 * @return {string}
 * @private
 */
const _formatIndex = (index) => {
    return `// ${String(index + 1).padStart(2, '0')}`
}

/**
 * @param {Object} projectData
 * @return {string|null}
 * @private
 */
const _getPreviewImage = (projectData) => {
    return projectData['images']?.[0]?.['src'] ?? null
}

/**
 * @param {Object} projectData
 * @return {string}
 * @private
 */
const _getFallbackIcon = (projectData) => {
    if (projectData['logoUrl']) {
        return 'fa-solid fa-layer-group'
    }

    return 'fa-solid fa-code'
}

/**
 * @param {Object} projectData
 * @return {string}
 * @private
 */
const _getPreviewUrl = (projectData) => {
    const href = projectData['links']?.[0]?.['href']

    if (!href) {
        return 'localhost:3000'
    }

    try {
        const url = new URL(href)
        return url.host.replace(/^www\./, '')
    }
    catch {
        return 'project.app'
    }
}

/**
 * @param {Object} projectData
 * @return {string[]}
 * @private
 */
const _getTags = (projectData) => {
    const tags = projectData['locales']?.['tags'] ?? []
    return tags.slice(0, 4)
}

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
    const limit = 120

    if (plain.length <= limit) {
        return plain
    }

    return plain.slice(0, limit - 3) + '...'
}

/**
 * @param {Object} link
 * @return {string}
 * @private
 */
const _getLinkLabel = (link) => {
    if (link['href']?.includes('play.google')) {
        return 'Google Play'
    }
    if (link['href']?.includes('apps.apple')) {
        return 'App Store'
    }

    return 'Website'
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.project-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @include media-breakpoint-up(lg) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1.35rem;
    }
}

.project-card {
    position: relative;
    border-radius: 12px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    cursor: pointer;
    overflow: hidden;
    transition:
        border-color 0.25s ease,
        box-shadow 0.3s ease,
        transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
            linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.06) 0%, transparent 42%),
            repeating-linear-gradient(
                90deg,
                rgba(var(--color-primary-rgb), 0.03) 0,
                rgba(var(--color-primary-rgb), 0.03) 1px,
                transparent 1px,
                transparent 24px
            );
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    &:hover {
        border-color: rgba(var(--color-primary-rgb), 0.35);
        box-shadow:
            0 16px 40px rgba(0, 0, 0, 0.22),
            0 0 0 1px rgba(var(--color-primary-rgb), 0.08);

        &::before {
            opacity: 1;
        }

        .project-screenshot {
            transform: scale(1.03);
        }

        .project-cta-icon {
            transform: translateX(3px);
        }

        .project-preview-shine {
            opacity: 1;
        }
    }

    &--featured {
        @include media-breakpoint-up(lg) {
            grid-column: 1 / -1;
        }

        .project-card-inner {
            @include media-breakpoint-up(lg) {
                display: grid;
                grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
                align-items: stretch;
            }
        }

        .project-preview {
            @include media-breakpoint-up(lg) {
                min-height: 100%;
            }
        }

        .project-browser-screen {
            aspect-ratio: 16 / 10;

            @include media-breakpoint-up(lg) {
                min-height: 240px;
            }
        }

        .project-body {
            @include media-breakpoint-up(lg) {
                padding: 1.75rem 1.75rem 1.75rem 0.5rem;
                justify-content: center;
            }
        }
    }
}

.project-card-inner {
    position: relative;
    z-index: 1;
    height: 100%;
}

.project-preview {
    position: relative;
    padding: 1rem 1rem 0;
}

.project-browser {
    border: 1px solid var(--color-border);
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    background: var(--color-bg-elevated);
    overflow: hidden;
}

.project-browser-bar {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
    background: rgba(var(--color-primary-rgb), 0.04);
}

.project-browser-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-border);

    &:nth-child(1) { background: #ff5f57; }
    &:nth-child(2) { background: #febc2e; }
    &:nth-child(3) { background: #28c840; }
}

.project-browser-url {
    flex: 1;
    margin-left: 0.35rem;
    padding: 0.2rem 0.55rem;
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-size: 0.62rem;
    color: var(--color-text-muted);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.project-browser-screen {
    position: relative;
    aspect-ratio: 16 / 11;
    overflow: hidden;
    background:
        linear-gradient(180deg, rgba(var(--color-primary-rgb), 0.05), transparent 40%),
        var(--color-bg);
}

.project-screenshot {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-screenshot-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 2rem;
    color: rgba(var(--color-primary-rgb), 0.45);
}

.project-preview-shine {
    position: absolute;
    inset: 1rem 1rem 0;
    border-radius: 10px 10px 0 0;
    background: linear-gradient(120deg, transparent 30%, rgba(var(--color-primary-rgb), 0.08) 50%, transparent 70%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
}

.project-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.1rem 1.25rem 1.25rem;
}

.project-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.45rem 0.65rem;
}

.project-index {
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-size: 0.72rem;
    color: var(--color-primary);
    opacity: 0.9;
}

.project-badge {
    padding: 0.18rem 0.5rem;
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.1);
    border: 1px solid rgba(var(--color-primary-rgb), 0.22);
    border-radius: 4px;
}

.project-type {
    font-size: 0.72rem;
    color: var(--color-text-muted);
    text-transform: lowercase;

    &::before {
        content: "·";
        margin-right: 0.45rem;
        opacity: 0.5;
    }
}

.project-title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.project-logo {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.35rem;
    background: rgba(var(--color-primary-rgb), 0.08);
    border: 1px solid rgba(var(--color-primary-rgb), 0.16);
    border-radius: 8px;
}

.project-logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.project-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-heading);
    letter-spacing: -0.01em;
}

.project-description {
    margin: 0;
    font-size: 0.84rem;
    line-height: 1.65;
    color: var(--color-text-muted);
}

.project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.project-tag {
    padding: 0.2rem 0.45rem;
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-size: 0.68rem;
    color: var(--color-text-muted);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    text-transform: lowercase;
}

.project-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: auto;
    padding-top: 0.35rem;
}

.project-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    font-weight: 500;
    text-transform: lowercase;
    color: var(--color-primary);
}

.project-cta-icon {
    font-size: 0.7rem;
    transition: transform 0.2s ease;
}

.project-links {
    display: flex;
    gap: 0.4rem;
}

.project-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.85rem;
    height: 1.85rem;
    font-size: 0.72rem;
    color: var(--color-text-muted);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    text-decoration: none;
    transition:
        color 0.15s ease,
        border-color 0.15s ease,
        background-color 0.15s ease;

    &:hover {
        color: var(--color-primary);
        border-color: rgba(var(--color-primary-rgb), 0.35);
        background: rgba(var(--color-primary-rgb), 0.08);
    }
}

.project-card--compact {
    .project-browser-screen {
        aspect-ratio: 16 / 9;
    }

    .project-description {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}
</style>
