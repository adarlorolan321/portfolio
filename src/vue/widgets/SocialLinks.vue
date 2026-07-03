<template>
    <div class="management-links">
        <!-- Management Button -->
        <a v-for="item in props.items" class="btn btn-management" target="_blank"
           :href="item['href']"
           :aria-label="item['faIcon']">

            <!-- Management Button Icon -->
            <i :class="item['faIcon']"/>
        </a>
    </div>
</template>

<script setup>
/**
 * @property {{href:String, faIcon:String}[]} items
 */
const props = defineProps({
    items: Array
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

$sizes: (xxxl: 1.45rem, xl: 1.4rem, lg: 1.25rem, md: 1.1rem);

.btn-management {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    border-radius: 100%;
    border-width: 2px;
    border-color: rgba(99, 102, 241, 0.2);

    background: linear-gradient(135deg, $dark-medium 0%, $dark-light 100%);
    color: $white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &:hover, &:active {
        color: $white;
        border-color: $primary;
        background: linear-gradient(135deg, $primary 0%, $secondary 100%);
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    }

    &:not(:first-child),
    &:not(:last-child) {
        margin: 0 0.4rem;
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