<template>
    <!-- Tag List -->
    <div class="tags">
        <!-- Bootstrap Badge -->
        <div v-for="item in props.items"
             class="tag badge text-1"
             :class="badgeClassList">

            <!-- Badge Label -->
            <i v-if="item.faIcon" :class="item.faIcon" class="me-2"/>
            <span v-html="item.label || item"/>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue"

/**
 * @property {String[]|{label:String, icon:string}[]} items
 * @property {String} [itemClass]
 */
const props = defineProps({
    items: Array,
    itemClass: String
})

/**
 * @type {ComputedRef<String>}
 */
const badgeClassList = computed(() => {
    return props.itemClass ? props.itemClass : 'bg-light text-dark'
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 1px solid rgba(99, 102, 241, 0.2);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%);
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%);
    }
}
</style>