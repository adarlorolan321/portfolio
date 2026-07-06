<template>
    <div class="typing-sprint"
         :class="{
             'typing-sprint--idle': state === 'idle',
             'typing-sprint--playing': state === 'playing',
             'typing-sprint--done': state === 'done'
         }"
         @click="focusInput">

        <div class="typing-sprint__marquee" aria-hidden="true">
            <span class="typing-sprint__marquee-track">
                ★ INSERT COIN ★ TYPING SPRINT ★ DEV MODE ★ HIGH SCORE {{ bestWpm }} ★
            </span>
        </div>

        <div class="typing-sprint__hud">
            <div class="typing-sprint__hud-item">
                <span class="typing-sprint__hud-label">{{ locales.wpm }}</span>
                <span class="typing-sprint__hud-value">{{ displayWpm }}</span>
            </div>
            <div class="typing-sprint__hud-item typing-sprint__hud-item--center">
                <span class="typing-sprint__hud-title">{{ locales.gameTitle }}</span>
            </div>
            <div class="typing-sprint__hud-item typing-sprint__hud-item--right">
                <span class="typing-sprint__hud-label">{{ locales.time }}</span>
                <span class="typing-sprint__hud-value">{{ displayTime }}</span>
            </div>
        </div>

        <div class="typing-sprint__screen">
            <div class="typing-sprint__scanlines" aria-hidden="true"/>

            <div v-if="state === 'idle'"
                 class="typing-sprint__overlay"
                 @click="startGame">
                <p class="typing-sprint__insert-coin">INSERT COIN</p>
                <button type="button"
                        class="typing-sprint__start-btn"
                        @click.stop="startGame">
                    {{ locales.pressStart }}
                </button>
            </div>

            <div v-else-if="state === 'done'" class="typing-sprint__overlay typing-sprint__overlay--results">
                <p class="typing-sprint__stage-clear">{{ locales.stageClear }}</p>
                <div class="typing-sprint__results">
                    <span>{{ locales.wpm }} {{ finalWpm }}</span>
                    <span>{{ locales.accuracy }} {{ finalAccuracy }}%</span>
                    <span>{{ locales.best }} {{ bestWpm }}</span>
                </div>
                <button type="button"
                        class="typing-sprint__start-btn"
                        @click.stop="startGame">
                    {{ locales.tryAgain }}
                </button>
            </div>

            <p class="typing-sprint__prompt" aria-live="polite">
                <span v-for="(char, index) in promptChars"
                      :key="index"
                      class="typing-sprint__char"
                      :class="charClass(index)">{{ char === ' ' ? '\u00a0' : char }}</span>
            </p>

            <input v-if="state === 'playing'"
                   ref="inputRef"
                   class="typing-sprint__input"
                   type="text"
                   v-model="typed"
                   autocomplete="off"
                   autocorrect="off"
                   autocapitalize="off"
                   spellcheck="false"
                   aria-label="Typing sprint input"
                   @input="onInput"
                   @keydown="onKeydown">
        </div>

        <div class="typing-sprint__footer">
            <span>{{ locales.accuracy }} {{ liveAccuracy }}%</span>
            <span>{{ locales.best }} {{ bestWpm }} {{ locales.wpm }}</span>
        </div>
    </div>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue"

const STORAGE_KEY = 'app.play.typingBestWpm'

/**
 * @property {Object} content
 */
const props = defineProps({
    content: Object
})

const state = ref('idle')
const prompt = ref('')
const typed = ref('')
const startedAt = ref(null)
const finishedAt = ref(null)
const bestWpm = ref(0)
const tick = ref(0)
const inputRef = ref(null)

let timerId = null

/**
 * @type {import('vue').ComputedRef<Object>}
 */
const locales = computed(() => {
    return props.content?.locales ?? {}
})

/**
 * @type {import('vue').ComputedRef<string[]>}
 */
const promptChars = computed(() => {
    return prompt.value.split('')
})

/**
 * @return {string}
 */
const pickPrompt = () => {
    const prompts = props.content?.prompts ?? []

    if (!prompts.length) {
        return 'npm run build'
    }

    return prompts[Math.floor(Math.random() * prompts.length)]
}

/**
 * @param {number} index
 * @return {Object}
 */
const charClass = (index) => {
    if (index >= typed.value.length) {
        return {
            'typing-sprint__char--cursor': index === typed.value.length && state.value === 'playing'
        }
    }

    return {
        'typing-sprint__char--correct': typed.value[index] === prompt.value[index],
        'typing-sprint__char--wrong': typed.value[index] !== prompt.value[index]
    }
}

/**
 * @return {number}
 */
const elapsedMs = computed(() => {
    if (!startedAt.value) {
        return 0
    }

    const end = finishedAt.value ?? (startedAt.value + tick.value)
    return Math.max(end - startedAt.value, 0)
})

/**
 * @param {number} charCount
 * @param {number} ms
 * @return {number}
 */
const calcWpm = (charCount, ms) => {
    if (!ms) {
        return 0
    }

    const minutes = ms / 60000
    const words = charCount / 5

    return Math.round(words / minutes)
}

/**
 * @param {string} value
 * @param {string} target
 * @return {number}
 */
const calcAccuracy = (value, target) => {
    if (!value.length) {
        return 100
    }

    let correct = 0

    for (let i = 0; i < value.length; i++) {
        if (value[i] === target[i]) {
            correct++
        }
    }

    return Math.round((correct / value.length) * 100)
}

/**
 * @type {import('vue').ComputedRef<number>}
 */
const liveAccuracy = computed(() => {
    return calcAccuracy(typed.value, prompt.value)
})

/**
 * @type {import('vue').ComputedRef<number>}
 */
const finalWpm = computed(() => {
    return calcWpm(prompt.value.length, elapsedMs.value)
})

/**
 * @type {import('vue').ComputedRef<number>}
 */
const finalAccuracy = computed(() => {
    return calcAccuracy(typed.value, prompt.value)
})

/**
 * @type {import('vue').ComputedRef<number>}
 */
const displayWpm = computed(() => {
    if (state.value === 'idle') {
        return 0
    }

    if (state.value === 'done') {
        return finalWpm.value
    }

    return calcWpm(typed.value.length, elapsedMs.value)
})

/**
 * @type {import('vue').ComputedRef<string>}
 */
const displayTime = computed(() => {
    const seconds = elapsedMs.value / 1000
    return `${seconds.toFixed(1)}s`
})

/**
 * @return {void}
 */
const loadBest = () => {
    const stored = Number(localStorage.getItem(STORAGE_KEY))

    if (!Number.isNaN(stored) && stored > 0) {
        bestWpm.value = stored
    }
}

/**
 * @return {void}
 */
const saveBest = () => {
    if (finalWpm.value > bestWpm.value) {
        bestWpm.value = finalWpm.value
        localStorage.setItem(STORAGE_KEY, String(bestWpm.value))
    }
}

/**
 * @return {void}
 */
const startTimer = () => {
    stopTimer()
    tick.value = 0
    timerId = window.setInterval(() => {
        tick.value += 100
    }, 100)
}

/**
 * @return {void}
 */
const stopTimer = () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    }
}

/**
 * @return {void}
 */
const focusInput = () => {
    if (state.value === 'playing') {
        inputRef.value?.focus()
    }
}

/**
 * @return {void}
 */
const startGame = () => {
    prompt.value = pickPrompt()
    typed.value = ''
    startedAt.value = null
    finishedAt.value = null
    tick.value = 0
    state.value = 'playing'
    stopTimer()

    nextTick(() => {
        inputRef.value?.focus()
        inputRef.value?.select?.()
    })
}

/**
 * @param {Event} event
 * @return {void}
 */
const onInput = () => {
    if (state.value !== 'playing') {
        return
    }

    if (!startedAt.value && typed.value.length > 0) {
        startedAt.value = performance.now()
        startTimer()
    }

    if (typed.value.length > prompt.value.length) {
        typed.value = typed.value.slice(0, prompt.value.length)
    }

    if (typed.value.length === prompt.value.length) {
        finishedAt.value = performance.now()
        stopTimer()
        state.value = 'done'
        saveBest()
    }
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
const onKeydown = (event) => {
    if (state.value !== 'playing') {
        return
    }

    if (event.key === 'Tab') {
        event.preventDefault()
    }
}

onMounted(() => {
    loadBest()
})

onUnmounted(() => {
    stopTimer()
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.typing-sprint {
    --arcade-bg: #120018;
    --arcade-screen: #05010a;
    --arcade-cyan: #00f5ff;
    --arcade-magenta: #ff2bd6;
    --arcade-yellow: #ffe566;
    --arcade-green: #39ff14;
    --arcade-red: #ff3355;
    --arcade-font-title: 'Press Start 2P', monospace;
    --arcade-font-body: 'VT323', monospace;

    position: relative;
    padding: 0.85rem;
    background:
        linear-gradient(180deg, #2a1038 0%, #1a0824 100%);
    border: 4px solid #4a1f62;
    box-shadow:
        0 0 0 2px #120018,
        0 0 0 6px var(--arcade-magenta),
        0 0 24px rgba(255, 43, 214, 0.35),
        inset 0 0 30px rgba(0, 0, 0, 0.45);
    image-rendering: pixelated;
}

.typing-sprint__marquee {
    overflow: hidden;
    margin-bottom: 0.75rem;
    padding: 0.35rem 0;
    background: #000;
    border: 2px solid var(--arcade-cyan);
}

.typing-sprint__marquee-track {
    display: inline-block;
    padding-left: 100%;
    font-family: var(--arcade-font-title);
    font-size: 0.45rem;
    line-height: 1.6;
    letter-spacing: 0.08em;
    color: var(--arcade-yellow);
    white-space: nowrap;
    animation: typing-marquee 14s linear infinite;
}

.typing-sprint__hud {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.5rem;
    align-items: end;
    margin-bottom: 0.65rem;
}

.typing-sprint__hud-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    &--center {
        align-items: center;
        text-align: center;
    }

    &--right {
        align-items: flex-end;
        text-align: right;
    }
}

.typing-sprint__hud-label,
.typing-sprint__hud-title,
.typing-sprint__footer {
    font-family: var(--arcade-font-title);
    font-size: 0.42rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.typing-sprint__hud-label {
    color: var(--arcade-magenta);
}

.typing-sprint__hud-title {
    font-size: 0.5rem;
    color: var(--arcade-cyan);
    text-shadow: 0 0 8px rgba(0, 245, 255, 0.65);
}

.typing-sprint__hud-value {
    font-family: var(--arcade-font-body);
    font-size: 1.65rem;
    line-height: 1;
    color: var(--arcade-yellow);
    text-shadow: 0 0 10px rgba(255, 229, 102, 0.45);
}

.typing-sprint__screen {
    position: relative;
    min-height: 9.5rem;
    padding: 1.25rem 1rem 1rem;
    background:
        radial-gradient(ellipse at center, rgba(0, 245, 255, 0.06) 0%, transparent 65%),
        var(--arcade-screen);
    border: 3px solid #2f1440;
    box-shadow:
        inset 0 0 40px rgba(0, 0, 0, 0.85),
        inset 0 0 0 1px rgba(0, 245, 255, 0.15);
    overflow: hidden;
}

.typing-sprint__scanlines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.22) 0,
        rgba(0, 0, 0, 0.22) 1px,
        transparent 1px,
        transparent 3px
    );
    opacity: 0.35;
}

.typing-sprint__overlay {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(5, 1, 10, 0.82);
}

.typing-sprint__overlay--results {
    gap: 0.75rem;
}

.typing-sprint__insert-coin {
    margin: 0;
    font-family: var(--arcade-font-title);
    font-size: 0.55rem;
    color: var(--arcade-magenta);
    letter-spacing: 0.1em;
    animation: typing-blink 1.1s steps(1) infinite;
}

.typing-sprint__stage-clear {
    margin: 0;
    font-family: var(--arcade-font-title);
    font-size: 0.72rem;
    color: var(--arcade-green);
    letter-spacing: 0.08em;
    text-shadow: 0 0 12px rgba(57, 255, 20, 0.55);
    animation: typing-pop 0.45s ease;
}

.typing-sprint__results {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.65rem 1rem;
    font-family: var(--arcade-font-body);
    font-size: 1.35rem;
    color: var(--arcade-cyan);
}

.typing-sprint__start-btn {
    position: relative;
    z-index: 1;
    padding: 0.7rem 1rem;
    font-family: var(--arcade-font-title);
    font-size: 0.5rem;
    letter-spacing: 0.08em;
    color: #120018;
    background: var(--arcade-yellow);
    border: 0;
    box-shadow:
        0 4px 0 #b89600,
        0 0 16px rgba(255, 229, 102, 0.45);
    cursor: pointer;
    animation: typing-blink 1.2s steps(1) infinite;

    &:hover {
        filter: brightness(1.08);
    }

    &:active {
        transform: translateY(2px);
        box-shadow:
            0 2px 0 #b89600,
            0 0 10px rgba(255, 229, 102, 0.35);
    }
}

.typing-sprint__prompt {
    position: relative;
    z-index: 1;
    margin: 0;
    min-height: 4.5rem;
    font-family: var(--arcade-font-body);
    font-size: clamp(1.35rem, 4vw, 2rem);
    line-height: 1.45;
    letter-spacing: 0.04em;
    word-break: break-all;
    color: rgba(255, 255, 255, 0.28);
}

.typing-sprint__char {
    transition: color 0.08s linear, text-shadow 0.08s linear;

    &--correct {
        color: var(--arcade-green);
        text-shadow: 0 0 8px rgba(57, 255, 20, 0.45);
    }

    &--wrong {
        color: var(--arcade-red);
        text-shadow: 0 0 8px rgba(255, 51, 85, 0.45);
    }

    &--cursor {
        color: var(--arcade-yellow);
        background: rgba(255, 229, 102, 0.18);
        box-shadow: inset 0 -2px 0 var(--arcade-yellow);
        animation: typing-cursor 0.9s steps(1) infinite;
    }
}

.typing-sprint__input {
    position: absolute;
    inset: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: text;
    border: 0;
    background: transparent;
    color: transparent;
    caret-color: transparent;
}

.typing-sprint__footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 0.65rem;
    color: var(--arcade-cyan);
}

.typing-sprint--idle .typing-sprint__prompt {
    opacity: 0.25;
    filter: blur(1px);
}

@keyframes typing-marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
}

@keyframes typing-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0.35; }
}

@keyframes typing-cursor {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0.2; }
}

@keyframes typing-pop {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

@include media-breakpoint-down(sm) {
    .typing-sprint__hud-title {
        font-size: 0.42rem;
    }

    .typing-sprint__hud-value {
        font-size: 1.35rem;
    }

    .typing-sprint__start-btn {
        font-size: 0.42rem;
    }
}
</style>
