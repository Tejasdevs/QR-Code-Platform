
import { Router } from './utils/router.js';
import { settingsData } from './utils/storage.js';

import { LandingPage }   from './pages/landing.js';
import { LoginPage }     from './pages/login.js';
import { SignupPage }    from './pages/signup.js';
import { DashboardPage } from './pages/dashboard.js';
import { GeneratorPage } from './pages/generator.js';
import { MyQRsPage }     from './pages/my-qrs.js';
import { AnalyticsPage } from './pages/analytics.js';
import { HistoryPage }   from './pages/history.js';
import { ProfilePage }   from './pages/profile.js';
import { SettingsPage }  from './pages/settings.js';


const applyTheme = () => {
    const settings = settingsData.get();
    if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();

    const routes = [
        { path: '/',          view: 'landing',   afterRender: LandingPage.afterRender,   guestOnly: true  },
        { path: '/login',     view: 'login',     afterRender: LoginPage.afterRender,     guestOnly: true  },
        { path: '/signup',    view: 'signup',    afterRender: SignupPage.afterRender,    guestOnly: true  },
        { path: '/dashboard', view: 'dashboard', afterRender: DashboardPage.afterRender, protected: true, layout: true },
        { path: '/generator', view: 'generator', afterRender: GeneratorPage.afterRender, protected: true, layout: true },
        { path: '/my-qrs',    view: 'my-qrs',    afterRender: MyQRsPage.afterRender,     protected: true, layout: true },
        { path: '/analytics', view: 'analytics', afterRender: AnalyticsPage.afterRender, protected: true, layout: true },
        { path: '/history',   view: 'history',   afterRender: HistoryPage.afterRender,   protected: true, layout: true },
        { path: '/profile',   view: 'profile',   afterRender: ProfilePage.afterRender,   protected: true, layout: true },
        { path: '/settings',  view: 'settings',  afterRender: SettingsPage.afterRender,  protected: true, layout: true },
    ];

    const router = new Router(routes);
    router.init();
});
