/** src/pages/settings.js */
import { setupLayoutEvents } from '../components/layout.js';
import { settingsData } from '../utils/storage.js';

export const SettingsPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const settings = settingsData.get();
        const colorPicker = document.getElementById('setting-color');
        const colorText   = document.getElementById('setting-color-text');
        const emailToggle = document.getElementById('setting-email-notifs');
        const msgEl       = document.getElementById('settings-msg');
        const qrPreview   = document.getElementById('setting-preview-qr');

        // Apply saved values
        colorPicker.value = settings.defaultColor || '#ffffff';
        colorText.value   = settings.defaultColor || '#ffffff';
        qrPreview.style.color = colorPicker.value;
        emailToggle.checked = !!settings.emailNotifs;

        const showMessage = (msg) => {
            msgEl.textContent = msg;
            msgEl.classList.remove('hidden');
            setTimeout(() => msgEl.classList.add('hidden'), 3000);
        };

        const saveSettings = () => {
            settingsData.save({ 
                ...settingsData.get(), 
                defaultColor: colorPicker.value,
                emailNotifs: emailToggle.checked
            });
            showMessage('Settings saved automatically.');
        };

        // Sync color inputs & auto-save
        colorPicker.addEventListener('input', e => {
            colorText.value = e.target.value;
            qrPreview.style.color = e.target.value;
            saveSettings();
        });
        
        colorText.addEventListener('input', e => { 
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                colorPicker.value = e.target.value;
                qrPreview.style.color = e.target.value;
                saveSettings();
            }
        });

        // Toggle auto-save
        emailToggle.addEventListener('change', () => {
            saveSettings();
        });

        // Clear all data
        document.getElementById('clear-data-btn').addEventListener('click', () => {
            if (confirm('This will delete ALL your QR codes and history. Are you sure?')) {
                localStorage.removeItem('qrflow_qrs');
                localStorage.removeItem('qrflow_history');
                alert('All data cleared successfully.');
            }
        });
    }
};
