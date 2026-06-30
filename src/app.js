
import { Router } from './utils/router.js';
import { settingsData } from './utils/storage.js';

import { LandingPage }   from './pages/landing.js';
import { LoginPage }     from './pages/login.js';
import { SignupPage }    from './pages/signup.js';
import { DashboardPage } from './pages/dashboard.js';
import { GeneratorPage } from './pages/generator.js';
import { MyQRsPage }     from './pages/my-qrs.js';
import { FavoritesPage } from './pages/favorites.js';
import { TrackPage }     from './pages/track.js';
import { HistoryPage }   from './pages/history.js';
import { ProfilePage }   from './pages/profile.js';
import { SettingsPage }  from './pages/settings.js';
import { HelpFaqPage }   from './pages/help-faq.js';
import { ScanPage }      from './pages/scan.js';


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

const initSmoothWheelScrolling = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scrollTargets = '.page-main, .sidebar-nav, .mobile-sidebar-nav';
    const state = new WeakMap();

    const getScrollTarget = (eventTarget) => {
        const element = eventTarget instanceof Element ? eventTarget : eventTarget?.parentElement;
        return element?.closest(scrollTargets) || document.scrollingElement;
    };

    const animateScroll = (target, from, to, startedAt, duration) => {
        const progress = Math.min((performance.now() - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.scrollTop = from + (to - from) * eased;

        if (progress < 1) {
            const entry = state.get(target);
            entry.frame = requestAnimationFrame(() => animateScroll(target, from, to, startedAt, duration));
        } else {
            state.delete(target);
        }
    };

    document.addEventListener('wheel', (event) => {
        if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        if (event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL || Math.abs(event.deltaY) < 40) return;

        const target = getScrollTarget(event.target);
        if (!target) return;

        const maxScroll = target.scrollHeight - target.clientHeight;
        if (maxScroll <= 0) return;

        const current = target.scrollTop;
        const next = Math.max(0, Math.min(maxScroll, current + event.deltaY * 0.9));
        if (next === current) return;

        event.preventDefault();

        const previous = state.get(target);
        if (previous?.frame) cancelAnimationFrame(previous.frame);

        state.set(target, {});
        animateScroll(target, current, next, performance.now(), 280);
    }, { passive: false });
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.protocol === 'file:') {
        showHttpRequiredMessage();
        return;
    }

    initSmoothWheelScrolling();
    applyTheme();

    const routes = [
        { path: '/',          view: 'landing',   afterRender: LandingPage.afterRender,   guestOnly: true  },
        { path: '/login',     view: 'login',     afterRender: LoginPage.afterRender,     guestOnly: true  },
        { path: '/signup',    view: 'signup',    afterRender: SignupPage.afterRender,    guestOnly: true  },
        { path: '/dashboard', view: 'dashboard', afterRender: DashboardPage.afterRender, protected: true, layout: true },
        { path: '/generator', view: 'generator', afterRender: GeneratorPage.afterRender, protected: true, layout: true },
        { path: '/my-qrs',    view: 'my-qrs',    afterRender: MyQRsPage.afterRender,     protected: true, layout: true },
        { path: '/favorites', view: 'favorites', afterRender: FavoritesPage.afterRender, protected: true, layout: true },
        { path: '/track',     view: 'track',     afterRender: TrackPage.afterRender,     protected: true, layout: true },
        
        { path: '/history',   view: 'history',   afterRender: HistoryPage.afterRender,   protected: true, layout: true },
        
        { path: '/profile',   view: 'profile',   afterRender: ProfilePage.afterRender,   protected: true, layout: true },
        { path: '/settings',  view: 'settings',  afterRender: SettingsPage.afterRender,  protected: true, layout: true },
        { path: '/help-faq',  view: 'help-faq',  afterRender: HelpFaqPage.afterRender,   protected: true, layout: true },
        { path: '/scan',      view: 'scan',      afterRender: ScanPage.afterRender },
    ];

    const router = new Router(routes);
    router.init();
});
