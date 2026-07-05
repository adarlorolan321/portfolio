<template>
    <div v-show="active" class="language-ash-overlay" aria-hidden="true">
        <div class="language-ash-haze"/>
    </div>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted, ref} from "vue"
import {registerLanguageTransitionHandler, unregisterLanguageTransitionHandler, useLanguage} from "../../composables/language.js"
import {
    captureTypingJobs,
    captureJobsNewText,
    finalizeJobs,
    restoreJobsOldText,
    runLanguageTypewriter
} from "../../composables/languageTypewriter.js"
import {setAshRoot} from "../../composables/languageAsh.js"

const language = useLanguage()
const active = ref(false)

/**
 * @param {Object} from
 * @param {Object} to
 * @param {Function} onApplyLanguage
 * @return {Promise<void>}
 */
const play = async (from, to, onApplyLanguage) => {
    if (from?.['id'] === to?.['id']) {
        return
    }

    const root = document.querySelector('.resume')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!root || prefersReducedMotion) {
        onApplyLanguage?.()
        return
    }

    document.documentElement.classList.add('language-switching')
    active.value = true
    setAshRoot(null)

    try {
        await nextTick()

        const jobs = captureTypingJobs(root)

        onApplyLanguage?.()
        await nextTick()
        captureJobsNewText(jobs)

        await language.selectLanguage(from, {animate: false})
        await nextTick()
        restoreJobsOldText(jobs)

        await runLanguageTypewriter(jobs)

        onApplyLanguage?.()
        await nextTick()
        finalizeJobs(jobs)
    }
    finally {
        setAshRoot(null)
        active.value = false
        document.documentElement.classList.remove('language-switching')
    }
}

onMounted(() => {
    registerLanguageTransitionHandler(play)
})

onUnmounted(() => {
    unregisterLanguageTransitionHandler()
    setAshRoot(null)
})
</script>

<style lang="scss">
.language-ash-overlay {
    position: fixed;
    inset: 0;
    z-index: 9997;
    pointer-events: none;
    overflow: hidden;
}

.language-ash-haze {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 90% 40% at 50% 100%, rgba(82, 82, 82, 0.12), transparent 70%),
        radial-gradient(ellipse 70% 35% at 20% 20%, rgba(120, 113, 108, 0.08), transparent 65%);
    animation: lang-ash-haze-drift 2.8s ease-in-out infinite;
}

.lang-ash-layer {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    overflow: hidden;
}

.lang-ash {
    position: fixed;
    width: var(--size, 3px);
    height: calc(var(--size, 3px) * 0.65);
    border-radius: 1px;
    background: linear-gradient(135deg, #a8a29e 0%, #57534e 55%, #292524 100%);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.35);
    font-size: 0.55rem;
    line-height: 1;
    color: rgba(168, 162, 158, 0.7);
    pointer-events: none;
    opacity: 0.9;
    animation: lang-ash-fly 0.82s ease-out var(--delay, 0s) forwards;
    transform: translate(-50%, -50%);

    &--ember {
        background: linear-gradient(135deg, #fdba74 0%, #ea580c 45%, #44403c 100%);
        box-shadow: 0 0 6px rgba(234, 88, 12, 0.45);
    }
}

html.language-switching .resume {
    pointer-events: none;
}

.lang-morph-active.lang-morph-casting {
    position: relative;
}

.lang-morph-new {
    color: var(--color-heading);
}

.lang-morph-dissolve {
    color: var(--color-text-muted);
    opacity: 0.45;
}

.lang-morph-old {
    color: var(--color-text);
}

.lang-morph-ash {
    display: none;
}

@keyframes lang-ash-haze-drift {
    0%,
    100% { opacity: 0.55; }
    50% { opacity: 0.85; }
}

@keyframes lang-ash-fly {
    0% {
        opacity: 0.85;
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }

    100% {
        opacity: 0;
        transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, -24px))) rotate(var(--rot, 0deg)) scale(0.4);
    }
}

@media (prefers-reduced-motion: reduce) {
    .language-ash-overlay,
    .lang-ash {
        animation: none !important;
    }
}
</style>
