<template>
    <div class="nav-header" :style="{ '--nav-mobile-header-height': headerHeight }">
        <div class="nav-mobile-sticky">
            <div class="nav-mobile-bar">
                <button type="button" class="nav-mobile-brand" @click="_goToAbout">
                    {{ firstName }}
                </button>

                <div class="nav-mobile-actions">
                    <ThemeToggle />
                    <LanguagePicker />
                </div>
            </div>

            <NavPills v-if="categorySections.length >= 2"
                      class="nav-mobile-sections"
                      :sections="categorySections"
                      @link-clicked="_onLinkClicked"/>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue"
import LanguagePicker from "../../widgets/LanguagePicker.vue"
import ThemeToggle from "../../widgets/ThemeToggle.vue"
import NavPills from "./NavPills.vue"
import {useData} from "../../../composables/data.js"
import {useNavigation} from "../../../composables/navigation.js"

const data = useData()
const navigation = useNavigation()
const emit = defineEmits(['linkClicked'])

const categorySections = computed(() => {
    const activeCategoryId = navigation.getActiveCategoryId()
    return data.getCategorySections(activeCategoryId)
})

const firstName = computed(() => {
    const profile = data.getProfile()
    if (!profile?.['name']) {
        return 'Portfolio'
    }

    return profile['name'].split(' ')[0]
})

const headerHeight = computed(() => {
    return categorySections.value.length >= 2 ? '6.25rem' : '3.5rem'
})

const _goToAbout = () => {
    emit('linkClicked', 'about')
}

const _onLinkClicked = (section) => {
    emit('linkClicked', section['id'])
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.nav-header {
    height: var(--nav-mobile-header-height, #{$nav-topbar-height});
}

.nav-mobile-sticky {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-nav-bg);
    backdrop-filter: blur(12px);
}

.nav-mobile-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    height: $nav-topbar-height;
    padding: 0 1rem;
}

.nav-mobile-brand {
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

.nav-mobile-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.nav-mobile-sections {
    border-top: 1px solid var(--color-border);
}
</style>
