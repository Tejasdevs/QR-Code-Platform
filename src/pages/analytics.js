import { setupLayoutEvents } from '../components/layout.js';
import { qrData } from '../utils/storage.js';

export const AnalyticsPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const qrs       = qrData.getAll();
        const textColor = '#94a3b8';
        const gridColor = 'rgba(255, 255, 255, 0.05)';

        Chart.defaults.color = textColor;
        Chart.defaults.font.family = 'Inter, sans-serif';

        if (window.scansChartInstance) window.scansChartInstance.destroy();
        if (window.deviceChartInstance) window.deviceChartInstance.destroy();

        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        });

        const scanData = [12, 19, 15, 25, 22, 30, 45 + (qrs.length * 2)];

        const ctxScans = document.getElementById('scansChart');
        if (ctxScans) {
            window.scansChartInstance = new Chart(ctxScans, {
                type: 'line',
                data: { 
                    labels: days, 
                    datasets: [{ 
                        label: 'Total Scans', 
                        data: scanData, 
                        borderColor: '#60a5fa',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)', 
                        borderWidth: 2, 
                        fill: true, 
                        tension: 0.4, 
                        pointBackgroundColor: '#60a5fa',
                        pointBorderColor: '#0f172a',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }] 
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: {
                        legend: { display: false }
                    },
                    scales: { 
                        y: { beginAtZero: true, grid: { color: gridColor, drawBorder: false } }, 
                        x: { grid: { display: false, drawBorder: false } } 
                    } 
                }
            });
        }

        const ctxDevice = document.getElementById('deviceChart');
        if (ctxDevice) {
            window.deviceChartInstance = new Chart(ctxDevice, {
                type: 'doughnut',
                data: {
                    labels: ['iOS', 'Android', 'Desktop', 'Other'],
                    datasets: [{ 
                        data: [45, 35, 15, 5], 
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'], 
                        borderWidth: 0, 
                        hoverOffset: 6 
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { 
                        legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } } 
                    },
                    cutout: '75%'
                }
            });
        }

        const tbody = document.getElementById('top-qrs-tbody');
        if (tbody) {
            if (qrs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-slate-500">No QR codes generated yet.</td></tr>`;
            } else {
                const sortedQRs = [...qrs].map(qr => ({
                    ...qr,
                    scans: Math.floor(Math.random() * 200) + 10
                })).sort((a, b) => b.scans - a.scans).slice(0, 5);

                tbody.innerHTML = sortedQRs.map(qr => `
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td class="py-4 pl-4 font-medium text-white flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20"><i class="ph ph-qr-code"></i></div>
                            ${qr.name || qr.type + ' Code'}
                        </td>
                        <td class="py-4"><span class="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-semibold uppercase tracking-widest text-slate-300">${qr.type}</span></td>
                        <td class="py-4 font-mono text-emerald-400">${qr.scans}</td>
                        <td class="py-4"><span class="flex items-center gap-2 text-xs font-bold text-emerald-400"><div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Active</span></td>
                    </tr>
                `).join('');
            }
        }
    }
};
