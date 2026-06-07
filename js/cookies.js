// Cookie Consent Banner - Minimalista
function initCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    
    if (!consent) {
        showCookieBanner();
    }
    
    createSettingsButton();
}

function showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const settings = document.getElementById('cookieSettings');
    if (banner) {
        banner.classList.remove('hidden');
        banner.classList.add('flex');
    }
    if (settings) {
        settings.classList.add('hidden');
        settings.classList.remove('flex');
    }
}

function closeBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        banner.classList.add('hidden');
        banner.classList.remove('flex');
    }
}

function openSettings() {
    const banner = document.getElementById('cookieBanner');
    const settings = document.getElementById('cookieSettings');
    if (banner) {
        banner.classList.add('hidden');
        banner.classList.remove('flex');
    }
    if (settings) {
        settings.classList.remove('hidden');
        settings.classList.add('flex');
    }
}

function closeSettings() {
    const settings = document.getElementById('cookieSettings');
    if (settings) {
        settings.classList.add('hidden');
        settings.classList.remove('flex');
    }
}

function acceptAll() {
    const preferences = {
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    closeBanner();
    closeSettings();
    loadScripts(preferences);
}

function rejectAll() {
    const preferences = {
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    closeBanner();
    closeSettings();
    loadScripts(preferences);
}

function savePreferences() {
    const analytics = document.getElementById('analyticsCheck')?.checked || false;
    const marketing = document.getElementById('marketingCheck')?.checked || false;
    
    const preferences = {
        necessary: true,
        analytics: analytics,
        marketing: marketing,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    closeBanner();
    closeSettings();
    loadScripts(preferences);
}

function loadScripts(preferences) {
    if (preferences.analytics) {
        console.log('Cookies analíticas habilitadas');
    }
    if (preferences.marketing) {
        console.log('Cookies de marketing habilitadas');
    }
}

function getConsent() {
    const consent = localStorage.getItem('cookieConsent');
    return consent ? JSON.parse(consent) : null;
}

function createSettingsButton() {
    const button = document.createElement('button');
    button.id = 'cookieSettingsBtn';
    button.className = 'fixed bottom-4 left-4 z-40 w-10 h-10 bg-inverse-surface text-inverse-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform';
    button.innerHTML = '<span class="material-symbols-outlined text-[20px]">cookie</span>';
    button.title = 'Configurar cookies';
    button.onclick = function() {
        const consent = getConsent();
        if (consent) {
            const analyticsCheck = document.getElementById('analyticsCheck');
            const marketingCheck = document.getElementById('marketingCheck');
            if (analyticsCheck) analyticsCheck.checked = consent.analytics;
            if (marketingCheck) marketingCheck.checked = consent.marketing;
        }
        openSettings();
    };
    document.body.appendChild(button);
}

document.addEventListener('DOMContentLoaded', function() {
    initCookieConsent();
});