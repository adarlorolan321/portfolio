/**
 * Created by Ryan Balieiro on 08.23.2023
 * This component will be responsible for overseeing and controlling the application's language.
 */
import {reactive} from "vue"
import {useConstants} from "./constants.js"

const constants = useConstants()

/**
 * @type {Object}
 * @private
 */
const _languageData = reactive({
    supportedLanguages: [],
    defaultLanguage: null,
    selectedLanguage: null
})

/** @type {((from: Object, to: Object, onApply: () => void) => Promise<void>)|null} */
let _transitionHandler = null

/**
 * @param {(from: Object, to: Object, onApply: () => void) => Promise<void>} handler
 */
export function registerLanguageTransitionHandler(handler) {
    _transitionHandler = handler
}

export function unregisterLanguageTransitionHandler() {
    _transitionHandler = null
}

export function useLanguage() {
    /**
     * @param {Array} supportedLanguages
     */
    const init = (supportedLanguages) => {
        _languageData.supportedLanguages = supportedLanguages
        _languageData.defaultLanguage = supportedLanguages.find(language => language['default']) || supportedLanguages[0]
        _detectInitialLanguage()
    }

    /**
     * @private
     */
    const _detectInitialLanguage = () => {
        const localStorageItem = window.localStorage.getItem(constants.LOCAL_STORAGE_ITEMS.language)

        if (!localStorageItem) {
            const detectedLanguage = _languageData.supportedLanguages.find(language => navigator.language.includes(language['id']))
            selectLanguage(detectedLanguage || _languageData.defaultLanguage)
        }
        else {
            selectLanguage(_findLanguageWithId(localStorageItem) || _languageData.defaultLanguage)
        }
    }

    /**
     * @return {boolean}
     */
    const supportsMultipleLanguages = () => {
        return _languageData.supportedLanguages.length > 1
    }

    /**
     * @return {Object|null}
     */
    const getSelectedLanguage = () => {
        return _languageData.selectedLanguage
    }

    /**
     * @return {Object|null}
     */
    const getDefaultLanguage = () => {
        return _languageData.defaultLanguage
    }

    /**
     * @return {Object[]}
     */
    const getAvailableLanguages = () => {
        return _languageData.supportedLanguages
    }

    /**
     * @param {Object} language
     * @param {{animate?: boolean}} [options]
     * @return {Promise<void>}
     */
    const selectLanguage = async (language, options = {}) => {
        const {animate = true} = options
        const previous = _languageData.selectedLanguage

        if (previous?.['id'] === language['id']) {
            return
        }

        const apply = () => {
            _languageData.selectedLanguage = language
            window.localStorage.setItem(constants.LOCAL_STORAGE_ITEMS.language, language['id'])
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (animate && previous && _transitionHandler && !prefersReducedMotion) {
            await _transitionHandler(previous, language, apply)
            return
        }

        apply()
    }

    /**
     * @param {String} languageId
     * @return {Object}
     * @private
     */
    const _findLanguageWithId = (languageId) => {
        return _languageData.supportedLanguages.find(language => language['id'] === languageId) || null
    }

    return {
        init,
        supportsMultipleLanguages,
        getSelectedLanguage,
        getDefaultLanguage,
        getAvailableLanguages,
        selectLanguage
    }
}