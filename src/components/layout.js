import { auth } from '../utils/storage.js';

export const setupLayoutEvents = () => {
    const user = auth.getCurrentUser() || { name: 'User', email: '' };
    const avatarEl = document.getElementById('sidebar-avatar');
    const nameEl   = document.getElementById('sidebar-name');
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
    if (nameEl)   nameEl.textContent   = user.name;

    const existingModal = document.getElementById('logout-confirm-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'logout-confirm-modal';
    modal.className = 'logout-modal hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'logout-modal-title');
    modal.innerHTML = `
        <div class="logout-modal-backdrop" data-logout-cancel></div>
        <div class="logout-modal-card">
            <h2 id="logout-modal-title">Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div class="logout-modal-actions">
                <button type="button" class="logout-modal-cancel" data-logout-cancel>Cancel</button>
                <button type="button" class="logout-modal-confirm" id="confirm-logout-btn">Logout</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const openLogoutModal = () => {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => modal.classList.add('is-open'));
    };

    const closeLogoutModal = () => {
        modal.classList.remove('is-open');
        setTimeout(() => modal.classList.add('hidden'), 180);
    };

    const completeLogout = () => {
        modal.classList.remove('is-open');
        modal.remove();
        if (window.__scanifyLogoutKeyHandler) {
            document.removeEventListener('keydown', window.__scanifyLogoutKeyHandler);
            window.__scanifyLogoutKeyHandler = null;
        }
        auth.logout();
        window.location.hash = '#/login?logout=success';
    };

    modal.querySelectorAll('[data-logout-cancel]').forEach(btn => {
        btn.addEventListener('click', closeLogoutModal);
    });

    modal.querySelector('#confirm-logout-btn').addEventListener('click', completeLogout);

    if (window.__scanifyLogoutKeyHandler) {
        document.removeEventListener('keydown', window.__scanifyLogoutKeyHandler);
    }

    window.__scanifyLogoutKeyHandler = e => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeLogoutModal();
        }
    };

    document.addEventListener('keydown', window.__scanifyLogoutKeyHandler);

    ['profile-logout-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', (e) => {
            e.preventDefault();
            openLogoutModal();
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
