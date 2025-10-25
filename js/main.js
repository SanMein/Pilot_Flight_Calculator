import { LANGS, setLang, getLang } from './i18n.js';
import { profiles, builtInProfiles, getProfileLabel, loadProfiles, saveUserProfiles, fillProfileOptions, setFieldsFromProfile, saveCurrentProfileData, getCurrentProfileId } from './profiles.js';
import { calculate } from './calculator.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const settingsBtn = document.getElementById('settingsBtn');
    const modalBg = document.getElementById('modalBg');
    const modal = document.getElementById('settingsModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const langSelect = document.getElementById('langSelect');
    const deleteProfileBtn = document.getElementById('deleteProfileBtn');
    const addProfileBtn = document.getElementById('addProfileBtn');
    const profileSelect = document.getElementById('profileSelect');

    // Check if elements exist
    if (!settingsBtn || !modalBg || !modal || !modalCloseBtn) {
        console.error('Required DOM elements not found');
        return;
    }

    console.log('All modal elements found');

    // Простая и надежная логика модального окна
    function openModal() {
        console.log('Opening modal');
        modalBg.style.display = 'block';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокируем скролл
    }

    function closeModal() {
        console.log('Closing modal');
        modalBg.style.display = 'none';
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Восстанавливаем скролл
    }

    // Event listeners
    settingsBtn.addEventListener('click', openModal);
    modalCloseBtn.addEventListener('click', closeModal);
    modalBg.addEventListener('click', closeModal);

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Prevent modal close when clicking on modal content
    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Language selection
    const currentLang = getLang();
    langSelect.value = currentLang;

    langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        setLang(newLang);
        updateUI();
    });

    // Initialize application
    function initializeApp() {
        console.log('Initializing application...');
        loadProfiles();
        fillProfileOptions();
        setLang(getLang());
        updateUI();

        // Set initial profile
        const initialProfileId = window.lastProfileId || 'custom';
        setFieldsFromProfile(initialProfileId);
        if (profileSelect) {
            profileSelect.value = initialProfileId;
        }

        // Update delete button visibility
        updateDeleteButtonVisibility();

        // Initial calculation
        calculate();

        console.log('Application initialized successfully');
    }

    function updateUI() {
        // Update profile options with current language
        fillProfileOptions();
        updateDeleteButtonVisibility();
    }

    function updateDeleteButtonVisibility() {
        if (!deleteProfileBtn) return;

        const currentProfileId = getCurrentProfileId();
        const isCustomProfile = currentProfileId === 'custom';
        const isBuiltInProfile = builtInProfiles.find(p => p.id === currentProfileId);

        deleteProfileBtn.style.display = (isCustomProfile || isBuiltInProfile) ? 'none' : 'block';
    }

    // Profile selection
    if (profileSelect) {
        profileSelect.addEventListener('change', function() {
            const previousProfileId = window.lastProfileId || 'custom';
            const newProfileId = this.value;

            // Save current data to previous profile
            saveCurrentProfileData(previousProfileId);

            // Load new profile
            setFieldsFromProfile(newProfileId);
            window.lastProfileId = newProfileId;
            localStorage.setItem('pilot_last_profile', newProfileId);

            // Update UI
            updateDeleteButtonVisibility();
            calculate();
        });
    }

    // Add profile
    if (addProfileBtn) {
        addProfileBtn.addEventListener('click', function() {
            const lang = getLang();
            let name = prompt(LANGS[lang].newProfileName || "Profile name");

            if (!name || name.trim() === '') return;

            name = name.trim();

            // Generate ID from name
            let baseId = name.toLowerCase()
                .replace(/[^a-zа-яё0-9]/gi, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            let id = baseId;
            let i = 2;

            // Ensure unique ID
            while (profiles[id] && !builtInProfiles.find(p => p.id === id)) {
                id = `${baseId}-${i++}`;
            }

            // Check if trying to overwrite built-in profile
            if (builtInProfiles.find(p => p.id === id)) {
                alert("A built-in profile already exists with this name.");
                return;
            }

            // Create new profile
            profiles[id] = {
                name: name,
                currentAlt: document.getElementById('currentAlt')?.value || '',
                targetAlt: document.getElementById('targetAlt')?.value || '',
                speed: document.getElementById('speed')?.value || '',
                adiAngle: parseInt(document.getElementById('adiAngle')?.value || 0, 10),
                airportDistance: document.getElementById('airportDistance')?.value || '',
                currentAltUnit: document.getElementById('currentAltUnit')?.value || 'ft',
                targetAltUnit: document.getElementById('targetAltUnit')?.value || 'ft',
                speedUnit: document.getElementById('speedUnit')?.value || 'kts',
                airportDistanceUnit: document.getElementById('airportDistanceUnit')?.value || 'nmi'
            };

            saveUserProfiles();
            fillProfileOptions();
            if (profileSelect) {
                profileSelect.value = id;
            }
            window.lastProfileId = id;
            localStorage.setItem('pilot_last_profile', id);

            updateDeleteButtonVisibility();
            calculate();
        });
    }

    // Delete profile
    if (deleteProfileBtn) {
        deleteProfileBtn.addEventListener('click', function() {
            const id = getCurrentProfileId();

            if (!profiles[id] || builtInProfiles.find(p => p.id === id)) return;

            const lang = getLang();
            if (!confirm(`${LANGS[lang].deleteProfile} "${profiles[id].name}"?`)) return;

            delete profiles[id];
            saveUserProfiles();
            fillProfileOptions();

            // Switch to custom profile
            if (profileSelect) {
                profileSelect.value = 'custom';
            }
            setFieldsFromProfile('custom');
            window.lastProfileId = 'custom';
            localStorage.setItem('pilot_last_profile', 'custom');

            updateDeleteButtonVisibility();
            calculate();
        });
    }

    // Input event listeners
    const inputElements = [
        'currentAlt', 'targetAlt', 'speed', 'airportDistance',
        'currentAltUnit', 'targetAltUnit', 'speedUnit', 'airportDistanceUnit'
    ];

    inputElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                saveCurrentProfileData(getCurrentProfileId());
                calculate();
            });
            element.addEventListener('change', () => {
                saveCurrentProfileData(getCurrentProfileId());
                calculate();
            });
        }
    });

    // ADI Slider
    const adiSlider = document.getElementById('adiAngle');
    const adiAngleValue = document.getElementById('adiAngleValue');

    if (adiSlider && adiAngleValue) {
        adiSlider.addEventListener('input', function() {
            const value = Math.round(parseFloat(this.value));
            this.value = value;
            adiAngleValue.textContent = value + ' °';
            saveCurrentProfileData(getCurrentProfileId());
            calculate();
        });
    }

    // Initialize the application
    initializeApp();
});