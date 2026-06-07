/** src/pages/signup.js */
import { auth } from '../utils/storage.js';

export const SignupPage = {
    afterRender: async () => {
        const form     = document.getElementById('signup-form');
        const errorMsg = document.getElementById('error-msg');

        form.addEventListener('submit', e => {
            e.preventDefault();
            const name     = document.getElementById('name').value.trim();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (password.length < 6) {
                errorMsg.textContent = 'Password must be at least 6 characters.';
                errorMsg.classList.remove('hidden');
                return;
            }

            try {
                auth.signup({ name, email, password });
                auth.login(email, password);
                window.location.hash = '#/dashboard';
            } catch (err) {
                errorMsg.textContent = err.message;
                errorMsg.classList.remove('hidden');
            }
        });
    }
};
