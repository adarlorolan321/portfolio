<template>
    <nav v-if="props.sections && props.sections.length >= 2" class="nav-pills">
        <button v-for="section in props.sections"
                :key="section['id']"
                type="button"
                :class="_getNavPillClass(section)"
                @click="_onLinkClicked(section)">
            {{ data.getString(section['id']) }}
        </button>
    </nav>
</template>

<script setup>
import {useNavigation} from "../../../composables/navigation.js"
import {useData} from "../../../composables/data.js"

/**
 * @property {Object[]} sections
 */
const props = defineProps({
    sections: Array
})

const data = useData()
const navigation = useNavigation()
const emit = defineEmits(['linkClicked'])

/**
 * @param {Object} section
 * @return {string}
 * @private
 */
const _getNavPillClass = (section) => {
    let classList = 'nav-pill'

    if (navigation.isSectionActive(section['id'])) {
        classList += ' nav-pill-active'
    }

    return classList
}

/**
 * @param {Object} section
 * @private
 */
const _onLinkClicked = (section) => {
    emit('linkClicked', section)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.nav-pills {
    display: flex;
    gap: 0.25rem;
    overflow-x: auto;
    padding: 0.5rem 1rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.nav-pill {
    flex-shrink: 0;
    border: none;
    background: none;
    padding: 0.35rem 0.65rem;
    font-size: 0.78rem;
    font-weight: 500;
    text-transform: lowercase;
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: 4px;
    transition: color 0.15s ease, background-color 0.15s ease;

    &:hover {
        color: var(--color-heading);
    }

    &-active {
        color: var(--color-primary);
        background-color: rgba(var(--color-primary-rgb), 0.1);
    }
}
</style>
