import { auth } from './storage.js';

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
            <div class="loader-wrap"><div class="spinner"></div></div>`;

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
                <div class="error-page">
                    <div class="error-inner">
                        <i class="ph ph-warning-circle icon-xxl" style="color:#fb7185;margin-bottom:1rem;"></i>
                        <h2 class="section-title">Page Load Error</h2>
                        <p class="muted" style="margin:0.5rem 0 1rem 0;">${err.message}</p>
                        <a href="#/" class="primary-action">Go Home</a>
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
        return auth.isAuthenticated();
    }

    init() {
        this.handleRoute();
    }
}
