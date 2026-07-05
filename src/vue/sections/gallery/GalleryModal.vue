<template>
    <Teleport to="body">
        <div class="modal modal-xl fade"
             :id="UNIQUE_ID"
             tabindex="-1"
             :aria-labelledby="`${UNIQUE_ID}-label`"
             aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div v-if="props.project" class="modal-content project-modal">
                <button class="project-modal-close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fa-solid fa-xmark" aria-hidden="true"/>
                </button>

                <div class="modal-body project-modal-body">
                    <header class="project-modal-header">
                        <div class="project-modal-brand">
                            <ImageView v-if="props.project['logoUrl']"
                                       :src="props.project['logoUrl']"
                                       :alt="props.project['title']"
                                       :spinner-enabled="true"
                                       class="project-modal-logo"/>
                            <div class="project-modal-heading">
                                <p v-if="props.project['badge']" class="project-modal-badge">{{ props.project['badge'] }}</p>
                                <h2 :id="`${UNIQUE_ID}-label`" class="project-modal-title">{{ props.project['title'] }}</h2>
                            </div>
                        </div>

                        <div v-if="props.project['links']?.length" class="project-modal-actions">
                            <a v-for="(link, index) in props.project['links']"
                               :key="index"
                               :href="link['href']"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="project-modal-link">
                                <i :class="link['faIcon'] || 'fa-solid fa-arrow-up-right-from-square'" aria-hidden="true"/>
                                {{ _getLinkLabel(link) }}
                            </a>
                        </div>
                    </header>

                    <div v-if="props.project['locales']?.['tags']?.length" class="project-modal-tags">
                        <span v-for="(tag, index) in props.project['locales']['tags']"
                              :key="index"
                              class="project-modal-tag">
                            {{ tag }}
                        </span>
                    </div>

                    <section class="project-modal-section">
                        <h3 class="project-modal-section-title">
                            <i class="fa-solid fa-file-lines" aria-hidden="true"/>
                            {{ data.getString('aboutProject') }}
                        </h3>
                        <div class="project-modal-description"
                             v-html="props.project['locales']['description']"/>
                    </section>

                    <section v-if="props.project['images']?.length" class="project-modal-section">
                        <h3 class="project-modal-section-title">
                            <i class="fa-solid fa-images" aria-hidden="true"/>
                            {{ data.getString('quickLook') }}
                        </h3>
                        <div class="project-modal-gallery">
                            <button v-for="(image, index) in props.project['images']"
                                    :key="index"
                                    type="button"
                                    class="project-modal-shot"
                                    @click="previewImage = image">
                                <ImageView :src="image.src"
                                           :alt="image.alt"
                                           :spinner-enabled="true"
                                           class="project-modal-shot-img"/>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </div>
    </Teleport>

    <Teleport to="body">
        <div v-if="previewImage"
             class="project-preview-overlay"
             @click="previewImage = null">
            <img :src="previewImage.src"
                 :alt="previewImage.alt"
                 @click.stop>
            <button class="project-preview-close" @click="previewImage = null" aria-label="Close preview">
                <i class="fa-solid fa-xmark" aria-hidden="true"/>
            </button>
        </div>
    </Teleport>
</template>

<script setup>
import {onMounted, ref} from "vue"
import {useData} from "../../../composables/data.js"
import Modal from "/node_modules/bootstrap/js/src/modal"
import ImageView from "../../widgets/ImageView.vue"

/**
 * @property {Object} project
 */
const props = defineProps({
    project: Object
})

const data = useData()

const UNIQUE_ID = "gallery-modal"
let bsModal = null
const previewImage = ref(null)

/**
 * @public
 */
const display = () => {
    previewImage.value = null

    if (!bsModal) {
        return
    }

    bsModal.show()
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

    return 'Visit site'
}

onMounted(() => {
    const elModal = document.getElementById(UNIQUE_ID)

    if (elModal) {
        bsModal = new Modal(elModal, {})
    }
})

defineExpose({
    display
})
</script>

<style lang="scss">
@import "/src/scss/_theming.scss";

#gallery-modal {
    .modal-content.project-modal {
        background: var(--color-bg-elevated);
        border: 1px solid var(--color-border);
        color: var(--color-text);
    }

    .modal-backdrop {
        --bs-backdrop-opacity: 0.72;
    }
}
</style>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.project-modal {
    position: relative;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    overflow: hidden;
}

.project-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    font-size: 0.95rem;
    color: var(--color-text-muted);
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;

    &:hover {
        color: var(--color-primary);
        border-color: rgba(var(--color-primary-rgb), 0.35);
    }
}

.project-modal-body {
    padding: 1.75rem 1.5rem 1.5rem;

    @include media-breakpoint-up(lg) {
        padding: 2rem 2rem 1.75rem;
    }
}

.project-modal-header {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-right: 2.5rem;
    margin-bottom: 1.25rem;

    @include media-breakpoint-up(md) {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
    }
}

.project-modal-brand {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.project-modal-logo {
    flex-shrink: 0;
    width: 3.5rem;
    height: 3.5rem;
    padding: 0.5rem;
    object-fit: contain;
    background: rgba(var(--color-primary-rgb), 0.08);
    border: 1px solid rgba(var(--color-primary-rgb), 0.18);
    border-radius: 12px;
}

.project-modal-heading {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.project-modal-badge {
    margin: 0;
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-primary);
}

.project-modal-title {
    margin: 0;
    font-size: clamp(1.25rem, 2.5vw, 1.65rem);
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-heading);
    letter-spacing: -0.02em;
}

.project-modal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.project-modal-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.85rem;
    font-size: 0.78rem;
    font-weight: 500;
    text-transform: lowercase;
    color: var(--color-heading);
    text-decoration: none;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
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

.project-modal-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
}

.project-modal-tag {
    padding: 0.22rem 0.5rem;
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-size: 0.68rem;
    color: var(--color-text-muted);
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    text-transform: lowercase;
}

.project-modal-section {
    &:not(:last-child) {
        margin-bottom: 1.75rem;
    }
}

.project-modal-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.85rem;
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: lowercase;
    color: var(--color-heading);

    i {
        font-size: 0.75rem;
        color: var(--color-primary);
    }
}

.project-modal-description {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--color-text-muted);

    :deep(b),
    :deep(strong) {
        color: var(--color-heading);
        font-weight: 600;
    }
}

.project-modal-gallery {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @include media-breakpoint-up(lg) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

.project-modal-shot {
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-bg-card);
    overflow: hidden;
    cursor: zoom-in;
    transition: border-color 0.2s ease, transform 0.2s ease;

    &:hover {
        border-color: rgba(var(--color-primary-rgb), 0.35);
        transform: translateY(-2px);
    }
}

.project-modal-shot-img {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    object-position: top center;
}

.project-preview-overlay {
    position: fixed;
    inset: 0;
    z-index: 1060;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.88);
    backdrop-filter: blur(6px);

    img {
        max-width: min(92vw, 1200px);
        max-height: 85vh;
        border-radius: 12px;
        border: 1px solid var(--color-border);
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
    }
}

.project-preview-close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.1rem;
    color: var(--color-heading);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        color: var(--color-primary);
    }
}
</style>
