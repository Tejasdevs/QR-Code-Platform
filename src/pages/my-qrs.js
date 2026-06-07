/** src/pages/my-qrs.js */
import { setupLayoutEvents } from '../components/layout.js';
import { qrData } from '../utils/storage.js';

const renderGrid = (qrs) => {
    const grid     = document.getElementById('qr-grid');
    const emptyEl  = document.getElementById('empty-state');

    if (!qrs.length) {
        grid.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');
    grid.innerHTML = qrs.map(qr => `
        <div class="glass-card rounded-3xl p-6 flex flex-col gap-5 hover:border-blue-500/30 transition-all group">
            <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl shadow-inner border border-blue-500/20 group-hover:scale-105 transition-transform">
                        <i class="ph ph-qr-code"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-base truncate max-w-[140px] tracking-tight">${qr.name || qr.type + ' QR'}</h4>
                        <span class="text-[10px] px-2 py-0.5 mt-1 inline-block rounded-full bg-blue-500/20 text-blue-300 font-bold tracking-widest uppercase border border-blue-500/20">${qr.type}</span>
                    </div>
                </div>
                <button data-id="${qr.id}" class="delete-btn text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg p-2 transition-colors">
                    <i class="ph ph-trash text-xl"></i>
                </button>
            </div>
            <p class="text-sm text-slate-400 truncate bg-black/20 p-3 rounded-xl border border-white/5 font-mono">${qr.data || ''}</p>
            <div class="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                <span class="uppercase tracking-widest font-semibold">${new Date(qr.createdAt).toLocaleDateString()}</span>
                <a href="#/generator" class="text-blue-400 font-bold hover:text-blue-300 hover:underline uppercase tracking-widest">Recreate</a>
            </div>
        </div>
    `).join('');

    // Delete handlers
    grid.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this QR code permanently?')) {
                qrData.delete(btn.dataset.id);
                renderGrid(qrData.getAll());
            }
        });
    });
};

export const MyQRsPage = {
    afterRender: async () => {
        setupLayoutEvents();
        renderGrid(qrData.getAll());

        document.getElementById('search-input').addEventListener('input', e => {
            const term = e.target.value.toLowerCase();
            const filtered = qrData.getAll().filter(qr =>
                (qr.name || '').toLowerCase().includes(term) ||
                qr.type.toLowerCase().includes(term) ||
                (qr.data || '').toLowerCase().includes(term)
            );
            renderGrid(filtered);
        });
    }
};
