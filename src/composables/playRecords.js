const API_PATH = '/api/play-records'

const readJson = async (response) => {
    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(payload.error || 'Unable to save play record')
    }

    return payload
}

export const savePlayRecord = async ({ message, score }) => {
    const response = await fetch(API_PATH, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, score }),
    })

    const payload = await readJson(response)

    return payload.record
}

/**
 * @param {number} [limit]
 * @param {'recent'|'score'} [sort]
 * @return {Promise<Array>}
 */
export const loadPlayRecords = async (limit = 25, sort = 'recent') => {
    const params = new URLSearchParams({ limit: String(limit) })

    if (sort === 'score') {
        params.set('sort', 'score')
    }

    const response = await fetch(`${API_PATH}?${params}`)
    const payload = await readJson(response)

    return payload.records || []
}
