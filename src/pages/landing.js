export const LandingPage = {
    afterRender: async () => {
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
