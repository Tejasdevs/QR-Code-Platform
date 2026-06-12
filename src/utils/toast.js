const TOAST_ROOT_ID = 'toast-root';
let toastId = 0;

const getToastRoot = () => {
    let root = document.getElementById(TOAST_ROOT_ID);
    if (!root) {
        root = document.createElement('div');
        root.id = TOAST_ROOT_ID;
        root.className = 'toast-root';
        document.body.appendChild(root);
    }
    return root;
};

export const showToast = (message, type = 'info', duration = 3200) => {
    const root = getToastRoot();
    const toast = document.createElement('div');
    const id = `toast-${++toastId}`;
    toast.id = id;
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const dot = document.createElement('span');
    dot.className = 'toast-dot';
    dot.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'toast-message';
    text.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'toast-close';
    closeButton.setAttribute('aria-label', 'Dismiss notification');
    closeButton.textContent = 'x';

    toast.append(dot, text, closeButton);

    const closeToast = () => {
        if (!toast.isConnected) return;
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 180);
    };

    closeButton.addEventListener('click', closeToast);
    root.appendChild(toast);
    setTimeout(closeToast, duration);

    return closeToast;
};
