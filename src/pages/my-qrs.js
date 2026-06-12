import { setupLayoutEvents } from '../components/layout.js';
import { qrData } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const sanitizeFileName = (value = 'scanify-qr') => String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'scanify-qr';

const canvasToBlob = (canvas) => new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png');
});

const getQrImageFile = async (qr) => {
    const preview = document.querySelector(`[data-qr-id="${CSS.escape(String(qr.id))}"]`);
    const fileName = `${sanitizeFileName(qr.name || `${qr.type} QR`)}.png`;
    const canvas = preview?.querySelector('canvas');

    if (canvas) {
        const blob = await canvasToBlob(canvas);
        return blob ? new File([blob], fileName, { type: 'image/png' }) : null;
    }

    const image = preview?.querySelector('img');
    if (image?.src) {
        const response = await fetch(image.src);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type || 'image/png' });
    }

    return null;
};

const copyQrLink = async (link) => {
    await navigator.clipboard.writeText(link);
    showToast('Link copied to clipboard.', 'success');
};

const getTextSharePayload = (title, text, link) => {
    try {
        return { title, text, url: new URL(link).href };
    } catch (err) {
        return { title, text };
    }
};

const shareQr = async (qr) => {
    const title = qr.name || `${qr.type} QR`;
    const link = qr.data || '';
    const text = `${title}\n${link}`.trim();

    if (!link) {
        showToast('There is no link to share.', 'error');
        return;
    }

    if (!navigator.share) {
        try {
            await copyQrLink(link);
        } catch (err) {
            showToast('Could not copy link.', 'error');
        }
        return;
    }

    try {
        const file = await getQrImageFile(qr);
        const shareWithFile = file ? { title, text, files: [file] } : null;

        if (shareWithFile && navigator.canShare?.(shareWithFile)) {
            await navigator.share(shareWithFile);
            return;
        }

        await navigator.share(getTextSharePayload(title, text, link));
    } catch (err) {
        if (err?.name === 'AbortError') return;

        try {
            await copyQrLink(link);
        } catch (copyErr) {
            showToast('Could not share this QR code.', 'error');
        }
    }
};

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
                <div class="qr-card-actions">
                    <button type="button" data-copy="${escapeHtml(qr.data || '')}" class="qr-copy-btn">
                        <i class="ph ph-copy"></i>
                        Copy link
                    </button>
                    <button type="button" data-share-id="${escapeHtml(qr.id)}" class="qr-share-btn">
                        <i class="ph ph-share-network"></i>
                        Share
                    </button>
                </div>
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
                showToast('QR code deleted.', 'success');
            }
        });
    });

    grid.querySelectorAll('.qr-copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!btn.dataset.copy) {
                showToast('There is no link to copy.', 'error');
                return;
            }

            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                showToast('Link copied to clipboard.', 'success');
            } catch (err) {
                showToast('Could not copy link.', 'error');
            }
        });
    });

    grid.querySelectorAll('.qr-share-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const qr = qrs.find(item => String(item.id) === btn.dataset.shareId);
            if (!qr) {
                showToast('QR code not found.', 'error');
                return;
            }

            await shareQr(qr);
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
