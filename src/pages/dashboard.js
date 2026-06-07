import { setupLayoutEvents } from '../components/layout.js';
import { auth, qrData, historyData } from '../utils/storage.js';

export const DashboardPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const user    = auth.getCurrentUser() || { name: 'User' };
        const qrs     = qrData.getAll();
        const history = historyData.getAll().slice(0, 5);

        const nameEl = document.getElementById('user-name');
        if (nameEl) nameEl.textContent = user.name;

        document.getElementById('stat-total').textContent    = qrs.length;
        document.getElementById('stat-url').textContent      = qrs.filter(q => q.type === 'URL').length;
        document.getElementById('stat-whatsapp').textContent = qrs.filter(q => q.type === 'WhatsApp').length;
        document.getElementById('stat-wifi').textContent     = qrs.filter(q => q.type === 'WiFi').length;

        const recentEl = document.getElementById('recent-qrs');
        if (qrs.length > 0) {
            recentEl.innerHTML = qrs.slice(0, 4).map(qr => `
                <div class="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl shadow-inner border border-blue-500/20">
                            <i class="ph ph-qr-code"></i>
                        </div>
                        <div>
                            <p class="font-semibold text-white text-sm tracking-wide">${qr.name || qr.type + ' QR'}</p>
                            <p class="text-xs text-slate-400 mt-1">${new Date(qr.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <a href="#/my-qrs" class="text-blue-400 text-xs font-bold hover:text-blue-300 hover:underline transition-colors tracking-widest uppercase">View</a>
                </div>
            `).join('');
        }

        const activityEl = document.getElementById('activity-feed');
        if (history.length > 0) {
            activityEl.innerHTML = history.map(item => `
                <div class="flex items-start gap-4 group">
                    <div class="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <i class="ph ph-check text-sm"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-slate-200 tracking-wide">${item.action}</p>
                        <p class="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">${new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
        }
    }
};
