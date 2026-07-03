<template>
    <div class="progress-bar-wrapper">
        <!-- Bootstrap Progress -->
        <div class="progress">
            <div class="progress-bar"
                 role="progressbar"
                 :style="style"
                 :aria-valuenow="percentage"
                 aria-valuemin="0"
                 aria-valuemax="100"/>
        </div>

        <!-- ProgressBar Description -->
        <div class="progress-description">
            <p v-if="props.description" class="text-1 text-description mb-0"
               v-html="props.description"/>
        </div>
    </div>
</template>

<script setup>
import {useUtils} from "../../composables/utils.js"
import {computed} from "vue"

/**
 * @property {Number} percentage
 * @property {String} description
 * @property {String} color
 */
const props = defineProps({
    percentage:Number,
    description:String,
    color:String
})

const utils = useUtils()

/**
 * @type {ComputedRef<number>}
 */
const percentage = computed(() => {
    return utils.clamp(props.percentage, 0, 100)
})

/**
 * @type {ComputedRef<string>}
 */
const style = computed(() => {
    const percentageValue = percentage.value
    const opacity = (50 + percentageValue*0.5)/100
    const color = props.color ? `background-color: ${props.color}` : ''

    return `width: ${percentageValue}%; opacity: ${opacity}; ${color}`
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.progress {
    @include generate-dynamic-styles-with-hash((
        xxxl:     (height: 8px),
        md:       (height: 6px)
    ));

    background-color: $light-2;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.progress-bar {
    background: linear-gradient(90deg, $primary 0%, $secondary 100%);
    border-radius: 1rem;
    transition: width 0.6s ease-in-out;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.3), 
            transparent
        );
        animation: shimmer 2s infinite;
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

.progress-description {
    margin-top: 0.5rem;
    color: $text-muted;
    font-weight: 500;
}
</style>