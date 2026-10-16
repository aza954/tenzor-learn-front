async function requestJson(url, signal) {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Сервер вернул ошибку ${response.status}. Попробуйте ещё раз.`);
    }
    return response.json();
}

function isValidDate(date) {
    if (!date || !['day', 'month', 'year'].every(field => Number.isInteger(date[field]))) return false;
    const value = new Date(date.year, date.month, date.day);
    return value.getFullYear() === date.year && value.getMonth() === date.month && value.getDate() === date.day;
}

export async function fetchToday({ signal } = {}) {
    const data = await requestJson('/api/booking/today', signal);
    if (!isValidDate(data)) throw new Error('Сервер вернул некорректную дату.');
    return data;
}

export async function fetchSlots(date, { signal } = {}) {
    const query = new URLSearchParams({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    });
    const data = await requestJson(`/api/slots?${query}`, signal);
    if (!data || !isValidDate(data.date) || !Array.isArray(data.slots) || data.slots.some(slot => (
        !slot || !/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.time) || typeof slot.available !== 'boolean'
    ))) {
        throw new Error('Сервер вернул некорректные слоты.');
    }
    return data;
}
