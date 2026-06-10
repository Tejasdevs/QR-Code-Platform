import { setupLayoutEvents } from '../components/layout.js';
import { qrData } from '../utils/storage.js';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

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
            <div class="qr-card-top">
                <span class="qr-badge">${escapeHtml(qr.type)}</span>
                <button data-id="${escapeHtml(qr.id)}" class="qr-delete-btn" aria-label="Delete ${escapeHtml(qr.name || qr.type + ' QR')}">
                    <i class="ph ph-trash icon-lg"></i>
                </button>
            </div>

            <div class="saved-qr-preview" data-qr-id="${escapeHtml(qr.id)}"></div>

            <div class="saved-qr-info">
                <h4 class="qr-title">${escapeHtml(qr.name || qr.type + ' QR')}</h4>
                <a class="qr-data" href="${qr.type === 'URL' ? escapeHtml(qr.data || '#') : '#'}" target="_blank" rel="noopener noreferrer">
                    ${escapeHtml(qr.data || '')}
                </a>
            </div>

            <div class="qr-footer">
                <span class="qr-date">${new Date(qr.createdAt).toLocaleDateString()}</span>
                <a href="#/generator" class="qr-recreate">Recreate</a>
            </div>
        </div>
    `).join('');

    qrs.forEach(qr => {
        const target = grid.querySelector(`[data-qr-id="${CSS.escape(qr.id)}"]`);
        if (target && qr.data && window.QRCode) {
            new QRCode(target, {
                text: qr.data,
                width: 132,
                height: 132,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    });

    grid.querySelectorAll('.qr-delete-btn').forEach(btn => {
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
