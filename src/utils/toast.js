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

export const showToast = (message, type = 'info') => {
    const root = getToastRoot();
    const toast = document.createElement('div');
    const id = `toast-${++toastId}`;
    toast.id = id;
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.innerHTML = `
        <span class="toast-dot" aria-hidden="true"></span>
        <span class="toast-message">${message}</span>
        <button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>
    `;

    const closeToast = () => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 180);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);
    root.appendChild(toast);
    setTimeout(closeToast, 3200);
};
