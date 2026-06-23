import { setupLayoutEvents } from '../components/layout.js';
import { auth } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

const formatDate = (value) => {
    if (!value) return 'Not available';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not available';

    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const ProfilePage = {
    afterRender: async () => {
        setupLayoutEvents();

        const user = auth.getCurrentUser() || {};
        const name = user.name || 'User';
        const joinedDate = user.createdAt || user.authenticatedAt;

        document.getElementById('profile-avatar').textContent = name.charAt(0).toUpperCase();
        document.getElementById('profile-name').textContent = name;
        document.getElementById('profile-email').textContent = user.email || 'Not available';
        document.getElementById('profile-joined').textContent = formatDate(joinedDate);

        const deleteBtn = document.getElementById('profile-delete-account-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', openDeleteAccountModal);
        }
    }
};

const openDeleteAccountModal = () => {
    const existingModal = document.getElementById('delete-account-confirm-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'delete-account-confirm-modal';
    modal.className = 'logout-modal hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'delete-account-modal-title');
    modal.innerHTML = `
        <div class="logout-modal-backdrop" data-delete-account-cancel></div>
        <div class="logout-modal-card">
            <h2 id="delete-account-modal-title">Delete account?</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div class="logout-modal-actions">
                <button type="button" class="logout-modal-cancel" data-delete-account-cancel>No</button>
                <button type="button" class="logout-modal-confirm delete-account-confirm" id="confirm-delete-account-btn">Yes, delete</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
        modal.classList.remove('is-open');
        document.removeEventListener('keydown', handleEscape);
        setTimeout(() => modal.remove(), 180);
    };

    modal.querySelectorAll('[data-delete-account-cancel]').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    modal.querySelector('#confirm-delete-account-btn').addEventListener('click', () => {
        try {
            auth.deleteAccount();
            showToast('Account deleted. You can sign up again anytime.', 'success', 1400);
            modal.remove();
            window.location.hash = '#/login';
        } catch (err) {
            showToast(err.message, 'error');
            closeModal();
        }
    });

    const handleEscape = (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    };

    document.addEventListener('keydown', handleEscape);
    requestAnimationFrame(() => {
        modal.classList.remove('hidden');
        modal.classList.add('is-open');
    });
};
