<template>
    <div class="contact-channels">
        <a v-for="(item, index) in props.items"
           :key="item['id']"
           :href="item['href'] || undefined"
           :class="['contact-channel', 'hover-glow', { 'contact-channel--static': !item['href'] }]"
           :target="item['href'] ? '_blank' : undefined"
           :rel="item['href'] ? 'noopener noreferrer' : undefined">

            <span class="contact-channel-icon">
                <i :class="item['faIcon']" aria-hidden="true"/>
            </span>

            <span class="contact-channel-body">
                <span class="contact-channel-label">{{ data.getString(item['id']) }}</span>
                <span class="contact-channel-value" v-html="_getItemLabel(item)"/>
            </span>

            <i v-if="item['href']"
               class="fa-solid fa-arrow-up-right-from-square contact-channel-arrow"
               aria-hidden="true"/>
        </a>
    </div>
</template>

<script setup>
import {useData} from "../../../composables/data.js"

/**
 * @property {Object[]} items
 */
const props = defineProps({
    items: Array
})

const data = useData()

/**
 * @param {Object} item
 * @return {String}
 * @private
 */
const _getItemLabel = (item) => {
    return item['value'] || item['valueShort']
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.contact-channels {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.65rem;

    @include media-breakpoint-up(sm) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.contact-channel {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.85rem;
    text-decoration: none;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease,
        transform 0.2s ease;

    &:not(.contact-channel--static):hover {
        transform: translateY(-1px);
    }

    &--static {
        cursor: default;
    }
}

.contact-channel-icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.1rem;
    height: 2.1rem;
    font-size: 0.9rem;
    color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.1);
    border: 1px solid rgba(var(--color-primary-rgb), 0.2);
    border-radius: 8px;
}

.contact-channel-body {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
    flex: 1;
}

.contact-channel-label {
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: lowercase;
    letter-spacing: 0.03em;
    color: var(--color-text-muted);
}

.contact-channel-value {
    font-size: 0.82rem;
    line-height: 1.45;
    color: var(--color-heading);
    word-break: break-word;
}

.contact-channel:not(.contact-channel--static) .contact-channel-value {
    color: var(--color-text);
}

.contact-channel-arrow {
    flex-shrink: 0;
    margin-top: 0.15rem;
    font-size: 0.68rem;
    color: var(--color-text-muted);
    opacity: 0;
    transform: translate(-2px, 2px);
    transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        color 0.2s ease;
}

.contact-channel:not(.contact-channel--static):hover .contact-channel-arrow {
    opacity: 1;
    transform: translate(0, 0);
    color: var(--color-primary);
}
</style>
