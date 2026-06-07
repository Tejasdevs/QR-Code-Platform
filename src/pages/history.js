import { setupLayoutEvents } from '../components/layout.js';
import { historyData } from '../utils/storage.js';

export const HistoryPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const history = historyData.getAll();
        const feedEl = document.getElementById('history-feed');

        if (!history.length) {
            feedEl.innerHTML = `<div class="text-center text-slate-400 py-10 relative z-10">No activity recorded yet.</div>`;
            return;
        }

        feedEl.innerHTML = history.map((item, index) => {
            const isLeft = index % 2 === 0;
            return `
                <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-inner z-10 relative left-0 md:left-1/2">
                        <i class="ph ph-check text-sm font-bold"></i>
                    </div>
                    <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl glass-card hover:border-blue-500/30 transition-all hover:-translate-y-1">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="font-bold text-white tracking-wide">${item.action}</h4>
                            <span class="text-[10px] uppercase tracking-widest font-semibold text-slate-500">${new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p class="text-sm text-slate-400">${item.details || 'System generated event.'}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
};
