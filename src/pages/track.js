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
            const totalEl = document.getElementById('track-total');
            const todayEl = document.getElementById('track-today');
            const weekEl = document.getElementById('track-week');
            const recentEl = document.getElementById('recent-scans');
            const performanceEl = document.getElementById('qr-performance');

            if (!totalEl || !todayEl || !weekEl || !recentEl || !performanceEl) {
                if (window.scanifyTrackInterval) {
                    clearInterval(window.scanifyTrackInterval);
                    window.scanifyTrackInterval = null;
                }
                return;
            }

            const qrs = qrData.getAll();
            const scans = scanData.getAll();
            const today = startOfToday();
            const week = startOfWeek();

            totalEl.textContent = scans.length;
            todayEl.textContent = scans.filter(scan => new Date(scan.scannedAt) >= today).length;
            weekEl.textContent = scans.filter(scan => new Date(scan.scannedAt) >= week).length;

            if (!scans.length) {
                recentEl.innerHTML = emptyState('No scans yet.');
            } else {
                recentEl.innerHTML = scans.slice(0, 8).map(scan => {
                    const qr = qrs.find(item => item.id === scan.qrId);
                    const qrLabel = qr ? (qr.name || `${qr.type} QR`) : 'Deleted QR';
                    return `
                        <div class="track-row">
                            <div>
                                <strong>${qrLabel}</strong>
                                <span>${formatDateTime(scan.scannedAt)}</span>
                            </div>
                            <p>${qr?.data || 'Original QR no longer exists'}</p>
                        </div>
                    `;
                }).join('');
            }

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
