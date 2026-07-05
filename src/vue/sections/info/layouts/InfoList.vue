<template>
    <div class="row">
        <RevealOnScroll v-for="(item, index) in props.items"
                        :key="item['locales']?.['title'] ?? index"
                        tag="div"
                        class="col-12 item-container"
                        :delay="index * 50">
            <InfoItem :item="item"
                      :highlighted-header="false"
                      :small-description="false"
                      :description-with-progress-bar="false"
                      :icon-color-style="'transparent'"/>
        </RevealOnScroll>
    </div>
</template>

<script setup>
import InfoItem from "../partials/InfoItem.vue"

/**
 * @property {Object[]} items
 */
const props = defineProps({
    items: Array,
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.item-container {
    @include generate-dynamic-styles-with-hash((
        xxxl: (min-height:4rem),
        xxl:   (min-height:3.75rem),
        xl:   (min-height:3.5rem),
        sm:   (min-height:0)
    ));
}
</style>