import { auth } from '../utils/storage.js';

export const setupLayoutEvents = () => {
    const user = auth.getCurrentUser() || { name: 'User', email: '' };
    const avatarEl = document.getElementById('sidebar-avatar');
    const nameEl   = document.getElementById('sidebar-name');
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
    if (nameEl)   nameEl.textContent   = user.name;

    ['logout-btn', 'mobile-logout-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
            window.location.hash = '#/';
        });
    });

    const mobileMenuBtn   = document.getElementById('mobile-menu-btn');
    const closeMobileBtn  = document.getElementById('close-menu-btn');
    const mobileMenu      = document.getElementById('mobile-menu');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');

    const openMenu = () => {
        mobileMenu.classList.remove('hidden');
        requestAnimationFrame(() => {
            mobileMenu.style.opacity = '1';
            mobileMenuPanel.style.transform = 'translateX(0)';
        });
    };
    const closeMenu = () => {
        mobileMenu.style.opacity = '0';
        mobileMenuPanel.style.transform = 'translateX(100%)';
        setTimeout(() => mobileMenu.classList.add('hidden'), 300);
    };

    if (mobileMenuBtn)  mobileMenuBtn.addEventListener('click', openMenu);
    if (closeMobileBtn) closeMobileBtn.addEventListener('click', closeMenu);
    if (mobileMenu)     mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMenu(); });
};
