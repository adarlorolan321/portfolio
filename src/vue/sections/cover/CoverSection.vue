<template>
    <SectionTemplate :section-data="props.sectionData">
        <div class="hero" v-if="profile">
            <RevealOnScroll immediate :delay="0">
                <ImageView :src="profile['profilePictureUrl']"
                           :alt="profile['name']"
                           class="hero-avatar"/>
            </RevealOnScroll>

            <RevealOnScroll immediate :delay="80">
                <h1 class="hero-name">{{ profile['name'] }}</h1>
            </RevealOnScroll>

            <RevealOnScroll immediate :delay="160">
                <p class="hero-role">
                    <i class="fa-solid fa-terminal hero-role-icon" aria-hidden="true"/>
                    {{ profile['locales']['role'] }}
                </p>
            </RevealOnScroll>

            <RevealOnScroll immediate :delay="240">
                <p class="hero-bio" v-html="heroBio"/>
            </RevealOnScroll>

            <RevealOnScroll immediate :delay="320">
                <SocialLinks variant="text" :items="props.sectionData.content['items']['socialCircles']"/>
            </RevealOnScroll>

            <RevealOnScroll v-if="heroStats.length" immediate :delay="400">
                <div class="hero-stats">
                    <div v-for="(stat, index) in heroStats" :key="index" class="hero-stat">
                        <i :class="stat['icon']" class="hero-stat-icon" aria-hidden="true"/>
                        <span class="hero-stat-value">{{ stat['value'] }}</span>
                        <span class="hero-stat-label">{{ stat['label'] }}</span>
                    </div>
                </div>
            </RevealOnScroll>
        </div>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import {computed} from "vue"
import {useData} from "../../../composables/data.js"
import {useUtils} from "../../../composables/utils.js"
import {getStatIcon} from "../../../composables/icons.js"
import ImageView from "../../widgets/ImageView.vue"
import SocialLinks from "../../widgets/SocialLinks.vue"

const data = useData()
const utils = useUtils()

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

/**
 * @type {ComputedRef<Object|null>}
 */
const profile = computed(() => {
    return data.getProfile()
})

/**
 * @type {import('vue').ComputedRef<number|null>}
 */
const devExperienceYears = computed(() => {
    const startDate = props.sectionData.content?.['devStartDate']
    return utils.calculateExperienceYearsFromDate(startDate)
})

/**
 * @type {import('vue').ComputedRef<string>}
 */
const heroBio = computed(() => {
    const bio = props.sectionData.content?.['locales']?.['bio'] ?? ''
    return utils.formatExperienceYearsInText(bio, devExperienceYears.value)
})

/**
 * @type {ComputedRef<{value: string, label: string}[]>}
 */
const heroStats = computed(() => {
    const stats = props.sectionData.content?.['stats'] ?? []

    return stats.map(stat => {
        const label = stat['locales']?.['label'] ?? ''
        let value = stat['value'] ?? ''

        if (stat['dynamic'] === 'experienceYears' && devExperienceYears.value !== null) {
            value = `${devExperienceYears.value}+`
        }

        return {
            value,
            label,
            icon: getStatIcon(label)
        }
    })
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.hero {
    max-width: 640px;
}

.hero-avatar {
    --size: 80px;
    width: var(--size);
    height: var(--size);
    margin-bottom: 1.5rem;
    border-radius: 50%;
    object-fit: cover;

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        --size: 72px;
        margin-bottom: 1.25rem;
    }
}

.hero-name {
    margin: 0 0 0.5rem;
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--color-heading);
}

.hero-role {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1.5rem;
    font-size: 1rem;
    color: var(--color-text-muted);
}

.hero-role-icon {
    font-size: 0.9rem;
    color: var(--color-primary);
}

.hero-bio {
    margin: 0 0 2rem;
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--color-text);
}

.hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        gap: 1.25rem 1.75rem;
        margin-top: 2rem;
        padding-top: 1.5rem;
    }
}

.hero-stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.hero-stat-icon {
    font-size: 0.85rem;
    color: var(--color-primary);
    margin-bottom: 0.15rem;
}

.hero-stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-heading);
    letter-spacing: -0.02em;
}

.hero-stat-label {
    font-size: 0.8rem;
    text-transform: lowercase;
    color: var(--color-text-muted);
}
</style>
