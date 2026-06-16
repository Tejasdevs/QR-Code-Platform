import { setupLayoutEvents } from '../components/layout.js';
import { auth } from '../utils/storage.js';

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
    }
};
