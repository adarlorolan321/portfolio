<template>
    <div v-if="language.supportsMultipleLanguages()" class="language-picker">
        
        <!-- Bootstrap Dropdown -->
        <div class="dropdown">
            <!-- Dropdown Toggle Button -->
            <button class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <!-- Selected Flag Icon -->
                <img :alt="selectedLanguage['name']"
                     :src="selectedLanguage['flagUrl']"
                     class="img-fluid img-selected-language-flag">

                <!-- Selected Language Name -->
                <span class="dropdown-item-label d-none d-lg-inline">
                    {{selectedLanguage['name']}}
                </span>
            </button>

            <!-- Dropdown Menu -->
            <ul class="dropdown-menu">
                <!-- Dropdown Item -->
                <li v-for="lang in availableLanguages">
                    <button class="dropdown-item" @click="_onLanguageSelected(lang)">
                        <!-- Language Flag Icon -->
                        <img :alt="lang['name']"
                             :src="lang['flagUrl']"
                             class="img-fluid img-language-flag">

                        <!-- Language Name -->
                        <span class="dropdown-item-label">
                            {{lang['name']}}
                        </span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import Dropdown from '/node_modules/bootstrap/js/src/dropdown'
import {useLanguage} from "../../composables/language.js"
import {computed} from "vue"

const language = useLanguage()

/**
 * @type {ComputedRef<Object>}
 */
const selectedLanguage = computed(() => {
    return language.getSelectedLanguage()
})

/**
 * @type {ComputedRef<Object[]>}
 */
const availableLanguages = computed(() => {
    return language.getAvailableLanguages()
})

/**
 * @param {Object} lang
 * @private
 */
const _onLanguageSelected = async (lang) => {
    if (lang['id'] === selectedLanguage.value?.['id']) {
        return
    }

    await language.selectLanguage(lang)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.dropdown-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.25rem 0.45rem;
    opacity: 0.95;
    background-color: var(--color-bg-elevated);
    color: var(--color-text-muted);

    &:hover {
        opacity: 1;
        color: var(--color-primary);
        border-color: rgba(var(--color-primary-rgb), 0.35);
    }
}

li {
    &:not(:last-child) {
        border-bottom: 1px solid var(--color-border);
    }
}

.dropdown-menu {
    padding: 0.25rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background-color: var(--color-bg-elevated);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 0.55rem 0.75rem;
    border-radius: 6px;
    background-color: transparent;
    color: var(--color-text);

    &:hover {
        background-color: rgba(var(--color-primary-rgb), 0.08);
        color: var(--color-heading);
    }
}

.dropdown-item-label {
    margin-left: 8px;
    font-family: $custom-subheadings-font-family;
    font-size: 0.9rem;
}

.img-language-flag {
    width: 20px;
    height: 20px;
}

.img-selected-language-flag {
    width: 24px;
    height: 24px;
}
</style>