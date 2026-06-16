const PREFIX = 'qrflow_';
const LEGACY_PREFIXES = ['scanify_'];

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

const readStoredArray = (key) => {
    const values = [storage.get(key, [])];

    LEGACY_PREFIXES.forEach(prefix => {
        try {
            const item = localStorage.getItem(prefix + key);
            if (item) values.push(JSON.parse(item));
        } catch (e) {
            console.error('Error reading legacy storage', e);
        }
    });

    return values.flatMap(value => Array.isArray(value) ? value : []);
};

const getUniqueQrName = (baseName, qrs) => {
    const normalizedBaseName = String(baseName || 'QR Code').trim() || 'QR Code';
    const existingNames = new Set(qrs.map(qr => String(qr.name || '').trim().toLowerCase()));

    if (!existingNames.has(normalizedBaseName.toLowerCase())) {
        return normalizedBaseName;
    }

    let count = 2;
    let nextName = `${normalizedBaseName} (${count})`;

    while (existingNames.has(nextName.toLowerCase())) {
        count += 1;
        nextName = `${normalizedBaseName} (${count})`;
    }

    return nextName;
};

export const auth = {
    normalizeEmail: (email = '') => email.trim().toLowerCase(),
    normalizePassword: (password = '') => String(password).trim(),
    normalizeUser: (user = {}) => ({
        name: String(user.name || 'User').trim() || 'User',
        email: auth.normalizeEmail(user.email),
        password: auth.normalizePassword(user.password)
    }),
    getUsers: () => {
        const users = readStoredArray('users')
            .map(auth.normalizeUser)
            .filter(user => user.email && user.password);

        const uniqueUsers = users.filter((user, index, list) =>
            list.findIndex(item => item.email === user.email) === index
        );

        storage.set('users', uniqueUsers);
        return uniqueUsers;
    },
    signup: (user) => {
        const name = String(user.name || '').trim();
        const email = auth.normalizeEmail(user.email);
        const password = auth.normalizePassword(user.password);

        if (!name) {
            throw new Error('Please enter your full name.');
        }
        if (!email) {
            throw new Error('Please enter your email address.');
        }
        if (!password) {
            throw new Error('Please enter a password.');
        }

        const users = auth.getUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('An account with this email already exists.');
        }

        users.push({ name, email, password });
        storage.set('users', users);
        storage.remove('currentUser');

        return { name, email };
    },
    login: (email, password) => {
        const normalizedEmail = auth.normalizeEmail(email);
        const enteredPassword = auth.normalizePassword(password);

        if (!normalizedEmail || !enteredPassword) {
            throw new Error('Please enter your email and password.');
        }

        const users = auth.getUsers();
        const user = users.find(u =>
            u.email === normalizedEmail &&
            u.password === enteredPassword
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
        const createdAt = qr.createdAt || new Date().toISOString();
        const fallbackName = `${qr.type || 'QR'} QR - ${new Date(createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;
        const baseName = String(qr.name || '').trim() || fallbackName;
        const newQR = {
            ...qr,
            id: qr.id || Date.now().toString(),
            name: getUniqueQrName(baseName, qrs),
            createdAt
        };
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
    toggleFavorite: (id) => {
        const qrs = storage.get('qrs', []);
        const index = qrs.findIndex(q => q.id === id);
        if (index === -1) return null;

        qrs[index] = { ...qrs[index], favorite: !qrs[index].favorite };
        storage.set('qrs', qrs);
        historyData.add(qrs[index].favorite ? 'Marked a QR code as favorite' : 'Removed a QR code from favorites');
        return qrs[index];
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

export const scanData = {
    getAll: () => storage.get('scans', []),
    add: (qrId) => {
        const scans = storage.get('scans', []);
        const scan = { id: Date.now().toString(), qrId, scannedAt: new Date().toISOString() };
        scans.unshift(scan);
        storage.set('scans', scans);
        return scan;
    },
    getByQR: (qrId) => storage.get('scans', []).filter(scan => scan.qrId === qrId)
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
    get: () => {
        const settings = storage.get('settings', {});
        const normalizedSettings = {
            theme: settings.theme || 'light',
            defaultColor: settings.defaultColor || '#000000',
            defaultSize: settings.defaultSize || 256
        };

        storage.set('settings', normalizedSettings);
        return normalizedSettings;
    },
    save: (settings) => storage.set('settings', settings)
};
