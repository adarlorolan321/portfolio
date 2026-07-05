<template>
    <!-- Website Section -->
    <section v-show="isVisible" :id="props.sectionData['id']" :class="classList">
        <!-- Section Container -->
        <div class="section-container" v-if="props.sectionData.content">
            <!-- Section Header -->
            <RevealOnScroll v-if="sectionTitle && !props.sectionData['cover']">
                <div class="section-header">
                    <h2 class="section-title">
                        <span v-if="sectionNumber" class="section-number">{{ sectionNumber }}</span>
                        <span v-if="sectionNumber" class="section-dash"> — </span>
                        {{ sectionTitle }}
                    </h2>

                    <p v-if="props.sectionData.content['locales']['description']" class="section-description">
                        {{ props.sectionData.content['locales']['description'] }}
                    </p>
                </div>
            </RevealOnScroll>

            <!-- Section Content -->
            <RevealOnScroll v-if="!props.sectionData['cover']" :delay="120">
                <div class="section-content">
                    <slot/>
                </div>
            </RevealOnScroll>
            <div v-else class="section-content">
                <slot/>
            </div>
        </div>
    </section>
</template>

<script setup>
import {computed} from "vue"
import {useNavigation} from "../../../composables/navigation.js"
import {useData} from "../../../composables/data.js"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const data = useData()
const navigation = useNavigation()

/**
 * @type {ComputedRef<Boolean>}
 */
const isVisible = computed(() => {
    return props.sectionData && navigation.isSectionVisible(props.sectionData['id'])
})

/**
 * @type {ComputedRef<string>}
 */
const classList = computed(() => {
    let classList = 'section'

    if(navigation.isAllAtOnceMode()) {
        classList += ' section-with-division'
    }

    if(props.sectionData['cover']) {
        classList += ' section-cover'
    }

    return classList
})

/**
 * @type {ComputedRef<String|null>}
 */
const sectionNumber = computed(() => {
    const sections = data.getSections().filter(section => !section['cover'])
    const index = sections.findIndex(section => section['id'] === props.sectionData['id'])

    if (index === -1) {
        return null
    }

    return String(index + 1).padStart(2, '0')
})

/**
 * @type {ComputedRef<String>}
 */
const sectionTitle = computed(() => {
    return data.getString(props.sectionData['id'])
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.section {
    position: relative;
    display: flex;
    color: var(--color-text);

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        min-height: calc(100vh - #{$nav-tabs-height} - 6.25rem);
    }

    &-with-division {
        border-bottom: 1px solid var(--color-border);
    }

    &-cover {
        min-height: calc(100vh - #{$nav-topbar-height});

        @include media-breakpoint-down($navigation-sidebar-breakpoint) {
            min-height: calc(100vh - #{$nav-tabs-height} - 6.25rem);
        }

        .section-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: inherit;
        }
    }
}

.section-container {
    width: min(100%, $max-content-width);
    margin: 0 auto;

    @include generate-dynamic-styles-with-hash((
        xxxl:   (padding: 5rem 1.5rem),
        xxl:    (padding: 4.5rem 1.5rem),
        lg:     (padding: 4rem 1.5rem),
        md:     (padding: 3rem 1.25rem),
        sm:     (padding: 2.5rem 1.2rem 3rem)
    ));

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        padding: 2.5rem 1.15rem 2rem;
    }
}

.section-header {
    margin-bottom: 2rem;
}

.section-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: lowercase;
    color: var(--color-heading);
    letter-spacing: -0.01em;
}

.section-number {
    color: var(--color-text-muted);
}

.section-dash {
    color: var(--color-text-muted);
}

.section-description {
    margin: 0.75rem 0 0;
    font-size: 0.95rem;
    color: var(--color-text-muted);
}
</style>
