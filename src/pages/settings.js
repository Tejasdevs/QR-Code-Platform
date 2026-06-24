import { setupLayoutEvents } from '../components/layout.js';
import { auth, settingsData } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

export const SettingsPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const settings = settingsData.get();
        const colorPicker = document.getElementById('setting-color');
        const colorText   = document.getElementById('setting-color-text');
        const qrPreview   = document.getElementById('setting-preview-qr');

        colorPicker.value = settings.defaultColor || '#ffffff';
        colorText.value   = settings.defaultColor || '#ffffff';
        qrPreview.style.color = colorPicker.value;

        const saveSettings = () => {
            settingsData.save({ 
                ...settingsData.get(), 
                defaultColor: colorPicker.value
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

        document.querySelectorAll('.settings-password-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const input = document.getElementById(button.dataset.passwordToggle);
                if (!input) return;

                const shouldShowPassword = input.type === 'password';
                input.type = shouldShowPassword ? 'text' : 'password';
                button.setAttribute('aria-label', `${shouldShowPassword ? 'Hide' : 'Show'} ${input.labels?.[0]?.textContent?.toLowerCase() || 'password'}`);
                button.setAttribute('aria-pressed', String(shouldShowPassword));
                button.innerHTML = `<i class="ph ${shouldShowPassword ? 'ph-eye-slash' : 'ph-eye'}"></i>`;
            });
        });

        const passwordForm = document.getElementById('change-password-form');
        passwordForm.addEventListener('submit', e => {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            try {
                auth.changePassword({ currentPassword, newPassword, confirmPassword });
                passwordForm.reset();
                passwordForm.querySelectorAll('.password-field .form-input').forEach(input => {
                    input.type = 'password';
                });
                passwordForm.querySelectorAll('.settings-password-toggle').forEach(button => {
                    button.setAttribute('aria-pressed', 'false');
                    button.innerHTML = '<i class="ph ph-eye"></i>';
                });
                showToast('Password updated successfully.', 'success');
            } catch (error) {
                showToast(error.message || 'Unable to update password.', 'error');
            }
        });

        const clearDataBtn = document.getElementById('clear-data-btn');
        const clearDataModal = document.getElementById('clear-data-confirm-modal');
        const confirmClearDataBtn = document.getElementById('confirm-clear-data-btn');
        let clearDataModalCloseTimer;
        const closeClearDataModal = () => {
            clearDataModal.classList.remove('is-open');
            window.clearTimeout(clearDataModalCloseTimer);
            clearDataModalCloseTimer = setTimeout(() => {
                clearDataModal.classList.add('hidden');
                clearDataBtn.focus();
            }, 180);
        };
        const openClearDataModal = () => {
            window.clearTimeout(clearDataModalCloseTimer);
            clearDataModal.classList.remove('hidden');
            requestAnimationFrame(() => {
                clearDataModal.classList.add('is-open');
                confirmClearDataBtn.focus();
            });
        };

        clearDataBtn.addEventListener('click', openClearDataModal);

        clearDataModal.querySelectorAll('[data-clear-data-cancel]').forEach(button => {
            button.addEventListener('click', closeClearDataModal);
        });

        confirmClearDataBtn.addEventListener('click', () => {
            localStorage.removeItem('qrflow_qrs');
            localStorage.removeItem('qrflow_history');
            showToast('All QR data cleared.', 'success');
            closeClearDataModal();
        });

        clearDataModal.addEventListener('keydown', e => {
            if (e.key === 'Escape' && clearDataModal.classList.contains('is-open')) {
                closeClearDataModal();
            }
        });
    }
};
