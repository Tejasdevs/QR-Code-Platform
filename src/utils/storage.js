const PREFIX = 'qrflow_';

export const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.error('Error writing to localStorage', e);
        }
    },
    remove: (key) => {
        localStorage.removeItem(PREFIX + key);
    }
};

export const auth = {
    normalizeEmail: (email = '') => email.trim().toLowerCase(),
    signup: (user) => {
        const name = String(user.name || '').trim();
        const email = auth.normalizeEmail(user.email);
        const password = String(user.password || '');

        if (!name) {
            throw new Error('Please enter your full name.');
        }
        if (!email) {
            throw new Error('Please enter your email address.');
        }
        if (!password) {
            throw new Error('Please enter a password.');
        }

        const users = storage.get('users', []);
        if (users.find(u => auth.normalizeEmail(u.email) === email)) {
            throw new Error('An account with this email already exists.');
        }

        users.push({ name, email, password });
        storage.set('users', users);
        storage.remove('currentUser');

        return { name, email };
    },
    login: (email, password) => {
        const normalizedEmail = auth.normalizeEmail(email);
        const enteredPassword = String(password || '');

        if (!normalizedEmail || !enteredPassword) {
            throw new Error('Please enter your email and password.');
        }

        const users = storage.get('users', []);
        const user = users.find(u =>
            auth.normalizeEmail(u.email) === normalizedEmail &&
            String(u.password || '') === enteredPassword
        );

        if (!user) {
            throw new Error('Invalid email or password');
        }

        storage.set('currentUser', {
            name: user.name,
            email: auth.normalizeEmail(user.email),
            authenticatedAt: new Date().toISOString()
        });

        return user;
    },
    logout: () => {
        storage.remove('currentUser');
    },
    getCurrentUser: () => {
        return storage.get('currentUser');
    },
    isAuthenticated: () => {
        const currentUser = storage.get('currentUser');
        return !!(currentUser && currentUser.email);
    }
};

export const qrData = {
    getAll: () => storage.get('qrs', []),
    save: (qr) => {
        const qrs = storage.get('qrs', []);
        const newQR = { ...qr, id: Date.now().toString(), createdAt: new Date().toISOString() };
        qrs.unshift(newQR);
        storage.set('qrs', qrs);
        historyData.add(`Generated a new ${qr.type} QR code`);
        return newQR;
    },
    delete: (id) => {
        let qrs = storage.get('qrs', []);
        qrs = qrs.filter(q => q.id !== id);
        storage.set('qrs', qrs);
        historyData.add(`Deleted a QR code`);
    },
    update: (id, updates) => {
        const qrs = storage.get('qrs', []);
        const index = qrs.findIndex(q => q.id === id);
        if(index !== -1) {
            qrs[index] = { ...qrs[index], ...updates };
            storage.set('qrs', qrs);
            historyData.add(`Edited a QR code`);
        }
    }
};

export const historyData = {
    getAll: () => storage.get('history', []),
    add: (action) => {
        const history = storage.get('history', []);
        history.unshift({ action, timestamp: new Date().toISOString() });
        if (history.length > 50) history.pop();
        storage.set('history', history);
    }
};

export const settingsData = {
    get: () => storage.get('settings', { theme: 'light', defaultColor: '#000000', defaultSize: 256 }),
    save: (settings) => storage.set('settings', settings)
};
