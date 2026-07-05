<template>
    <div v-if="visible" class="theme-transition-wrap" aria-hidden="true">
        <div ref="curtainRef"
             class="theme-transition-curtain"
             :class="`theme-transition-curtain--${fromTheme}`"/>
        <div ref="glowRef"
             class="theme-transition-glow"
             :class="`theme-transition-glow--${toTheme}`"/>
        <div ref="glowRingRef"
             class="theme-transition-glow-ring"
             :class="`theme-transition-glow-ring--${toTheme}`"/>
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
const glowRingRef = ref(null)

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
 * @param {HTMLElement} glowRing
 * @param {'dark'|'light'} target
 * @return {Promise<void>}
 */
const runReveal = (curtain, glow, glowRing, target) => {
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

            const glowScale = 0.2 + eased * 3.4
            const ringScale = 0.35 + eased * 4.2
            const peak = target === 'light' ? 1 : 0.92
            const trail = 0.35 + eased * 0.65
            const fadeOut = 1 - Math.pow(t, 1.65) * 0.88
            const glowOpacity = peak * trail * fadeOut
            const ringOpacity = glowOpacity * 0.72

            glow.style.opacity = String(glowOpacity)
            glow.style.transform = `scale(${glowScale})`
            glowRing.style.opacity = String(ringOpacity)
            glowRing.style.transform = `scale(${ringScale})`

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
            const glowRing = glowRingRef.value

            if (!curtain || !glow || !glowRing) {
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
            glow.style.transform = 'scale(0.2)'
            glowRing.style.opacity = '0'
            glowRing.style.transform = 'scale(0.35)'

            await new Promise(requestAnimationFrame)

            onApplyTheme?.()

            await new Promise(requestAnimationFrame)

            await runReveal(curtain, glow, glowRing, target)

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
    top: -4.5rem;
    right: -4.5rem;
    width: 24rem;
    height: 24rem;
    border-radius: 50%;
    transform-origin: center;
    pointer-events: none;
    filter: blur(1px);

    &--light {
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 248, 220, 0.75) 28%,
            rgba(94, 234, 212, 0.28) 52%,
            transparent 72%
        );
        box-shadow:
            0 0 30px 10px rgba(255, 255, 255, 0.55),
            0 0 80px 28px rgba(255, 250, 230, 0.4),
            0 0 140px 48px rgba(94, 234, 212, 0.18);
    }

    &--dark {
        background: radial-gradient(
            circle,
            rgba(94, 234, 212, 0.55) 0%,
            rgba(30, 30, 36, 0.85) 30%,
            rgba(10, 10, 12, 0.65) 50%,
            transparent 72%
        );
        box-shadow:
            0 0 28px 12px rgba(94, 234, 212, 0.45),
            0 0 70px 30px rgba(0, 0, 0, 0.55),
            0 0 120px 50px rgba(94, 234, 212, 0.15);
    }
}

.theme-transition-glow-ring {
    position: absolute;
    top: -5rem;
    right: -5rem;
    width: 28rem;
    height: 28rem;
    border-radius: 50%;
    transform-origin: center;
    pointer-events: none;

    &--light {
        background: radial-gradient(
            circle,
            transparent 42%,
            rgba(255, 255, 255, 0.22) 58%,
            rgba(94, 234, 212, 0.16) 68%,
            transparent 78%
        );
        box-shadow: 0 0 100px 40px rgba(255, 255, 255, 0.22);
    }

    &--dark {
        background: radial-gradient(
            circle,
            transparent 40%,
            rgba(94, 234, 212, 0.2) 58%,
            rgba(0, 0, 0, 0.35) 70%,
            transparent 80%
        );
        box-shadow: 0 0 90px 36px rgba(94, 234, 212, 0.18);
    }
}

@media (prefers-reduced-motion: reduce) {
    .theme-transition-wrap {
        display: none;
    }
}
</style>
