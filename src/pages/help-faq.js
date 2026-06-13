import { setupLayoutEvents } from '../components/layout.js';

export const HelpFaqPage = {
    afterRender: async () => {
        setupLayoutEvents();

        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.closest('.faq-item');
                const isOpen = item.classList.contains('is-open');

                item.classList.toggle('is-open', !isOpen);
                button.setAttribute('aria-expanded', String(!isOpen));
                button.querySelector('i').className = `ph ${isOpen ? 'ph-plus' : 'ph-minus'}`;
            });
        });
    }
};
