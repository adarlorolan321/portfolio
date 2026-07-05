<template>
    <div v-if="_isRunning()"
         class="loader-full-screen"
         :class="_getClassList()"
         aria-live="polite"
         aria-busy="true">

        <div class="loader-bg-grid" aria-hidden="true"/>
        <div class="loader-bg-glow loader-bg-glow-1" aria-hidden="true"/>
        <div class="loader-bg-glow loader-bg-glow-2" aria-hidden="true"/>

        <div v-show="_didReachStep('logoTweenIn')" class="loader-content">
            <LoaderIcon size="md" :progress="totalPercentage"/>

            <p class="loader-message">
                {{ message }}<span class="loader-dots">{{ loadingDots }}</span>
            </p>

            <div class="loader-progress" :class="{'loader-progress-visible': _didReachStep('progressTweenIn')}">
                <div class="loader-progress-track">
                    <div class="loader-progress-fill" :style="{ width: `${totalPercentage}%` }"/>
                </div>
                <span class="loader-progress-value">{{ totalPercentage }}%</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue"
import LoaderIcon from "../widgets/LoaderIcon.vue"

const emit = defineEmits(['willShow', 'shown', 'completed', 'willHide', 'hidden'])

const TIMEOUT_INTERVAL = 1 / 60

const ANIMATION_STEPS = [
    {id: 0, label: "startingUp", duration: 0.15},
    {id: 1, label: "logoTweenIn", duration: 0.45},
    {id: 2, label: "progressTweenIn", duration: 0.25},
    {id: 3, label: "loading", minDuration: 0.4},
    {id: 4, label: "waiting", duration: 0.25},
    {id: 5, label: "disappearing", duration: 0.55},
]

const message = ref('')
const taskProgressPercentage = ref(0)
const totalPercentage = ref(0)
const currentStepId = ref(-1)
const dotFrame = ref(0)

let elapsedTime = 0
let intervalId = null

const loadingDots = computed(() => {
    return '.'.repeat((dotFrame.value % 3) + 1)
})

onMounted(() => {
    _stop()
})

const _stop = () => {
    clearInterval(intervalId)
    intervalId = null
    currentStepId.value = -1
    elapsedTime = 0
    totalPercentage.value = 0
    dotFrame.value = 0
}

/**
 * @param {String} _message
 * @param {String} [_imageUrl]
 */
const run = (_message, _imageUrl) => {
    message.value = _message
    currentStepId.value = 0
    intervalId = setInterval(_update, TIMEOUT_INTERVAL * 1000)
}

const setTaskProgress = (progressPercentage) => {
    taskProgressPercentage.value = progressPercentage
}

const _update = () => {
    const currentStep = ANIMATION_STEPS[currentStepId.value]
    elapsedTime += TIMEOUT_INTERVAL
    dotFrame.value++

    let didFinishStep = false

    switch (currentStep.label) {
        case 'loading': {
            const durationPercentage = Math.min(Math.max(100 * elapsedTime / currentStep.minDuration, 0), 100)
            totalPercentage.value = Math.round(Math.min(durationPercentage, taskProgressPercentage.value))
            didFinishStep = totalPercentage.value >= 100
            break
        }
        default:
            didFinishStep = elapsedTime >= currentStep.duration
    }

    if (didFinishStep) {
        _nextStep()
    }
}

const _nextStep = () => {
    currentStepId.value++
    elapsedTime = 0

    if (currentStepId.value >= ANIMATION_STEPS.length) {
        emit('hidden')
        _stop()
        return
    }

    switch (ANIMATION_STEPS[currentStepId.value].label) {
        case 'logoTweenIn':
            emit('willShow')
            break
        case 'loading':
            emit('shown')
            break
        case 'waiting':
            emit('completed')
            break
        case 'disappearing':
            emit('willHide')
            break
    }
}

const _didReachStep = (animationStepLabel) => {
    const step = ANIMATION_STEPS.find(step => step.label === animationStepLabel)
    return step && currentStepId.value >= step.id
}

const _isRunning = () => {
    return currentStepId.value >= 0 && currentStepId.value < ANIMATION_STEPS.length
}

const _getClassList = () => {
    if (!_isRunning()) {
        return 'd-none'
    }

    if (!_didReachStep('disappearing')) {
        return 'loader-full-screen-visible'
    }

    return 'loader-full-screen-exiting'
}

defineExpose({
    run,
    setTaskProgress
})
</script>

<style lang="scss" scoped>
.loader-full-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0a0a0a;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.45s ease, visibility 0.45s ease;

    &-visible {
        opacity: 1;
        visibility: visible;
    }

    &-exiting {
        opacity: 0;
        visibility: visible;
        transition: opacity 0.55s ease, visibility 0.55s ease;
    }
}

.loader-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(94, 234, 212, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(94, 234, 212, 0.06) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 65% at 50% 45%, black 15%, transparent 75%);
}

.loader-bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;

    &-1 {
        top: -10%;
        right: -5%;
        width: 320px;
        height: 320px;
        background: rgba(94, 234, 212, 0.12);
        animation: loaderGlowFloat 14s ease-in-out infinite;
    }

    &-2 {
        bottom: -8%;
        left: 10%;
        width: 260px;
        height: 260px;
        background: rgba(56, 189, 248, 0.08);
        animation: loaderGlowFloat 18s ease-in-out infinite reverse;
    }
}

.loader-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2rem;
    animation: loaderContentIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.loader-message {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: lowercase;
    color: #a3a3a3;
}

.loader-dots {
    display: inline-block;
    min-width: 1.25rem;
    text-align: left;
}

.loader-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: min(16rem, 72vw);
    opacity: 0;
    transform: translateY(0.5rem);
    transition: opacity 0.25s ease, transform 0.25s ease;

    &-visible {
        opacity: 1;
        transform: translateY(0);
    }
}

.loader-progress-track {
    width: 100%;
    height: 3px;
    overflow: hidden;
    background-color: #262626;
    border-radius: 999px;
}

.loader-progress-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #0d9488 0%, #5eead4 100%);
    box-shadow: 0 0 12px rgba(94, 234, 212, 0.45);
    transition: width 0.2s ease;
}

.loader-progress-value {
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-size: 0.75rem;
    font-weight: 500;
    color: #5eead4;
    letter-spacing: 0.06em;
}

@keyframes loaderContentIn {
    from {
        opacity: 0;
        transform: scale(0.92) translateY(12px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes loaderGlowFloat {
    0%, 100% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(-12px, 10px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .loader-bg-glow {
        animation: none;
    }

    .loader-content {
        animation: none;
    }
}
</style>
