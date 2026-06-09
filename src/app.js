
import { Router } from './utils/router.js';
import { settingsData } from './utils/storage.js';

import { LandingPage }   from './pages/landing.js';
import { LoginPage }     from './pages/login.js';
import { SignupPage }    from './pages/signup.js';
import { DashboardPage } from './pages/dashboard.js';
import { GeneratorPage } from './pages/generator.js';
import { MyQRsPage }     from './pages/my-qrs.js';
import { HistoryPage }   from './pages/history.js';
import { SettingsPage }  from './pages/settings.js';


const applyTheme = () => {
    const settings = settingsData.get();
    if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const showHttpRequiredMessage = () => {
    const appRoot = document.getElementById('app');
    if (!appRoot) return;
    appRoot.innerHTML = `
        <div class="error-page">
            <div class="error-inner">
                <i class="ph ph-warning-circle icon-xxl" style="color:#fb7185;margin-bottom:1rem;"></i>
                <h2 class="section-title">Server Required</h2>
                <p class="muted" style="margin:0.5rem 0 1rem 0;max-width:34rem;">This application must be served over HTTP. Open it through a local web server such as the included PowerShell server or a static file server.</p>
                <p class="muted" style="margin:0.5rem 0 1rem 0;max-width:34rem;">Use <code>serve.ps1</code> or run a simple local server at <code>http://localhost:8000</code>.</p>
            </div>
        </div>`;
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.protocol === 'file:') {
        showHttpRequiredMessage();
        return;
    }

    applyTheme();

    const routes = [
        { path: '/',          view: 'landing',   afterRender: LandingPage.afterRender,   guestOnly: true  },
        { path: '/login',     view: 'login',     afterRender: LoginPage.afterRender,     guestOnly: true  },
        { path: '/signup',    view: 'signup',    afterRender: SignupPage.afterRender,    guestOnly: true  },
        { path: '/dashboard', view: 'dashboard', afterRender: DashboardPage.afterRender, protected: true, layout: true },
        { path: '/generator', view: 'generator', afterRender: GeneratorPage.afterRender, protected: true, layout: true },
        { path: '/my-qrs',    view: 'my-qrs',    afterRender: MyQRsPage.afterRender,     protected: true, layout: true },
        
        { path: '/history',   view: 'history',   afterRender: HistoryPage.afterRender,   protected: true, layout: true },
        
        { path: '/settings',  view: 'settings',  afterRender: SettingsPage.afterRender,  protected: true, layout: true },
    ];

    const router = new Router(routes);
    router.init();
});
