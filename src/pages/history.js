import { setupLayoutEvents } from '../components/layout.js';
import { historyData } from '../utils/storage.js';

export const HistoryPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const history = historyData.getAll();
        const feedEl = document.getElementById('history-feed');

        if (!history.length) {
            feedEl.innerHTML = `<div class="empty-state">No activity recorded yet.</div>`;
            return;
        }

        feedEl.innerHTML = history.map((item, index) => {
            return `
                <div class="history-item">
                    <div class="history-avatar"><i class="ph ph-check"></i></div>
                    <div class="history-card">
                        <div class="history-card-header">
                            <h4 class="history-title">${item.action}</h4>
                            <span class="history-time">${new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p class="history-text">${item.details || 'System generated event.'}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
};
