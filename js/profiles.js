import { LANGS } from './i18n.js';
import { getLang } from './i18n.js';

export let profiles = {};
export const builtInProfiles = [
    { id: 'custom', labelKey: 'custom', data: {} },
    { id: 'approach', labelKey: 'approach', data: { currentAlt: '', targetAlt: 0, speed: '', adiAngle: -3, airportDistance: '', currentAltUnit: 'ft', targetAltUnit: 'ft', speedUnit: 'kts', airportDistanceUnit: 'nmi' } },
    { id: 'short-field', labelKey: 'shortField', data: { currentAlt: '', targetAlt: 0, speed: '', adiAngle: -4, airportDistance: '', currentAltUnit: 'ft', targetAltUnit: 'ft', speedUnit: 'kts', airportDistanceUnit: 'nmi' } },
    { id: 'climb-out', labelKey: 'climbOut', data: { currentAlt: 0, targetAlt: '', speed: '', adiAngle: 10, airportDistance: '', currentAltUnit: 'ft', targetAltUnit: 'ft', speedUnit: 'kts', airportDistanceUnit: 'nmi' } },
];

export function getProfileLabel(id, lang = 'en') {
    const builtIn = builtInProfiles.find(p => p.id === id);
    if (builtIn) return LANGS[lang][builtIn.labelKey] || id;
    return profiles[id]?.name || id;
}

export function loadProfiles() {
    profiles = {};
    builtInProfiles.forEach(p => {
        profiles[p.id] = { name: null, ...p.data };
    });
    try {
        const userProfiles = JSON.parse(localStorage.getItem('pilot_profiles') || '{}');
        for (const [id, obj] of Object.entries(userProfiles)) {
            profiles[id] = obj;
        }
    } catch {
        localStorage.removeItem('pilot_profiles');
    }
    const lastId = localStorage.getItem('pilot_last_profile') || 'custom';
    if (profiles[lastId]) window.lastProfileId = lastId;
}

export function saveUserProfiles() {
    const userProfiles = {};
    for (const [id, obj] of Object.entries(profiles)) {
        if (!builtInProfiles.find(p => p.id === id)) {
            userProfiles[id] = obj;
        }
    }
    localStorage.setItem('pilot_profiles', JSON.stringify(userProfiles));
}

export function fillProfileOptions() {
    const select = document.getElementById('profileSelect');
    select.innerHTML = '';
    Object.keys(profiles).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        const currentLang = typeof getLang === 'function' ? getLang() : 'en';
        option.textContent = getProfileLabel(id, currentLang);
        select.appendChild(option);
    });
    select.value = window.lastProfileId || 'custom';
}

export function setFieldsFromProfile(id) {
    const data = profiles[id] || {};
    document.getElementById('currentAlt').value = data.currentAlt ?? '';
    document.getElementById('targetAlt').value = data.targetAlt ?? '';
    document.getElementById('speed').value = data.speed ?? '';
    document.getElementById('adiAngle').value = data.adiAngle ?? 0;
    document.getElementById('adiAngleValue').textContent = (data.adiAngle ?? 0) + ' °';
    document.getElementById('airportDistance').value = data.airportDistance ?? '';
    document.getElementById('currentAltUnit').value = data.currentAltUnit ?? 'ft';
    document.getElementById('targetAltUnit').value = data.targetAltUnit ?? 'ft';
    document.getElementById('speedUnit').value = data.speedUnit ?? 'kts';
    document.getElementById('airportDistanceUnit').value = data.airportDistanceUnit ?? 'nmi';
}

export function saveCurrentProfileData(id) {
    if (!profiles[id]) return;
    profiles[id].currentAlt = document.getElementById('currentAlt').value;
    profiles[id].targetAlt = document.getElementById('targetAlt').value;
    profiles[id].speed = document.getElementById('speed').value;
    profiles[id].adiAngle = parseInt(document.getElementById('adiAngle').value, 10);
    profiles[id].airportDistance = document.getElementById('airportDistance').value;
    profiles[id].currentAltUnit = document.getElementById('currentAltUnit').value;
    profiles[id].targetAltUnit = document.getElementById('targetAltUnit').value;
    profiles[id].speedUnit = document.getElementById('speedUnit').value;
    profiles[id].airportDistanceUnit = document.getElementById('airportDistanceUnit').value;
    if (!builtInProfiles.find(p => p.id === id)) {
        saveUserProfiles();
    }
}

export function getCurrentProfileId() {
    return document.getElementById('profileSelect').value;
}
