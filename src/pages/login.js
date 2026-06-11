import { auth } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

export const LoginPage = {
    afterRender: async () => {
        const form     = document.getElementById('login-form');
        const errorMsg = document.getElementById('error-msg');
        const successMsg = document.getElementById('success-msg');

        if (window.location.hash.includes('signup=success') && successMsg) {
            successMsg.textContent = 'Account created successfully. Please log in with your email and password.';
            successMsg.className = 'alert-success';
            showToast('Account created. Please log in.', 'success');
        }

        form.addEventListener('submit', e => {
            e.preventDefault();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            errorMsg.className = 'alert-hidden';
            errorMsg.textContent = '';

            try {
                auth.login(email, password);
                showToast('Welcome back.', 'success');
                window.location.hash = '#/dashboard';
            } catch (err) {
                errorMsg.textContent = err.message;
                errorMsg.className = 'alert-visible';
                showToast(err.message, 'error');
            }
        });
    }
};
