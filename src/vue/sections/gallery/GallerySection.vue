<template>
    <SectionTemplate :section-data="props.sectionData">
        <div class="gallery-section">
            <div class="gallery-toolbar">
                <p class="gallery-count">
                    <span class="gallery-count-value">{{ projectCount }}</span>
                    {{ data.getString('projects') }}
                </p>
                <FilterTabs class="gallery-filters" :items="tabItems" @selected="_onFilterTabSelected"/>
            </div>

            <GalleryGrid :items="filteredResults"
                         :selected-category-id="selectedCategoryId"
                         @open="_onProjectOpened"/>
        </div>
    </SectionTemplate>

    <GalleryModal ref="modal" :project="selectedProject" />
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import {computed, ref} from "vue"
import {useData} from "../../../composables/data.js"
import FilterTabs from "../../widgets/FilterTabs.vue"
import GalleryGrid from "./GalleryGrid.vue"
import GalleryModal from "./GalleryModal.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const data = useData()

const selectedCategoryId = ref(null)
const selectedProject = ref(null)
const modal = ref(null)

/**
 * @type {ComputedRef<Array>}
 */
const tabItems = computed(() => {
    const items = [{
        id: 'all',
        label: data.getString('all')
    }]

    const subcategories = props.sectionData['content']['subcategories']
    for (const subcategory of subcategories) {
        items.push({
            id: subcategory['id'],
            label: subcategory['locales']['title']
        })
    }

    return items
})

/**
 * @type {ComputedRef<Array>}
 */
const filteredResults = computed(() => {
    const filteredItems = []
    const itemsByCategory = props.sectionData['content']['items']
    const selectedCategoryIdValue = selectedCategoryId.value

    for (const subcategory of props.sectionData['content']['subcategories']) {
        const subcategoryId = subcategory['id']
        const subcategoryItems = itemsByCategory[subcategoryId]

        for (const itemData of subcategoryItems) {
            const isVisible = !selectedCategoryIdValue || selectedCategoryIdValue === 'all' || selectedCategoryIdValue === subcategoryId

            filteredItems.push({
                data: itemData,
                subcategory: subcategory,
                visible: isVisible
            })
        }
    }

    return filteredItems
})

/**
 * @type {import('vue').ComputedRef<number>}
 */
const projectCount = computed(() => {
    return filteredResults.value.filter((item) => item.visible).length
})

/**
 * @param {String} categoryId
 * @private
 */
const _onFilterTabSelected = (categoryId) => {
    selectedCategoryId.value = categoryId
}

/**
 * @param {Object} project
 * @private
 */
const _onProjectOpened = (project) => {
    selectedProject.value = project
    modal.value.display()
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.gallery-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.gallery-toolbar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;

    @include media-breakpoint-up(md) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
    }
}

.gallery-count {
    margin: 0;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    text-transform: lowercase;
    white-space: nowrap;
}

.gallery-count-value {
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-weight: 600;
    color: var(--color-primary);
}

.gallery-filters {
    :deep(.filter-tabs) {
        text-align: left;

        @include media-breakpoint-up(md) {
            text-align: right;
        }
    }

    :deep(.btn-group) {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 0.4rem;
        min-width: 0;
        width: 100%;

        @include media-breakpoint-up(md) {
            justify-content: flex-end;
            width: auto;
        }
    }

    :deep(.btn) {
        flex: 1 1 auto;
        padding: 0.35rem 0.85rem;
        font-size: 0.76rem;
        text-transform: lowercase;
        border-radius: 6px;

        @include media-breakpoint-up(sm) {
            flex: 0 0 auto;
        }
    }
}
</style>
