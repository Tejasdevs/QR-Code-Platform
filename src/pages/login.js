import { auth } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

export const LoginPage = {
    afterRender: async () => {
        const form     = document.getElementById('login-form');
        const errorMsg = document.getElementById('error-msg');
        const successMsg = document.getElementById('success-msg');
        const passwordInput = document.getElementById('password');
        const passwordToggle = document.getElementById('password-toggle');
        const rememberInput = document.getElementById('remember-me');

        if (window.location.hash.includes('signup=success') && successMsg) {
            successMsg.textContent = 'Account created successfully. Please log in with your email and password.';
            successMsg.className = 'alert-success';
            showToast('Account created. Please log in.', 'success');
        }

        if (passwordInput && passwordToggle) {
            passwordToggle.addEventListener('click', () => {
                const shouldShowPassword = passwordInput.type === 'password';
                passwordInput.type = shouldShowPassword ? 'text' : 'password';
                passwordToggle.setAttribute('aria-label', shouldShowPassword ? 'Hide password' : 'Show password');
                passwordToggle.setAttribute('aria-pressed', String(shouldShowPassword));
                passwordToggle.innerHTML = `<i class="ph ${shouldShowPassword ? 'ph-eye-slash' : 'ph-eye'}"></i>`;
            });
        }

        form.addEventListener('submit', e => {
            e.preventDefault();
            const email    = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            errorMsg.className = 'alert-hidden';
            errorMsg.textContent = '';

            try {
                auth.login(email, password, !!rememberInput.checked);
                const closeSuccessToast = showToast('Signed in successfully.', 'success', 1100);
                setTimeout(() => {
                    closeSuccessToast();
                    window.location.hash = '#/dashboard';
                }, 1250);
            } catch (err) {
                errorMsg.textContent = err.message;
                errorMsg.className = 'alert-visible';
                showToast(err.message, 'error');
            }
        });
    }
};
