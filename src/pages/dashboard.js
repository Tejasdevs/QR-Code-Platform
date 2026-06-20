import { setupLayoutEvents } from '../components/layout.js';
import { auth, qrData } from '../utils/storage.js';

export const DashboardPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const user    = auth.getCurrentUser() || { name: 'User' };
        const qrs     = qrData.getAll();

        const escapeHtml = (value = '') => String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const getGreeting = () => {
            const hour = new Date().getHours();

            if (hour < 12) return 'Good morning';
            if (hour < 17) return 'Good afternoon';
            return 'Good evening';
        };

        const getInitials = (name = 'User') => {
            const parts = String(name).trim().split(/\s+/).filter(Boolean);
            if (parts.length === 0) return 'U';
            if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
            return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
        };

        const greetingEl = document.getElementById('greeting-text');
        if (greetingEl) {
            const updateGreeting = () => {
                greetingEl.textContent = getGreeting();
            };

            updateGreeting();
            window.setInterval(updateGreeting, 60000);
        }

        const nameEl = document.getElementById('user-name');
        if (nameEl) nameEl.textContent = user.name;

        const profileAvatarEl = document.getElementById('dashboard-profile-avatar');
        if (profileAvatarEl) profileAvatarEl.textContent = getInitials(user.name);

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

    }
};
