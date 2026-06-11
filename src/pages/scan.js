import { qrData, scanData } from '../utils/storage.js';
import { canRedirectTo } from '../utils/tracking.js';

const getScanParams = () => {
    const query = window.location.hash.split('?')[1] || '';
    return new URLSearchParams(query);
};

export const ScanPage = {
    afterRender: async () => {
        const messageEl = document.getElementById('scan-message');
        const params = getScanParams();
        const qrId = params.get('id');
        const fallbackDestination = params.get('to') || '';
        const qr = qrData.getAll().find(item => item.id === qrId);
        const destination = qr?.data || fallbackDestination;

        if (qr) {
            scanData.add(qr.id);
        }

        if (canRedirectTo(destination)) {
            if (messageEl) messageEl.textContent = `Redirecting to ${destination}`;
            setTimeout(() => {
                window.location.href = destination;
            }, 700);
            return;
        }

        if (messageEl) {
            messageEl.textContent = destination || 'This QR code could not be opened on this device.';
        }
    }
};
