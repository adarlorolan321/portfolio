import {
    burstAsh,
    buildMorphMarkup,
    estimateAshPoint,
    settleMorph
} from './languageAsh.js'

const EXCLUDED_SELECTOR = [
    '.language-picker',
    '.theme-toggle',
    '.language-transition-wrap',
    '.lang-ash-layer',
    '.custom-cursor',
    '[aria-hidden="true"]'
].join(',')

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'SVG', 'PATH', 'IMG', 'INPUT', 'TEXTAREA', 'SELECT'])

const TARGET_DURATION_MS = 1100
const LONG_TEXT_THRESHOLD = 80

/**
 * @param {Element} element
 * @return {boolean}
 */
const isDecorativeChild = (element) => {
    return element.matches('i, svg, img, [aria-hidden="true"]')
}

/**
 * @param {Element} element
 * @return {boolean}
 */
const isInlineTextChild = (element) => {
    return element.matches('span, a, strong, em, b, small, mark, label')
}

/**
 * @param {Element} element
 * @return {boolean}
 */
const isTypableElement = (element) => {
    if (!(element instanceof HTMLElement)) {
        return false
    }

    if (SKIP_TAGS.has(element.tagName)) {
        return false
    }

    if (element.closest(EXCLUDED_SELECTOR)) {
        return false
    }

    const text = element.innerText?.trim()
    if (!text || text.length === 0) {
        return false
    }

    const meaningfulChildren = [...element.children].filter(child => !isDecorativeChild(child))
    if (meaningfulChildren.length > 0) {
        const usesInlineChildren = meaningfulChildren.every(isInlineTextChild)
        if (!usesInlineChildren) {
            return false
        }
    }

    const rect = element.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
        return false
    }

    return true
}

/**
 * @param {ParentNode} root
 * @return {HTMLElement[]}
 */
const collectTypableElements = (root) => {
    const candidates = [...root.querySelectorAll('*')]
    const typable = candidates.filter(isTypableElement)

    return typable.filter(element => {
        return !typable.some(other => other !== element && other.contains(element))
    })
}

/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
export const preservesMarkup = (element) => {
    return /<(?:br|a|strong|em|b|span)\b/i.test(element.innerHTML)
}

/**
 * @param {ParentNode} root
 * @return {{el: HTMLElement, oldText: string, top: number, left: number, oldHtml: string|null}[]}
 */
export const captureTypingJobs = (root) => {
    return collectTypableElements(root)
        .map((el) => {
            const rect = el.getBoundingClientRect()

            return {
                el,
                oldText: el.innerText.trim(),
                top: rect.top,
                left: rect.left,
                oldHtml: preservesMarkup(el) ? el.innerHTML : null
            }
        })
        .filter((job) => job.oldText.length > 0)
        .sort((a, b) => a.top - b.top || a.left - b.left)
}

/**
 * @param {{el: HTMLElement, oldText: string, oldHtml: string|null, newText: string, newHtml: string|null}[]} jobs
 */
export const restoreJobsOldText = (jobs) => {
    jobs.forEach((job) => {
        if (!job.el?.isConnected) {
            return
        }

        if (job.oldHtml) {
            job.el.innerHTML = job.oldHtml
        }
        else {
            job.el.textContent = job.oldText
        }
    })
}

/**
 * @param {{el: HTMLElement}[]} jobs
 */
export const captureJobsNewText = (jobs) => {
    jobs.forEach((job) => {
        if (!job.el?.isConnected) {
            job.newText = job.oldText
            job.newHtml = null
            return
        }

        job.newText = job.el.innerText.trim()
        job.newHtml = preservesMarkup(job.el) ? job.el.innerHTML : null
    })
}

/**
 * @param {{el: HTMLElement, oldText: string, newText: string, newHtml: string|null}} job
 */
const finishJob = (job) => {
    if (!job.el.isConnected) {
        return
    }

    if (job.newHtml) {
        job.el.innerHTML = job.newHtml
    }
    else {
        job.el.textContent = job.newText
    }

    settleMorph(job.el)
}

/**
 * @param {{step: number, steps: number, oldText: string, newText: string, isLong: boolean}} job
 * @return {number}
 */
const getReplaceCount = (job) => {
    const total = Math.max(job.oldText.length, job.newText.length)

    if (!job.isLong) {
        return job.step
    }

    return Math.min(total, Math.round((job.step / job.steps) * total))
}

/**
 * @param {{el: HTMLElement, oldText: string, newText: string, newHtml: string|null, step: number, steps: number, anchor: object, done: boolean, isLong: boolean}[]} jobs
 * @return {Promise<void>}
 */
const runMorphFrameLoop = (jobs) => {
    return new Promise((resolve) => {
        const startedAt = performance.now()
        let lastAshAt = 0

        const tick = (now) => {
            const progress = Math.min((now - startedAt) / TARGET_DURATION_MS, 1)

            for (const job of jobs) {
                if (job.done) {
                    continue
                }

                job.step = Math.min(job.steps, Math.round(progress * job.steps))
                job.el.innerHTML = buildMorphMarkup(job.oldText, job.newText, getReplaceCount(job))

                if (progress >= 1) {
                    finishJob(job)
                    job.done = true
                }
            }

            if (progress < 1 && now - lastAshAt > 52) {
                const activeJob = jobs.find((job) => !job.done && job.step > 0)

                if (activeJob) {
                    const point = estimateAshPoint({
                        x: activeJob.anchor.left,
                        y: activeJob.anchor.top + activeJob.anchor.height * 0.5,
                        width: activeJob.anchor.width,
                        step: getReplaceCount(activeJob),
                        steps: Math.max(activeJob.oldText.length, activeJob.newText.length)
                    })
                    burstAsh(point.x, point.y)
                    lastAshAt = now
                }
            }

            if (progress >= 1) {
                resolve()
                return
            }

            requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
    })
}

/**
 * @param {{el: HTMLElement, oldText: string, newText: string, newHtml: string|null}[]} jobs
 * @return {Promise<void>}
 */
export async function runLanguageTypewriter(jobs) {
    if (!jobs?.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
    }

    const activeJobs = jobs
        .filter((job) => job.el?.isConnected && job.oldText !== job.newText)
        .map((job) => {
            const rect = job.el.getBoundingClientRect()
            const isLong = Math.max(job.oldText.length, job.newText.length) > LONG_TEXT_THRESHOLD

            return {
                ...job,
                step: 0,
                steps: isLong
                    ? Math.ceil(Math.max(job.oldText.length, job.newText.length) / 3)
                    : Math.max(job.oldText.length, job.newText.length),
                done: false,
                anchor: {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                },
                isLong
            }
        })

    if (activeJobs.length === 0) {
        return
    }

    activeJobs.forEach((job) => {
        job.el.classList.add('lang-morph-active', 'lang-morph-casting')
    })

    await runMorphFrameLoop(activeJobs)
}

/**
 * @param {{el: HTMLElement, newText: string, newHtml: string|null}[]} jobs
 */
export const finalizeJobs = (jobs) => {
    jobs.forEach((job) => {
        if (!job.el?.isConnected) {
            return
        }

        if (job.newHtml) {
            job.el.innerHTML = job.newHtml
        }
        else {
            job.el.textContent = job.newText
        }

        settleMorph(job.el)
    })
}
