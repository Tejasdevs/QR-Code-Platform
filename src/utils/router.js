export class Router {
    constructor(routes) {
        this.routes = routes;
        this.rootElement = document.getElementById('app');
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    async handleRoute() {
        const rawHash = window.location.hash || '#/';
        const path = rawHash.replace(/^#/, '').split('?')[0] || '/';

        let route = this.routes.find(r => r.path === path);

        if (!route) {
            window.location.hash = '#/';
            return;
        }

        if (route.protected && !this.isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }

        if (route.guestOnly && this.isAuthenticated()) {
            window.location.hash = '#/dashboard';
            return;
        }

        this.rootElement.innerHTML = `
            <div class="flex items-center justify-center min-h-screen bg-transparent">
                <div class="spinner"></div>
            </div>`;

        try {
            if (route.layout) {
                const [layoutRes, pageRes] = await Promise.all([
                    fetch('./src/views/layout.html'),
                    fetch(`./src/views/${route.view}.html`)
                ]);

                if (!layoutRes.ok) throw new Error(`Failed to load layout: ${layoutRes.status}`);
                if (!pageRes.ok) throw new Error(`Failed to load view ${route.view}: ${pageRes.status}`);

                const layoutHtml = await layoutRes.text();
                const pageHtml   = await pageRes.text();

                this.rootElement.innerHTML = layoutHtml;

                const slot = document.getElementById('page-content');
                if (slot) slot.innerHTML = pageHtml;

                this.setActiveNav(path);

            } else {
                const res = await fetch(`./src/views/${route.view}.html`);
                if (!res.ok) throw new Error(`Failed to load view ${route.view}: ${res.status}`);
                this.rootElement.innerHTML = await res.text();
            }

            if (route.afterRender) await route.afterRender();

        } catch (err) {
            console.error('Router error:', err);
            this.rootElement.innerHTML = `
                <div class="flex items-center justify-center min-h-screen p-8">
                    <div class="text-center">
                        <i class="ph ph-warning-circle text-5xl text-red-400 mb-4 block"></i>
                        <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Page Load Error</h2>
                        <p class="text-slate-500 text-sm mb-4">${err.message}</p>
                        <a href="#/" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Go Home</a>
                    </div>
                </div>`;
        }
    }

    setActiveNav(path) {
        document.querySelectorAll('.nav-link[data-path]').forEach(link => {
            link.classList.remove('nav-active');
            if (link.dataset.path === path) {
                link.classList.add('nav-active');
            }
        });
    }

    isAuthenticated() {
        return !!localStorage.getItem('qrflow_currentUser');
    }

    init() {
        this.handleRoute();
    }
}
