/** @type {HTMLElement|null} */
let _ashRoot = null

const MAX_ASH_NODES = 60

/**
 * @return {HTMLElement}
 */
const ensureAshRoot = () => {
    if (_ashRoot && document.body.contains(_ashRoot)) {
        return _ashRoot
    }

    _ashRoot = document.createElement('div')
    _ashRoot.className = 'lang-ash-layer'
    _ashRoot.setAttribute('aria-hidden', 'true')
    document.body.appendChild(_ashRoot)
    return _ashRoot
}

/**
 * @param {HTMLElement|null} root
 */
export const setAshRoot = (root) => {
    if (root) {
        _ashRoot = root
        return
    }

    if (_ashRoot) {
        _ashRoot.remove()
        _ashRoot = null
    }
}

/**
 * @param {string} value
 * @return {string}
 */
export const escapeHtml = (value) => {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

/**
 * @param {string} oldText
 * @param {string} newText
 * @param {number} replaceCount
 * @return {string}
 */
export const buildMorphMarkup = (oldText, newText, replaceCount) => {
    const newPart = newText.slice(0, replaceCount)
    const oldPart = oldText.slice(replaceCount)

    if (replaceCount <= 0) {
        return `<span class="lang-morph-old">${escapeHtml(oldText)}</span>`
    }

    if (replaceCount >= Math.max(oldText.length, newText.length)) {
        return `<span class="lang-morph-new">${escapeHtml(newText)}</span>`
    }

    return [
        `<span class="lang-morph-new">${escapeHtml(newPart)}</span>`,
        `<span class="lang-morph-dissolve">${escapeHtml(oldPart)}</span>`
    ].join('')
}

/**
 * @param {number} x
 * @param {number} y
 */
export const burstAsh = (x, y) => {
    const root = _ashRoot ?? ensureAshRoot()

    while (root.childElementCount >= MAX_ASH_NODES) {
        root.firstElementChild?.remove()
    }

    const count = 2

    for (let i = 0; i < count; i++) {
        const ash = document.createElement('span')
        const isEmber = Math.random() > 0.82

        ash.className = isEmber ? 'lang-ash lang-ash--ember' : 'lang-ash'
        ash.style.left = `${x + (Math.random() - 0.5) * 10}px`
        ash.style.top = `${y + (Math.random() - 0.5) * 6}px`
        ash.style.setProperty('--dx', `${(Math.random() - 0.5) * 24}px`)
        ash.style.setProperty('--dy', `${-12 - Math.random() * 28}px`)
        ash.style.setProperty('--rot', `${(Math.random() - 0.5) * 100}deg`)
        ash.style.setProperty('--size', `${2 + Math.random() * 2}px`)

        root.appendChild(ash)

        window.setTimeout(() => {
            ash.remove()
        }, 650)
    }
}

/**
 * @param {HTMLElement} element
 */
export const settleMorph = (element) => {
    element.classList.remove('lang-morph-active', 'lang-morph-casting')
}

/**
 * @param {{x: number, y: number, width: number, step: number, steps: number}} anchor
 * @return {{x: number, y: number}}
 */
export const estimateAshPoint = (anchor) => {
    const progress = anchor.steps > 0 ? anchor.step / anchor.steps : 0

    return {
        x: anchor.x + anchor.width * Math.min(progress, 1),
        y: anchor.y
    }
}
