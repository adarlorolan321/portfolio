<template>
    <button type="button"
            class="theme-toggle"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme()">
        <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"/>
    </button>
</template>

<script setup>
import {useTheme} from "../../composables/theme.js"

const {isDark, toggleTheme} = useTheme()
</script>

<style lang="scss" scoped>
.theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-elevated);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

    &:hover {
        color: var(--color-primary);
        border-color: rgba(var(--color-primary-rgb), 0.45);
        transform: rotate(-8deg) scale(1.05);
    }

    i {
        font-size: 0.85rem;
    }
}
</style>
