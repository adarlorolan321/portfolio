<template>
    <div class="nav-tabs-wrapper">
        <nav class="nav-tabs">
            <button v-for="category in data.getCategories()"
                    :key="category['id']"
                    type="button"
                    :class="_getNavTabClassList(category)"
                    @click="_onLinkClicked(category)">
                <i class="nav-tab-button-icon" :class="category['faIcon']"/>
                <span class="nav-tab-button-label">{{ data.getString(category['id']) }}</span>
            </button>
        </nav>
    </div>
</template>

<script setup>
import {useData} from "../../../composables/data.js"
import {useNavigation} from "../../../composables/navigation.js"

const emit = defineEmits(['linkClicked'])
const data = useData()
const navigation = useNavigation()

/**
 * @param {Object} category
 * @private
 */
const _getNavTabClassList = (category) => {
    let classList = 'nav-tab-button'

    if (navigation.isCategoryActive(category['id'])) {
        classList += ' nav-tab-button-selected'
    }

    return classList
}

/**
 * @param {Object} category
 * @private
 */
const _onLinkClicked = (category) => {
    emit('linkClicked', category['id'])
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.nav-tabs-wrapper {
    height: calc(#{$nav-tabs-height} + env(safe-area-inset-bottom, 0px));
    width: 100vw;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    background-color: var(--color-nav-bg);
    border-top: 1px solid var(--color-border);
    backdrop-filter: blur(12px);
}

.nav-tabs {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: $nav-tabs-height;
    width: 100%;
}

.nav-tab-button {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    min-width: 0;
    padding: 0.35rem 0.25rem;
    cursor: pointer;
    background-color: transparent;
    border: none;
    transition: color 0.2s ease;
}

.nav-tab-button-icon {
    font-size: 0.95rem;
    color: var(--color-text-muted);
    transition: color 0.2s ease, transform 0.2s ease;
}

.nav-tab-button-label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.62rem;
    font-weight: 500;
    text-transform: lowercase;
    letter-spacing: 0.02em;
    color: var(--color-text-muted);
    transition: color 0.2s ease;
}

.nav-tab-button:hover,
.nav-tab-button-selected {
    .nav-tab-button-icon {
        color: var(--color-primary);
    }

    .nav-tab-button-label {
        color: var(--color-primary);
    }
}

.nav-tab-button-selected {
    .nav-tab-button-icon {
        transform: translateY(-1px);
    }
}
</style>
