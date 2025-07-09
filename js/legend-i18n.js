const banana = new Banana();

async function loadLocalization(locale = 'en') {
    if (locale.startsWith('en')) {
        return; // No localization needed for English
    }

    // Try full locale first, then fallback to base language
    const localesToTry = [locale];
    const baseLang = locale.split('-')[0];
    if (baseLang !== locale) {
        localesToTry.push(baseLang);
    }

    let dataLoaded = false;
    for (const loc of localesToTry) {
        const file = `i18n/${loc}.json`;
        const response = await fetch(file);
        if (!response.ok) {
            console.warn(`Localization file not found for ${loc}`);
            continue; // Try the next locale
        }
        try {
            const data = await response.json();
            banana.load(data, loc);
            banana.setLocale(loc);
            dataLoaded = true;
            console.log(`Localization loaded for locale: ${loc}`);
            break;
        } catch (error) {
            console.error(`Error parsing localization file for ${loc}:`, error);
            continue; // Try the next locale
        }
    }

    if (!dataLoaded) {
        console.error(`Failed to load localization file for: ${locale}`);
        return;
    }

    document.querySelectorAll('.i18n').forEach(element => {
        const message = element.dataset.i18n;
        if (message === undefined) {
            return;
        }
        const localizedMessage = banana.i18n(message);
        if (message !== localizedMessage) {
            element.innerText = localizedMessage;
        }
    });
}

window.addEventListener('load', () => {
    const userLang = navigator.language || navigator.userLanguage;
    loadLocalization(userLang);
});
