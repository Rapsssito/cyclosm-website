const banana = new Banana();

async function loadLocalization(locale) {
    if (locale === 'en') {
        return; // No localization needed for English
    }
    const file = `i18n/${locale}.json`;
    const response = await fetch(file);
    if (!response.ok) {
        console.error(`Failed to load localization file: ${file}`);
        return;
    }
    const data = await response.json();
    banana.load(data, locale);
    banana.setLocale(locale);
    console.log(`Localization loaded for locale: ${locale}`);
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
    let locale = 'en';
    if (userLang.startsWith('fr')) {
        locale = 'fr';
    } else if (userLang.startsWith('es')) {
        locale = 'es';
    }
    loadLocalization(locale);
});
