/** src/pages/landing.js — No HTML, just event logic */
export const LandingPage = {
    afterRender: async () => {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"][href*="-"]').forEach(a => {
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
