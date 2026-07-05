/**
 * Tech stack & section icon helpers
 */

/** @type {Record<string, string>} */
const STACK_ICONS = {
    'Vue 3': 'fab fa-vuejs',
    'Laravel': 'fab fa-laravel',
    'JavaScript': 'fab fa-js',
    'TypeScript': 'fab fa-js',
    'React': 'fab fa-react',
    'Next.js': 'fa-solid fa-n',
    'PHP': 'fab fa-php',
    'MySQL': 'fa-solid fa-database',
    'PostgreSQL': 'fa-solid fa-database',
    'HTML5': 'fab fa-html5',
    'CSS3': 'fab fa-css3-alt',
    'Sass': 'fab fa-sass',
    'Docker': 'fab fa-docker',
    'Git': 'fab fa-git-alt',
    'REST APIs': 'fa-solid fa-plug',
    'Bootstrap': 'fab fa-bootstrap',
    'Vite': 'fa-solid fa-bolt'
}

/** @type {Record<string, string>} */
const TIMELINE_ICONS = {
    education: 'fa-solid fa-graduation-cap',
    experience: 'fa-solid fa-laptop-code',
    certifications: 'fa-solid fa-award'
}

/** @type {Record<string, string>} */
const STAT_ICONS = {
    'yrs shipping': 'fa-solid fa-code-commit',
    'años de experiencia': 'fa-solid fa-code-commit',
    'ans d\'expérience': 'fa-solid fa-code-commit',
    '年开发经验': 'fa-solid fa-code-commit',
    'projects shipped': 'fa-solid fa-rocket',
    'proyectos entregados': 'fa-solid fa-rocket',
    'projets livrés': 'fa-solid fa-rocket',
    '已交付项目': 'fa-solid fa-rocket',
    'companies': 'fa-solid fa-building',
    'empresas': 'fa-solid fa-building',
    'entreprises': 'fa-solid fa-building',
    '合作公司': 'fa-solid fa-building'
}

/**
 * @param {string} label
 * @return {string}
 */
export function getStackIcon(label) {
    return STACK_ICONS[label] ?? 'fa-solid fa-code'
}

/**
 * @param {string} sectionId
 * @return {string}
 */
export function getTimelineSectionIcon(sectionId) {
    return TIMELINE_ICONS[sectionId] ?? 'fa-solid fa-circle-dot'
}

/**
 * @param {string} label
 * @return {string}
 */
export function getStatIcon(label) {
    const key = (label ?? '').toLowerCase()
    return STAT_ICONS[key] ?? 'fa-solid fa-chart-simple'
}

/**
 * @param {string|null|undefined} faIcon
 * @return {string|null}
 */
export function normalizeFaIcon(faIcon) {
    if (!faIcon) {
        return null
    }

    return faIcon
        .replace(/\bfas fa-brands\b/g, 'fab')
        .replace(/\bfa fa-/g, 'fa-solid fa-')
        .replace(/\bfab fa-brands\b/g, 'fab')
        .trim()
}
