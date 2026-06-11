import { setupLayoutEvents } from '../components/layout.js';
import { qrData, scanData } from '../utils/storage.js';

const startOfToday = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
};

const startOfWeek = () => {
    const date = startOfToday();
    date.setDate(date.getDate() - date.getDay());
    return date;
};

const formatDateTime = (value) => new Date(value).toLocaleString();

const emptyState = (message) => `
    <div class="track-empty">
        <p>${message}</p>
    </div>
`;

export const TrackPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const renderTrackData = () => {
            const qrs = qrData.getAll();
            const scans = scanData.getAll();
            const today = startOfToday();
            const week = startOfWeek();

            document.getElementById('track-total').textContent = scans.length;
            document.getElementById('track-today').textContent = scans.filter(scan => new Date(scan.scannedAt) >= today).length;
            document.getElementById('track-week').textContent = scans.filter(scan => new Date(scan.scannedAt) >= week).length;

            const recentEl = document.getElementById('recent-scans');
            if (!scans.length) {
                recentEl.innerHTML = emptyState('No scans yet.');
            } else {
                recentEl.innerHTML = scans.slice(0, 8).map(scan => {
                    const qr = qrs.find(item => item.id === scan.qrId);
                    return `
                        <div class="track-row">
                            <div>
                                <strong>${qr?.name || qr?.type + ' QR' || 'Deleted QR'}</strong>
                                <span>${formatDateTime(scan.scannedAt)}</span>
                            </div>
                            <p>${qr?.data || 'Original QR no longer exists'}</p>
                        </div>
                    `;
                }).join('');
            }

            const performanceEl = document.getElementById('qr-performance');
            if (!qrs.length) {
                performanceEl.innerHTML = emptyState('Create a QR code to start tracking scans.');
            } else {
                performanceEl.innerHTML = qrs.map(qr => {
                    const qrScans = scans.filter(scan => scan.qrId === qr.id);
                    const lastScan = qrScans[0]?.scannedAt;
                    return `
                        <div class="track-row">
                            <div>
                                <strong>${qr.name || qr.type + ' QR'}</strong>
                                <span>${qrScans.length} scans</span>
                            </div>
                            <p>Last scan: ${lastScan ? formatDateTime(lastScan) : 'Never'}</p>
                            <p>${qr.data || ''}</p>
                        </div>
                    `;
                }).join('');
            }
        };

        renderTrackData();
        if (window.scanifyTrackInterval) clearInterval(window.scanifyTrackInterval);
        window.scanifyTrackInterval = setInterval(renderTrackData, 3000);
    }
};
