<template>
    <div class="management-links" :class="{'management-links-text': props.variant === 'text'}">
        <a v-for="item in props.items"
           :key="item['id'] || item['href']"
           class="management-link"
           :class="props.variant === 'text' ? 'management-link-text' : 'btn btn-management'"
           target="_blank"
           :href="item['href']"
           :aria-label="item['faIcon']">

            <template v-if="props.variant === 'text'">
                {{ _getLinkLabel(item) }} ↗
            </template>
            <i v-else :class="item['faIcon']"/>
        </a>
    </div>
</template>

<script setup>
/**
 * @property {{href:String, faIcon:String, id?:String}[]} items
 * @property {'icon'|'text'} variant
 */
const props = defineProps({
    items: Array,
    variant: {
        type: String,
        default: 'icon'
    }
})

/**
 * @param {Object} item
 * @return {string}
 * @private
 */
const _getLinkLabel = (item) => {
    const id = item['id'] ?? ''

    if (id) {
        return id
    }

    if (item['href']?.includes('github')) {
        return 'github'
    }
    if (item['href']?.includes('linkedin')) {
        return 'linkedin'
    }
    if (item['href']?.includes('instagram')) {
        return 'instagram'
    }
    if (item['href']?.includes('facebook')) {
        return 'facebook'
    }
    if (item['href']?.startsWith('mailto:')) {
        return 'email'
    }

    return 'link'
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

$sizes: (xxxl: 1.45rem, xl: 1.4rem, lg: 1.25rem, md: 1.1rem);

.management-links-text {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.management-link-text {
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: lowercase;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color 0.15s;

    &:hover {
        color: var(--color-primary);
    }
}

.btn-management {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    border-radius: 100%;
    border-width: 4px;
    border-color: var(--color-border);

    background-color: var(--color-bg-elevated);
    color: var(--color-heading);

    &:hover, &:active {
        color: var(--color-bg);
        border-color: var(--color-primary);
        background-color: var(--color-primary);
    }

    &:not(:first-child),
    &:not(:last-child) {
        margin: 0 0.3rem;
    }

    @each $size, $value in $sizes {
        $dimension: $value * 2.4;

        @include media-breakpoint-down(#{$size}) {
            width: $dimension;
            height: $dimension;
            font-size: $value;
        }
    }
}
</style>
