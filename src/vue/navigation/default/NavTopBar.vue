<template>
    <header class="nav-topbar nav-topbar-enter">
        <div class="nav-topbar-inner">
            <button class="nav-topbar-brand" @click="_onLinkClicked('about')">
                {{ _getFirstName() }}
            </button>

            <nav class="nav-topbar-links">
                <button v-for="section in navSections"
                        :key="section['id']"
                        :class="_getLinkClassList(section)"
                        @click="_onLinkClicked(section['id'])">
                    {{ data.getString(section['id']) }}
                </button>
            </nav>

            <div class="nav-topbar-actions">
                <ThemeToggle />
                <LanguagePicker class="nav-topbar-lang"/>
            </div>
        </div>
    </header>
</template>

<script setup>
import LanguagePicker from "../../widgets/LanguagePicker.vue"
import ThemeToggle from "../../widgets/ThemeToggle.vue"
import {computed} from "vue"
import {useData} from "../../../composables/data.js"
import {useNavigation} from "../../../composables/navigation.js"

const emit = defineEmits(['linkClicked'])
const data = useData()
const navigation = useNavigation()

/**
 * @type {ComputedRef<Object[]>}
 */
const navSections = computed(() => {
    return data.getSections().filter(section => section['id'] !== 'about')
})

/**
 * @return {string}
 * @private
 */
const _getFirstName = () => {
    const profile = data.getProfile()
    if (!profile?.['name']) {
        return 'Portfolio'
    }

    return profile['name'].split(' ')[0]
}

/**
 * @param {Object} section
 * @return {string}
 * @private
 */
const _getLinkClassList = (section) => {
    let classList = 'nav-topbar-link'
    if (navigation.isSectionActive(section['id'])) {
        classList += ' nav-topbar-link-active'
    }

    return classList
}

/**
 * @param {String} sectionId
 * @private
 */
const _onLinkClicked = (sectionId) => {
    emit('linkClicked', sectionId)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.nav-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: $nav-topbar-height;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-nav-bg);
    backdrop-filter: blur(12px);
}

.nav-topbar-inner {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    height: 100%;
    max-width: $max-content-width;
    margin: 0 auto;
    padding: 0 1.5rem;
}

.nav-topbar-brand {
    flex-shrink: 0;
    border: none;
    background: none;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-heading);
    cursor: pointer;

    &:hover {
        color: var(--color-primary);
    }
}

.nav-topbar-links {
    display: flex;
    flex: 1;
    gap: 0.25rem;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.nav-topbar-link {
    flex-shrink: 0;
    border: none;
    background: none;
    padding: 0.35rem 0.65rem;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: lowercase;
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: 4px;
    transition: color 0.15s, background-color 0.15s;

    &:hover {
        color: var(--color-heading);
    }

    &-active {
        color: var(--color-primary);
    }
}

.nav-topbar-actions {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 0.5rem;
}

.nav-topbar-lang {
    flex-shrink: 0;
}

@include media-breakpoint-down($navigation-sidebar-breakpoint) {
    .nav-topbar {
        display: none;
    }
}
</style>
