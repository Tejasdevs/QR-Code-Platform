import { setupLayoutEvents } from '../components/layout.js';
import { historyData } from '../utils/storage.js';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getDateGroupLabel = (date) => {
    const today = startOfDay(new Date());
    const itemDay = startOfDay(date);
    const dayDiff = Math.round((today - itemDay) / 86400000);

    if (dayDiff === 0) return 'Today';
    if (dayDiff === 1) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const getActivityIcon = (action = '') => {
    const lowerAction = action.toLowerCase();

    if (lowerAction.includes('favorite')) return 'ph-star';
    if (lowerAction.includes('delete')) return 'ph-trash';
    if (lowerAction.includes('generate') || lowerAction.includes('created')) return 'ph-link';
    if (lowerAction.includes('share')) return 'ph-share-network';
    if (lowerAction.includes('download')) return 'ph-download-simple';
    if (lowerAction.includes('edit')) return 'ph-pencil-simple';

    return 'ph-check';
};

const renderHistoryGroups = (history) => {
    const groups = history.reduce((acc, item) => {
        const date = new Date(item.timestamp);
        const label = getDateGroupLabel(date);

        if (!acc[label]) acc[label] = [];
        acc[label].push({ ...item, date });
        return acc;
    }, {});

    return Object.entries(groups).map(([label, items]) => `
        <section class="history-group">
            <h2 class="history-date-label">${escapeHtml(label)}</h2>
            <div class="history-card-list">
                ${items.map(item => `
                    <article class="history-event-card">
                        <div class="history-event-icon">
                            <i class="ph ${getActivityIcon(item.action)}"></i>
                        </div>
                        <div class="history-event-body">
                            <div class="history-event-main">
                                <h3 class="history-event-title">${escapeHtml(item.action)}</h3>
                                <time class="history-event-time" datetime="${escapeHtml(item.timestamp)}">
                                    ${item.date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                </time>
                            </div>
                            <p class="history-event-description">${escapeHtml(item.details || 'System generated event')}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    `).join('');
};

export const HistoryPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const history = historyData.getAll();
        const feedEl = document.getElementById('history-feed');

        if (!history.length) {
            feedEl.innerHTML = `
                <div class="history-empty-state">
                    <i class="ph ph-clock-counter-clockwise"></i>
                    <h2>No activity recorded yet</h2>
                    <p>Your generated, deleted, shared, and favorited QR actions will appear here.</p>
                </div>
            `;
            return;
        }

        feedEl.innerHTML = renderHistoryGroups(history);
    }
};
