<template>
    <div v-if="isActive"
         class="custom-cursor"
         :class="{
             'custom-cursor-hover': isHovering,
             'custom-cursor-click': isClicking,
             'custom-cursor-hidden': !isVisible
         }"
         aria-hidden="true">

        <div class="custom-cursor-dot" :style="dotStyle"/>
        <div class="custom-cursor-ring" :style="ringStyle"/>
    </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue"
import {useUtils} from "../../composables/utils.js"

const utils = useUtils()

const isActive = ref(false)
const isVisible = ref(false)
const isHovering = ref(false)
const isClicking = ref(false)

const dotX = ref(0)
const dotY = ref(0)
const ringX = ref(0)
const ringY = ref(0)

/** @type {number|null} */
let animationFrameId = null

/** @type {MediaQueryList|null} */
let reducedMotionQuery = null

/** @type {MediaQueryList|null} */
let desktopQuery = null

const INTERACTIVE_SELECTOR = [
    'a',
    'button',
    'input',
    'textarea',
    'select',
    'label',
    '[role="button"]',
    '.project-card',
    '.nav-topbar-link',
    '.nav-link',
    '.nav-item',
    '.stack-pill',
    '.hover-lift',
    '.hover-glow',
    '.filter-tabs .btn',
    '.tag'
].join(', ')

/**
 * @return {boolean}
 * @private
 */
const _canUseCustomCursor = () => {
    if (utils.isTouchDevice()) {
        return false
    }

    if (reducedMotionQuery?.matches) {
        return false
    }

    return desktopQuery?.matches ?? window.innerWidth >= 992
}

/**
 * @private
 */
const _setBodyClass = (enabled) => {
    document.body.classList.toggle('custom-cursor-enabled', enabled)
}

/**
 * @param {MouseEvent} event
 * @private
 */
const _onMouseMove = (event) => {
    dotX.value = event.clientX
    dotY.value = event.clientY
    isVisible.value = true
}

/**
 * @param {MouseEvent} event
 * @private
 */
const _onMouseOver = (event) => {
    const target = event.target
    if (!(target instanceof Element)) {
        return
    }

    isHovering.value = !!target.closest(INTERACTIVE_SELECTOR)
}

/**
 * @private
 */
const _onMouseDown = () => {
    isClicking.value = true
}

/**
 * @private
 */
const _onMouseUp = () => {
    isClicking.value = false
}

/**
 * @private
 */
const _onMouseLeave = () => {
    isVisible.value = false
}

/**
 * @private
 */
const _animateRing = () => {
    ringX.value += (dotX.value - ringX.value) * 0.14
    ringY.value += (dotY.value - ringY.value) * 0.14
    animationFrameId = requestAnimationFrame(_animateRing)
}

/**
 * @private
 */
const _activate = () => {
    if (!_canUseCustomCursor()) {
        isActive.value = false
        _setBodyClass(false)
        return
    }

    isActive.value = true
    _setBodyClass(true)

    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(_animateRing)
    }
}

/**
 * @private
 */
const _deactivate = () => {
    isActive.value = false
    isVisible.value = false
    _setBodyClass(false)

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
}

/**
 * @private
 */
const _onMediaChange = () => {
    if (_canUseCustomCursor()) {
        _activate()
    }
    else {
        _deactivate()
    }
}

onMounted(() => {
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    desktopQuery = window.matchMedia('(min-width: 992px)')

    _activate()

    document.addEventListener('mousemove', _onMouseMove)
    document.addEventListener('mouseover', _onMouseOver)
    document.addEventListener('mousedown', _onMouseDown)
    document.addEventListener('mouseup', _onMouseUp)
    document.addEventListener('mouseleave', _onMouseLeave)

    reducedMotionQuery.addEventListener('change', _onMediaChange)
    desktopQuery.addEventListener('change', _onMediaChange)
    window.addEventListener('resize', _onMediaChange)
})

onUnmounted(() => {
    _deactivate()

    document.removeEventListener('mousemove', _onMouseMove)
    document.removeEventListener('mouseover', _onMouseOver)
    document.removeEventListener('mousedown', _onMouseDown)
    document.removeEventListener('mouseup', _onMouseUp)
    document.removeEventListener('mouseleave', _onMouseLeave)

    reducedMotionQuery?.removeEventListener('change', _onMediaChange)
    desktopQuery?.removeEventListener('change', _onMediaChange)
    window.removeEventListener('resize', _onMediaChange)
})

/**
 * @type {import('vue').ComputedRef<{transform: string}>}
 */
const dotStyle = computed(() => ({
    transform: `translate(${dotX.value}px, ${dotY.value}px)`
}))

/**
 * @type {import('vue').ComputedRef<{transform: string}>}
 */
const ringStyle = computed(() => ({
    transform: `translate(${ringX.value}px, ${ringY.value}px)`
}))
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    pointer-events: none;
}

.custom-cursor-dot,
.custom-cursor-ring {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    will-change: transform;
}

.custom-cursor-dot {
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    border-radius: 50%;
    background-color: var(--color-primary);
    box-shadow: 0 0 10px rgba(var(--color-primary-rgb), 0.55);
    transition: width 0.2s ease, height 0.2s ease, margin 0.2s ease, opacity 0.2s ease;
}

.custom-cursor-ring {
    width: 36px;
    height: 36px;
    margin: -18px 0 0 -18px;
    border: 1.5px solid rgba(var(--color-primary-rgb), 0.65);
    border-radius: 50%;
    opacity: 0.7;
    transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                height 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                margin 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                opacity 0.2s ease,
                border-width 0.2s ease;
}

.custom-cursor-hover {
    .custom-cursor-dot {
        width: 8px;
        height: 8px;
        margin: -4px 0 0 -4px;
        opacity: 1;
    }

    .custom-cursor-ring {
        width: 52px;
        height: 52px;
        margin: -26px 0 0 -26px;
        opacity: 0.85;
        border-width: 2px;
    }
}

.custom-cursor-click {
    .custom-cursor-dot {
        width: 4px;
        height: 4px;
        margin: -2px 0 0 -2px;
    }

    .custom-cursor-ring {
        width: 28px;
        height: 28px;
        margin: -14px 0 0 -14px;
        opacity: 1;
    }
}

.custom-cursor-hidden {
    .custom-cursor-dot,
    .custom-cursor-ring {
        opacity: 0;
    }
}
</style>
