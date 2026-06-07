/** src/pages/profile.js */
import { setupLayoutEvents } from '../components/layout.js';
import { auth, storage } from '../utils/storage.js';

export const ProfilePage = {
    afterRender: async () => {
        setupLayoutEvents();

        const user = auth.getCurrentUser() || { name: 'User', email: '' };

        // Populate UI
        document.getElementById('profile-avatar').textContent       = user.name.charAt(0).toUpperCase();
        document.getElementById('profile-display-name').textContent = user.name;
        document.getElementById('profile-display-email').textContent= user.email;
        document.getElementById('pf-name').value  = user.name;
        document.getElementById('pf-email').value = user.email;

        // Save profile
        document.getElementById('profile-form').addEventListener('submit', e => {
            e.preventDefault();
            const newName  = document.getElementById('pf-name').value.trim();
            const newEmail = document.getElementById('pf-email').value.trim();

            // Update current user in storage
            storage.set('currentUser', { name: newName, email: newEmail });

            // Update in users array
            const users = storage.get('users', []);
            const idx   = users.findIndex(u => u.email === user.email);
            if (idx !== -1) { users[idx].name = newName; users[idx].email = newEmail; storage.set('users', users); }

            document.getElementById('profile-display-name').textContent  = newName;
            document.getElementById('profile-display-email').textContent = newEmail;
            document.getElementById('profile-avatar').textContent        = newName.charAt(0).toUpperCase();

            const successEl = document.getElementById('profile-success');
            successEl.textContent = 'Profile updated successfully!';
            successEl.classList.remove('hidden');
            setTimeout(() => successEl.classList.add('hidden'), 3000);
        });

        // Logout
        document.getElementById('logout-profile-btn').addEventListener('click', () => {
            auth.logout();
            window.location.hash = '#/login';
        });
    }
};
