<template>
    <SectionTemplate :section-data="props.sectionData">
        <div class="recommendations">
            <RevealOnScroll v-for="(item, index) in props.sectionData.content['items']"
                            :key="item['id']"
                            tag="article"
                            class="recommendation-card hover-lift"
                            variant="left"
                            :delay="index * 100">

                <p class="recommendation-quote">
                    <i class="fa-solid fa-quote-left recommendation-quote-icon" aria-hidden="true"/>
                    {{ item['locales']['quote'] }}"
                </p>

                <div class="recommendation-author">
                    <span class="recommendation-initials">{{ item['initials'] }}</span>
                    <div class="recommendation-meta">
                        <span class="recommendation-name">{{ item['locales']['author'] }}</span>
                        <span class="recommendation-role">{{ item['locales']['role'] }}</span>
                    </div>
                </div>
            </RevealOnScroll>
        </div>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.recommendations {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.recommendation-card {
    padding: 1.5rem;
    background: var(--color-bg-card);
    backdrop-filter: blur(12px);
    border: 1px solid var(--color-border);
    border-radius: 8px;
}

.recommendation-quote {
    margin: 0 0 1.25rem;
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--color-text);
}

.recommendation-quote-icon {
    margin-right: 0.35rem;
    font-size: 0.8rem;
    color: var(--color-primary);
    opacity: 0.85;
}

.recommendation-author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.recommendation-initials {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.12);
    border-radius: 50%;
}

.recommendation-meta {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.recommendation-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-heading);
}

.recommendation-role {
    font-size: 0.8rem;
    color: var(--color-text-muted);
}
</style>
