import tr from './tr.js';
import en from './en.js';

const locales = { tr, en };

export function getLocale(code = 'tr') {
    return locales[code] || locales.tr;
}

export function t(locale, path, replacements = {}) {
    const keys = path.split('.');
    let value = locale;
    
    for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return path;
    }
    
    if (typeof value !== 'string') return path;
    
    return value.replace(/\{(\w+)\}/g, (match, key) => {
        return replacements[key] !== undefined ? replacements[key] : match;
    });
}

export { tr, en, locales };
