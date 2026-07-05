<template>
    <div class="activity-spinner" :class="{'activity-spinner-hidden': !isShowing}">
        <div class="activity-spinner-bg-grid" aria-hidden="true"/>
        <div class="activity-spinner-glow" aria-hidden="true"/>

        <div class="activity-spinner-content">
            <LoaderIcon size="sm"/>
            <p class="activity-spinner-message">{{ message }}</p>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue"
import LoaderIcon from "../widgets/LoaderIcon.vue"

const message = ref('')
const isShowing = ref(false)

const show = (_message) => {
    message.value = _message
    isShowing.value = true
}

const hide = () => {
    isShowing.value = false
}

defineExpose({
    show,
    hide
})
</script>

<style lang="scss" scoped>
.activity-spinner {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(10, 10, 10, 0.88);
    backdrop-filter: blur(8px);
    opacity: 1;
    visibility: visible;
    transition: opacity 0.25s ease, visibility 0.25s ease;

    &-hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
}

.activity-spinner-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(94, 234, 212, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(94, 234, 212, 0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.6;
}

.activity-spinner-glow {
    position: absolute;
    top: 20%;
    right: 15%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(94, 234, 212, 0.1);
    filter: blur(60px);
    pointer-events: none;
}

.activity-spinner-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: rgba(20, 20, 20, 0.75);
    border: 1px solid #262626;
    border-radius: 12px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
}

.activity-spinner-message {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: lowercase;
    letter-spacing: 0.03em;
    color: #a3a3a3;
}
</style>
