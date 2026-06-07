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
    signup: (user) => {
        const users = storage.get('users', []);
        if (users.find(u => u.email === user.email)) {
            throw new Error('User already exists');
        }
        users.push(user);
        storage.set('users', users);
        return true;
    },
    login: (email, password) => {
        const users = storage.get('users', []);
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        storage.set('currentUser', { name: user.name, email: user.email });
        return user;
    },
    logout: () => {
        storage.remove('currentUser');
    },
    getCurrentUser: () => {
        return storage.get('currentUser');
    },
    isAuthenticated: () => {
        return !!storage.get('currentUser');
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
