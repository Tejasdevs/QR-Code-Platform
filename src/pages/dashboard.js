import { setupLayoutEvents } from '../components/layout.js';
import { auth, qrData, historyData } from '../utils/storage.js';

export const DashboardPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const user    = auth.getCurrentUser() || { name: 'User' };
        const qrs     = qrData.getAll();
        const history = historyData.getAll().slice(0, 5);

        const escapeHtml = (value = '') => String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const nameEl = document.getElementById('user-name');
        if (nameEl) nameEl.textContent = user.name;

        document.getElementById('stat-total').textContent    = qrs.length;
        document.getElementById('stat-url').textContent      = qrs.filter(q => q.type === 'URL').length;
        document.getElementById('stat-whatsapp').textContent = qrs.filter(q => q.type === 'WhatsApp').length;
        document.getElementById('stat-wifi').textContent     = qrs.filter(q => q.type === 'WiFi').length;

        const recentEl = document.getElementById('recent-qrs');
        if (recentEl && qrs.length > 0) {
            recentEl.innerHTML = qrs.slice(0, 4).map(qr => `
                <div class="dashboard-qr-row">
                    <div class="dashboard-qr-meta">
                        <div class="dashboard-qr-icon"><i class="ph ph-qr-code"></i></div>
                        <div>
                            <p class="dashboard-qr-title">${escapeHtml(qr.name || `${qr.type} QR`)}</p>
                            <p class="dashboard-qr-date">${new Date(qr.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <span class="dashboard-qr-type">${escapeHtml(qr.type)}</span>
                </div>
            `).join('');
        }

        const activityEl = document.getElementById('activity-feed');
        if (activityEl && history.length > 0) {
            activityEl.innerHTML = history.map(item => `
                <div class="dashboard-activity-item">
                    <div class="dashboard-activity-icon"><i class="ph ph-check"></i></div>
                    <div>
                        <p class="dashboard-activity-title">${escapeHtml(item.action)}</p>
                        <p class="dashboard-activity-date">${new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
        }
    }
};
