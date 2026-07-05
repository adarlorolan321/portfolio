<template>
    <SectionTemplate :section-data="props.sectionData">
        <div class="contact-section">
            <div class="contact-layout">
                <RevealOnScroll tag="div" class="contact-panel contact-panel--form">
                    <div class="contact-panel-header">
                        <span class="contact-panel-kicker">// send_message</span>
                        <h3 class="contact-panel-title">{{ data.getString('sendMessage') }}</h3>
                        <p class="contact-panel-desc">{{ props.sectionData['content']['locales']['description'] }}</p>
                    </div>
                    <ContactForm/>
                </RevealOnScroll>

                <RevealOnScroll tag="div"
                                class="contact-panel contact-panel--channels"
                                variant="left"
                                :delay="100">
                    <div class="contact-panel-header">
                        <span class="contact-panel-kicker">// direct_channels</span>
                        <h3 class="contact-panel-title">{{ props.sectionData['content']['locales']['subtitle'] }}</h3>
                        <p class="contact-panel-desc">{{ props.sectionData['content']['locales']['subtitleDescription'] }}</p>
                    </div>
                    <ContactOptions :items="props.sectionData['content']['items']"/>
                </RevealOnScroll>
            </div>
        </div>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import {useData} from "../../../composables/data.js"
import ContactForm from "./ContactForm.vue"
import ContactOptions from "./ContactOptions.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const data = useData()
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.contact-section {
    width: 100%;
}

.contact-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @include media-breakpoint-up(lg) {
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
        gap: 1.35rem;
        align-items: start;
    }
}

.contact-panel {
    padding: 1.35rem 1.25rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    backdrop-filter: blur(12px);

    @include media-breakpoint-up(lg) {
        padding: 1.5rem;
    }
}

.contact-panel-header {
    margin-bottom: 1.25rem;
}

.contact-panel-kicker {
    display: block;
    margin-bottom: 0.45rem;
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-size: 0.72rem;
    color: var(--color-primary);
}

.contact-panel-title {
    margin: 0 0 0.45rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: lowercase;
    color: var(--color-heading);
    letter-spacing: -0.01em;
}

.contact-panel-desc {
    margin: 0;
    font-size: 0.86rem;
    line-height: 1.6;
    color: var(--color-text-muted);
}
</style>
