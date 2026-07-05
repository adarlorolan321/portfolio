<template>
    <div v-if="visible" class="theme-transition-wrap" aria-hidden="true">
        <div ref="curtainRef"
             class="theme-transition-curtain"
             :class="`theme-transition-curtain--${fromTheme}`"/>
        <div ref="glowRef"
             class="theme-transition-glow"
             :class="`theme-transition-glow--${toTheme}`"/>
    </div>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted, ref} from "vue"
import {registerThemeTransitionHandler, unregisterThemeTransitionHandler} from "../../composables/theme.js"

const visible = ref(false)
const fromTheme = ref('dark')
const toTheme = ref('light')
const curtainRef = ref(null)
const glowRef = ref(null)

const ORIGIN_X = 'calc(100% - 2.25rem)'
const ORIGIN_Y = '2.25rem'
const DURATION_MS = 1240

/**
 * @param {number} t
 * @return {number}
 */
const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3)
}

/**
 * @param {number} radiusPx
 * @return {string}
 */
const buildMask = (radiusPx) => {
    const softEdge = Math.max(radiusPx * 0.08, 12)
    const inner = Math.max(radiusPx - softEdge, 0)

    return `radial-gradient(circle at ${ORIGIN_X} ${ORIGIN_Y}, transparent ${inner}px, rgba(0, 0, 0, 0.92) ${radiusPx}px, black ${radiusPx + 1}px)`
}

/**
 * @param {HTMLElement} curtain
 * @param {HTMLElement} glow
 * @param {'dark'|'light'} target
 * @return {Promise<void>}
 */
const runReveal = (curtain, glow, target) => {
    return new Promise((resolve) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            resolve()
            return
        }

        const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 1.35
        const start = performance.now()

        const tick = (now) => {
            const elapsed = now - start
            const t = Math.min(elapsed / DURATION_MS, 1)
            const eased = easeOutCubic(t)
            const radius = eased * maxRadius

            const mask = buildMask(radius)
            curtain.style.maskImage = mask
            curtain.style.webkitMaskImage = mask

            const glowScale = 0.15 + eased * 2.4
            const glowOpacity = target === 'light'
                ? 0.55 + eased * 0.35
                : 0.45 + eased * 0.4

            glow.style.opacity = String(glowOpacity * (1 - t * 0.85))
            glow.style.transform = `scale(${glowScale})`

            if (t < 1) {
                requestAnimationFrame(tick)
                return
            }

            resolve()
        }

        requestAnimationFrame(tick)
    })
}

/**
 * @param {'dark'|'light'} from
 * @param {'dark'|'light'} target
 * @param {Function} onApplyTheme
 * @return {Promise<void>}
 */
const play = (from, target, onApplyTheme) => {
    return new Promise((resolve) => {
        if (from === target) {
            resolve()
            return
        }

        fromTheme.value = from
        toTheme.value = target
        visible.value = true

        nextTick(async () => {
            const curtain = curtainRef.value
            const glow = glowRef.value

            if (!curtain || !glow) {
                onApplyTheme?.()
                visible.value = false
                resolve()
                return
            }

            document.documentElement.classList.add('theme-switching')

            const initialMask = buildMask(0)
            curtain.style.maskImage = initialMask
            curtain.style.webkitMaskImage = initialMask
            glow.style.opacity = '0'
            glow.style.transform = 'scale(0.15)'

            await new Promise(requestAnimationFrame)

            onApplyTheme?.()

            await new Promise(requestAnimationFrame)

            await runReveal(curtain, glow, target)

            visible.value = false
            document.documentElement.classList.remove('theme-switching')
            resolve()
        })
    })
}

onMounted(() => {
    registerThemeTransitionHandler(play)
})

onUnmounted(() => {
    unregisterThemeTransitionHandler()
})
</script>

<style lang="scss">
.theme-transition-wrap {
    position: fixed;
    inset: 0;
    z-index: 10000;
    pointer-events: none;
    overflow: hidden;
}

.theme-transition-curtain {
    position: absolute;
    inset: 0;
    mask-mode: alpha;
    -webkit-mask-mode: alpha;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;

    &--dark {
        background: #0a0a0a;
    }

    &--light {
        background: #f0f4f8;
    }
}

.theme-transition-glow {
    position: absolute;
    top: -3.5rem;
    right: -3.5rem;
    width: 18rem;
    height: 18rem;
    border-radius: 50%;
    transform-origin: center;
    pointer-events: none;

    &--light {
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 250, 230, 0.5) 35%,
            transparent 68%
        );
        box-shadow: 0 0 40px 12px rgba(255, 255, 255, 0.35);
    }

    &--dark {
        background: radial-gradient(
            circle,
            rgba(20, 20, 24, 0.9) 0%,
            rgba(10, 10, 12, 0.55) 35%,
            transparent 68%
        );
        box-shadow: 0 0 40px 14px rgba(0, 0, 0, 0.45);
    }
}

@media (prefers-reduced-motion: reduce) {
    .theme-transition-wrap {
        display: none;
    }
}
</style>
