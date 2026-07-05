<template>
    <component :is="props.tag"
               ref="root"
               :class="rootClassList"
               :style="rootStyle">
        <slot/>
    </component>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue"

/**
 * @property {Number} delay
 * @property {'up'|'fade'|'left'|'scale'} variant
 * @property {Boolean} immediate
 * @property {String} tag
 */
const props = defineProps({
    delay: {
        type: Number,
        default: 0
    },
    variant: {
        type: String,
        default: 'up'
    },
    immediate: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        default: 'div'
    }
})

const visible = ref(false)
const root = ref(null)

/** @type {IntersectionObserver|null} */
let observer = null

/**
 * @return {boolean}
 * @private
 */
const _prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * @private
 */
const _show = () => {
    visible.value = true
}

onMounted(() => {
    if (_prefersReducedMotion()) {
        _show()
        return
    }

    if (props.immediate) {
        requestAnimationFrame(() => {
            _show()
        })
        return
    }

    const element = root.value
    if (!element) {
        return
    }

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                _show()
                observer?.unobserve(entry.target)
            }
        })
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px'
    })

    observer.observe(element)
})

onUnmounted(() => {
    observer?.disconnect()
})

/**
 * @type {import('vue').ComputedRef<string[]>}
 */
const rootClassList = computed(() => {
    return [
        'reveal',
        `reveal-${props.variant}`,
        {'reveal-visible': visible.value}
    ]
})

/**
 * @type {import('vue').ComputedRef<{'--reveal-delay': string}>}
 */
const rootStyle = computed(() => {
    return {
        '--reveal-delay': `${props.delay}ms`
    }
})
</script>
