<template>
    <SectionTemplate :section-data="props.sectionData">
        <ul class="experience-list">
            <RevealOnScroll v-for="(item, index) in orderedItems"
                            :key="item['id']"
                            tag="li"
                            class="experience-row hover-glow"
                            :delay="index * 70">
                <span class="experience-year">{{ _getItemYear(item) }}</span>

                <span class="experience-icon-wrap" aria-hidden="true">
                    <i :class="_getItemIcon(item)"/>
                </span>

                <div class="experience-details">
                    <p class="experience-title" v-html="item['locales']['title']"/>
                    <p class="experience-company">{{ _getPlaceName(item) }}</p>
                </div>
            </RevealOnScroll>
        </ul>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import {computed} from "vue"
import {useUtils} from "../../../composables/utils.js"
import {getTimelineSectionIcon, normalizeFaIcon} from "../../../composables/icons.js"

const utils = useUtils()

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

/**
 * @return {Object[]}
 */
const orderedItems = computed(() => {
    return utils.reverseArray(props.sectionData['content']['items'])
})

/**
 * @param {Object} item
 * @return {string}
 * @private
 */
const _getItemYear = (item) => {
    const period = item['period']
    const date = utils.parseDate(period[0])
    const year = String(date.getFullYear())

    if (period[0] === period[1]) {
        const month = date.toLocaleString('en-US', { month: 'short' })
        return `${month} ${year}`
    }

    return year
}

/**
 * @param {Object} item
 * @return {string}
 * @private
 */
const _getItemIcon = (item) => {
    return normalizeFaIcon(item['faIcon'])
        ?? getTimelineSectionIcon(props.sectionData['id'])
}

/**
 * @param {Object} item
 * @return {string}
 * @private
 */
const _getPlaceName = (item) => {
    if (!item['place']) {
        return ''
    }

    return item['place']['locales']['name'] ?? item['place']['locales']?.['name'] ?? ''
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.experience-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.experience-row {
    display: grid;
    grid-template-columns: 4.5rem 2rem 1fr;
    gap: 1rem 1.25rem;
    align-items: start;
    padding: 1.25rem 0.75rem;
    margin: 0 -0.75rem;
    border-top: 1px solid var(--color-border);
    border-radius: 6px;

    &:last-child {
        border-bottom: 1px solid var(--color-border);
    }

    @include media-breakpoint-down(sm) {
        grid-template-columns: 3.5rem 1.75rem 1fr;
        gap: 0.75rem 1rem;
    }
}

.experience-year {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-muted);
    padding-top: 0.15rem;
}

.experience-icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    margin-top: -0.1rem;
    font-size: 0.8rem;
    color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.1);
    border: 1px solid rgba(var(--color-primary-rgb), 0.22);
    border-radius: 6px;
}

.experience-details {
    min-width: 0;
}

.experience-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-heading);
}

.experience-company {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    color: var(--color-text-muted);
}
</style>
