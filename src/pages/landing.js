import { showToast } from '../utils/toast.js';

export const LandingPage = {
    afterRender: async () => {
        if (window.location.hash.includes('logout=success')) {
            showToast('Signed out successfully.', 'success');
        }

        document.querySelectorAll('a[href^="#"]:not([href^="#/"])').forEach(a => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                a.addEventListener('click', e => {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                });
            }
        });
    }
};
