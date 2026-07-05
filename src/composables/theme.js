/**
 * Theme preference (dark / light)
 */
import {computed, reactive} from "vue"
import {useConstants} from "./constants.js"

const constants = useConstants()

/** @type {{theme: 'dark'|'light'}} */
const _themeData = reactive({
    theme: 'dark'
})

/** @type {((from: 'dark'|'light', to: 'dark'|'light', onCovered: () => void) => Promise<void>)|null} */
let _transitionHandler = null

/**
 * @param {(from: 'dark'|'light', to: 'dark'|'light', onCovered: () => void) => Promise<void>} handler
 */
export function registerThemeTransitionHandler(handler) {
    _transitionHandler = handler
}

export function unregisterThemeTransitionHandler() {
    _transitionHandler = null
}

/**
 * @param {'dark'|'light'} theme
 * @private
 */
const _applyTheme = (theme) => {
    _themeData.theme = theme
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-bs-theme', theme)
}

export function useTheme() {
    /**
     * @param {'dark'|'light'} [fallback='dark']
     */
    const init = (fallback = 'dark') => {
        const saved = window.localStorage.getItem(constants.LOCAL_STORAGE_ITEMS.theme)

        if (saved === 'dark' || saved === 'light') {
            _applyTheme(saved)
            return
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        _applyTheme(prefersDark ? 'dark' : fallback)
    }

    /**
     * @param {'dark'|'light'} theme
     * @return {Promise<void>}
     */
    const setTheme = async (theme) => {
        if (_themeData.theme === theme) {
            return
        }

        const fromTheme = _themeData.theme
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const apply = () => {
            _applyTheme(theme)
            window.localStorage.setItem(constants.LOCAL_STORAGE_ITEMS.theme, theme)
        }

        if (_transitionHandler && !prefersReducedMotion) {
            await _transitionHandler(fromTheme, theme, apply)
            return
        }

        apply()
    }

    const toggleTheme = async () => {
        await setTheme(_themeData.theme === 'dark' ? 'light' : 'dark')
    }

    /**
     * @return {'dark'|'light'}
     */
    const getTheme = () => {
        return _themeData.theme
    }

    /**
     * @type {import('vue').ComputedRef<boolean>}
     */
    const isDark = computed(() => {
        return _themeData.theme === 'dark'
    })

    return {
        init,
        setTheme,
        toggleTheme,
        getTheme,
        isDark
    }
}
