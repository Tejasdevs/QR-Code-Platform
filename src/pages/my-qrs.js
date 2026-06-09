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
        <div class="card-qr group">
            <div class="qr-row">
                <div class="qr-meta">
                    <div class="qr-icon">
                        <i class="ph ph-qr-code"></i>
                    </div>
                    <div>
                        <h4 class="qr-title">${qr.name || qr.type + ' QR'}</h4>
                        <span class="qr-badge">${qr.type}</span>
                    </div>
                </div>
                <button data-id="${qr.id}" class="qr-delete-btn">
                    <i class="ph ph-trash icon-lg"></i>
                </button>
            </div>
            <p class="qr-data">${qr.data || ''}</p>
            <div class="qr-footer">
                <span class="qr-date">${new Date(qr.createdAt).toLocaleDateString()}</span>
                <a href="#/generator" class="qr-recreate">Recreate</a>
            </div>
        </div>
    `).join('');

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
