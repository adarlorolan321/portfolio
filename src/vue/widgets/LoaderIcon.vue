<template>
    <div class="loader-icon" :class="sizeClass">
        <svg class="loader-icon-ring" viewBox="0 0 88 88" aria-hidden="true">
            <circle class="loader-icon-ring-track"
                    cx="44"
                    cy="44"
                    r="38"
                    fill="none"
                    stroke-width="2"/>
            <circle class="loader-icon-ring-progress"
                    :class="{'loader-icon-ring-progress--indeterminate': isIndeterminate}"
                    cx="44"
                    cy="44"
                    r="38"
                    fill="none"
                    stroke-width="2"
                    stroke-linecap="round"
                    :stroke-dasharray="ringCircumference"
                    :stroke-dashoffset="ringOffset"/>
        </svg>

        <div class="loader-icon-core">
            <span class="loader-icon-bracket">&lt;</span>
            <span class="loader-icon-slash">/</span>
            <span class="loader-icon-bracket">&gt;</span>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue"

const props = defineProps({
    size: {
        type: String,
        default: 'md'
    },
    progress: {
        type: Number,
        default: null
    }
})

const radius = 38
const ringCircumference = 2 * Math.PI * radius

const ringOffset = computed(() => {
    if (isIndeterminate.value) {
        return ringCircumference * 0.72
    }

    const value = Math.min(Math.max(props.progress, 0), 100)
    return ringCircumference * (1 - value / 100)
})

const isIndeterminate = computed(() => {
    return props.progress === null
})

const sizeClass = computed(() => {
    return `loader-icon--${props.size}`
})
</script>

<style lang="scss" scoped>
.loader-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &--sm {
        width: 3.5rem;
        height: 3.5rem;
    }

    &--md {
        width: 5.5rem;
        height: 5.5rem;
    }

    &--lg {
        width: 7rem;
        height: 7rem;
    }
}

.loader-icon-ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.loader-icon-ring-track {
    stroke: var(--color-border, #262626);
    opacity: 0.85;
}

.loader-icon-ring-progress {
    stroke: var(--color-primary, #5eead4);

    &--indeterminate {
        animation: loaderRingDash 1.35s ease-in-out infinite;
    }

    &:not(.loader-icon-ring-progress--indeterminate) {
        transition: stroke-dashoffset 0.2s ease;
    }
}

.loader-icon-core {
    display: flex;
    align-items: center;
    font-family: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: var(--color-heading, #fafafa);
}

.loader-icon--sm .loader-icon-core {
    font-size: 0.95rem;
}

.loader-icon--md .loader-icon-core {
    font-size: 1.35rem;
}

.loader-icon--lg .loader-icon-core {
    font-size: 1.65rem;
}

.loader-icon-slash {
    color: var(--color-primary, #5eead4);
    animation: loaderSlashPulse 1.2s ease-in-out infinite;
}

.loader-icon-bracket {
    opacity: 0.88;
}

@keyframes loaderRingDash {
    0% {
        stroke-dasharray: 1, 240;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 120, 240;
        stroke-dashoffset: -48;
    }
    100% {
        stroke-dasharray: 1, 240;
        stroke-dashoffset: -240;
    }
}

@keyframes loaderSlashPulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.35;
    }
}
</style>
