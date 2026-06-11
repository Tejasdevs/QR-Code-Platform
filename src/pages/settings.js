import { setupLayoutEvents } from '../components/layout.js';
import { settingsData } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

export const SettingsPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const settings = settingsData.get();
        const colorPicker = document.getElementById('setting-color');
        const colorText   = document.getElementById('setting-color-text');
        const emailToggle = document.getElementById('setting-email-notifs');
        const qrPreview   = document.getElementById('setting-preview-qr');

        colorPicker.value = settings.defaultColor || '#ffffff';
        colorText.value   = settings.defaultColor || '#ffffff';
        qrPreview.style.color = colorPicker.value;
        emailToggle.checked = !!settings.emailNotifs;

        const saveSettings = () => {
            settingsData.save({ 
                ...settingsData.get(), 
                defaultColor: colorPicker.value,
                emailNotifs: emailToggle.checked
            });
            showToast('Settings updated.', 'success');
        };

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

        emailToggle.addEventListener('change', () => {
            saveSettings();
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            if (confirm('This will delete ALL your QR codes and history. Are you sure?')) {
                localStorage.removeItem('qrflow_qrs');
                localStorage.removeItem('qrflow_history');
                showToast('All QR data cleared.', 'success');
            }
        });
    }
};
