import { today, getSlotsForDate } from './database.js';

const DELAY_MS = 700;

function sendJson(response, status, data) {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(data));
}

function readDate(searchParams) {
    const fields = ['day', 'month', 'year'];
    if (fields.some(field => !/^\d+$/.test(searchParams.get(field) || ''))) return null;
    const [day, month, year] = fields.map(field => Number(searchParams.get(field)));
    if (year < 1000 || year > 9999 || month < 0 || month > 11 || day < 1 || day > 31) return null;
    const date = new Date(year, month, day);
    if (date.getDate() !== day || date.getMonth() !== month) return null;
    return { day, month, year };
}

export function apiMiddleware(request, response, next) {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return next();

    // Задержка имитирует сеть, чтобы были видны состояния загрузки.
    setTimeout(() => {
        if (response.destroyed) return;
        try {
            if (request.method !== 'GET') {
                response.setHeader('Allow', 'GET');
                return sendJson(response, 405, { error: 'Поддерживаются только GET-запросы.' });
            }
            if (url.pathname === '/api/booking/today') {
                return sendJson(response, 200, today);
            }
            if (url.pathname === '/api/slots') {
                const date = readDate(url.searchParams);
                if (!date) return sendJson(response, 400, { error: 'Укажите корректные day, month и year. Месяц — от 0 до 11.' });
                return sendJson(response, 200, { date, slots: getSlotsForDate(date) });
            }
            return sendJson(response, 404, { error: 'Эндпоинт не найден.' });
        } catch {
            return sendJson(response, 500, { error: 'Не удалось получить данные сервера.' });
        }
    }, DELAY_MS);
}

export default function bookingApiPlugin() {
    return {
        name: 'booking-api',
        configureServer(server) {
            server.middlewares.use(apiMiddleware);
        },
        configurePreviewServer(server) {
            server.middlewares.use(apiMiddleware);
        }
    };
}
