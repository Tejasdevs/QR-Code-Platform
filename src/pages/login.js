import { auth } from '../utils/storage.js';

export const LoginPage = {
    afterRender: async () => {
        const form     = document.getElementById('login-form');
        const errorMsg = document.getElementById('error-msg');

        form.addEventListener('submit', e => {
            e.preventDefault();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            try {
                auth.login(email, password);
                window.location.hash = '#/dashboard';
            } catch (err) {
                errorMsg.textContent = err.message;
                errorMsg.classList.remove('hidden');
            }
        });
    }
};
