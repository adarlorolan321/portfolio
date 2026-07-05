<template>
    <SectionTemplate :section-data="props.sectionData">
        <div class="stack-pills">
            <RevealOnScroll v-for="(item, index) in visibleItems"
                            :key="item['label']"
                            tag="span"
                            class="stack-pill hover-glow"
                            variant="scale"
                            :delay="index * 40">
                <i :class="_getItemIcon(item)" class="stack-pill-icon" aria-hidden="true"/>
                {{ item['label'] }}
            </RevealOnScroll>
            <RevealOnScroll v-if="overflowCount > 0"
                            tag="span"
                            class="stack-pill stack-pill-more"
                            variant="fade"
                            :delay="visibleItems.length * 40">
                + {{ overflowCount }} {{ data.getString('more') }}
            </RevealOnScroll>
        </div>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import {computed} from "vue"
import {useData} from "../../../composables/data.js"
import {getStackIcon, normalizeFaIcon} from "../../../composables/icons.js"

const data = useData()

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const MAX_VISIBLE = 12

/**
 * @type {ComputedRef<Object[]>}
 */
const allItems = computed(() => {
    return props.sectionData['content']['items'] ?? []
})

/**
 * @type {ComputedRef<Object[]>}
 */
const visibleItems = computed(() => {
    return allItems.value.slice(0, MAX_VISIBLE)
})

/**
 * @type {ComputedRef<number>}
 */
const overflowCount = computed(() => {
    return Math.max(0, allItems.value.length - MAX_VISIBLE)
})

/**
 * @param {Object} item
 * @return {string}
 */
const _getItemIcon = (item) => {
    return normalizeFaIcon(item['faIcon']) ?? getStackIcon(item['label'])
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.stack-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.stack-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-text-muted);
    background: var(--color-bg-card);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    cursor: default;
    transition: color 0.15s, border-color 0.15s, transform 0.2s ease;

    &:hover {
        color: var(--color-heading);
        transform: translateY(-2px);
    }

    &-icon {
        font-size: 0.8rem;
        color: var(--color-primary);
    }

    &-more {
        text-transform: lowercase;
        color: var(--color-primary);
        border-color: transparent;
        background-color: transparent;

        &:hover {
            color: var(--color-primary);
            transform: translateY(-2px);
        }
    }
}
</style>
