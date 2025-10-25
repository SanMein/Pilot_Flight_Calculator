import { LANGS } from './i18n.js';
import { getLang } from './i18n.js';

export let profiles = {};
export const builtInProfiles = [
    {
        id: 'custom',
        labelKey: 'custom',
        data: {}
    },
    {
        id: 'approach',
        labelKey: 'approach',
        data: {
            currentAlt: '',
            targetAlt: 0,
            speed: '',
            adiAngle: -3,
            airportDistance: '',
            currentAltUnit: 'ft',
            targetAltUnit: 'ft',
            speedUnit: 'kts',
            airportDistanceUnit: 'nmi'
        }
    },
    {
        id: 'short-field',
        labelKey: 'shortField',
        data: {
            currentAlt: '',
            targetAlt: 0,
            speed: '',
            adiAngle: -4,
            airportDistance: '',
            currentAltUnit: 'ft',
            targetAltUnit: 'ft',
            speedUnit: 'kts',
            airportDistanceUnit: 'nmi'
        }
    },
    {
        id: 'climb-out',
        labelKey: 'climbOut',
        data: {
            currentAlt: 0,
            targetAlt: '',
            speed: '',
            adiAngle: 10,
            airportDistance: '',
            currentAltUnit: 'ft',
            targetAltUnit: 'ft',
            speedUnit: 'kts',
            airportDistanceUnit: 'nmi'
        }
    },
];

export function getProfileLabel(id, lang = 'en') {
    if (!lang) lang = 'en';
    const builtIn = builtInProfiles.find(p => p.id === id);
    if (builtIn) return LANGS[lang][builtIn.labelKey] || id;
    return profiles[id]?.name || id;
}

export function loadProfiles() {
    profiles = {};

    // Load built-in profiles
    builtInProfiles.forEach(p => {
        profiles[p.id] = { name: null, ...p.data };
    });

    // Load user profiles from localStorage
    try {
        const userProfiles = JSON.parse(localStorage.getItem('pilot_profiles') || '{}');
        for (const [id, obj] of Object.entries(userProfiles)) {
            profiles[id] = obj;
        }
    } catch (error) {
        console.error('Error loading user profiles:', error);
        localStorage.removeItem('pilot_profiles');
    }

    // Load last used profile
    const lastId = localStorage.getItem('pilot_last_profile') || 'custom';
    if (profiles[lastId]) {
        window.lastProfileId = lastId;
    } else {
        window.lastProfileId = 'custom';
    }
}

export function saveUserProfiles() {
    const userProfiles = {};

    for (const [id, obj] of Object.entries(profiles)) {
        if (!builtInProfiles.find(p => p.id === id)) {
            userProfiles[id] = obj;
        }
    }

    try {
        localStorage.setItem('pilot_profiles', JSON.stringify(userProfiles));
    } catch (error) {
        console.error('Error saving user profiles:', error);
    }
}

export function fillProfileOptions() {
    const select = document.getElementById('profileSelect');
    if (!select) {
        console.error('Profile select element not found');
        return;
    }

    // Save current selection
    const currentValue = select.value;

    select.innerHTML = '';

    // Add all profiles
    Object.keys(profiles).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        const currentLang = getLang();
        option.textContent = getProfileLabel(id, currentLang);
        select.appendChild(option);
    });

    // Restore selection if possible
    if (currentValue && profiles[currentValue]) {
        select.value = currentValue;
    } else if (window.lastProfileId && profiles[window.lastProfileId]) {
        select.value = window.lastProfileId;
    } else {
        select.value = 'custom';
    }
}

export function setFieldsFromProfile(id) {
    const data = profiles[id] || {};

    const fields = [
        { id: 'currentAlt', value: data.currentAlt ?? '' },
        { id: 'targetAlt', value: data.targetAlt ?? '' },
        { id: 'speed', value: data.speed ?? '' },
        { id: 'adiAngle', value: data.adiAngle ?? 0 },
        { id: 'airportDistance', value: data.airportDistance ?? '' },
        { id: 'currentAltUnit', value: data.currentAltUnit ?? 'ft' },
        { id: 'targetAltUnit', value: data.targetAltUnit ?? 'ft' },
        { id: 'speedUnit', value: data.speedUnit ?? 'kts' },
        { id: 'airportDistanceUnit', value: data.airportDistanceUnit ?? 'nmi' }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.value = field.value;

            // Update ADI angle display
            if (field.id === 'adiAngle') {
                const adiAngleValue = document.getElementById('adiAngleValue');
                if (adiAngleValue) {
                    adiAngleValue.textContent = field.value + ' °';
                }
            }
        }
    });
}

export function saveCurrentProfileData(id) {
    if (!profiles[id]) return;

    const fields = [
        'currentAlt', 'targetAlt', 'speed', 'adiAngle', 'airportDistance',
        'currentAltUnit', 'targetAltUnit', 'speedUnit', 'airportDistanceUnit'
    ];

    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            let value = element.value;

            // Convert numeric fields
            if (['adiAngle'].includes(fieldId)) {
                value = parseInt(value, 10) || 0;
            } else if (['currentAlt', 'targetAlt', 'speed', 'airportDistance'].includes(fieldId)) {
                value = value === '' ? '' : parseFloat(value) || 0;
            }

            profiles[id][fieldId] = value;
        }
    });

    // Save if it's a user profile
    if (!builtInProfiles.find(p => p.id === id)) {
        saveUserProfiles();
    }
}

export function getCurrentProfileId() {
    const select = document.getElementById('profileSelect');
    return select ? select.value : 'custom';
}