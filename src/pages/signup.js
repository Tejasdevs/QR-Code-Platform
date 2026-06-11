import { auth } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

export const SignupPage = {
    afterRender: async () => {
        const form     = document.getElementById('signup-form');
        const errorMsg = document.getElementById('error-msg');

        form.addEventListener('submit', e => {
            e.preventDefault();
            const name     = document.getElementById('name').value.trim();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            errorMsg.className = 'alert-hidden';
            errorMsg.textContent = '';

            if (password.length < 6) {
                errorMsg.textContent = 'Password must be at least 6 characters.';
                errorMsg.className = 'alert-visible';
                showToast('Password must be at least 6 characters.', 'error');
                return;
            }

            try {
                auth.signup({ name, email, password });
                showToast('Account created. Please log in.', 'success');
                window.location.hash = '#/login?signup=success';
            } catch (err) {
                errorMsg.textContent = err.message;
                errorMsg.className = 'alert-visible';
                showToast(err.message, 'error');
            }
        });
    }
};
