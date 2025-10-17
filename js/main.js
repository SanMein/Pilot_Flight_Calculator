import { LANGS, setLang, getLang } from './i18n.js';
import { profiles, builtInProfiles, getProfileLabel, loadProfiles, saveUserProfiles, fillProfileOptions, setFieldsFromProfile, saveCurrentProfileData, getCurrentProfileId } from './profiles.js';
import { calculate } from './calculator.js';

document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingsBtn');
    const modalBg = document.getElementById('modalBg');
    const modal = document.getElementById('settingsModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const deleteProfileBtn = document.getElementById('deleteProfileBtn');

    // Проверка существования элементов
    if (!settingsBtn || !modalBg || !modal || !modalCloseBtn) {
        console.error('One or more DOM elements not found');
        return;
    }

    // Открытие модального окна
    settingsBtn.onclick = () => {
        modalBg.classList.add('active');
        modal.classList.add('active');
    };

    // Закрытие модального окна только при клике на фон
    modalBg.onclick = (e) => {
        if (e.target === modalBg) {
            modalBg.classList.remove('active');
            modal.classList.remove('active');
        }
    };

    // Закрытие по кнопке
    modalCloseBtn.onclick = () => {
        modalBg.classList.remove('active');
        modal.classList.remove('active');
    };

    // Изменение языка
    document.getElementById('langSelect').onchange = (e) => {
        localStorage.setItem('pilot_lang', e.target.value);
        setLang(e.target.value);
    };

    loadProfiles();
    fillProfileOptions();
    setFieldsFromProfile(window.lastProfileId || 'custom');
    setLang(getLang());

    // Обработчик выбора профиля с управлением видимостью кнопки удаления
    document.getElementById('profileSelect').onchange = function() {
        saveCurrentProfileData(window.lastProfileId || 'custom');
        setFieldsFromProfile(this.value);
        fillProfileOptions();
        window.lastProfileId = this.value;
        calculate();
        // Скрываем кнопку удаления для "Custom", показываем для остальных
        deleteProfileBtn.style.display = this.value === 'custom' ? 'none' : 'inline-flex';
    };
    window.lastProfileId = getCurrentProfileId();
    // Инициализация видимости кнопки
    deleteProfileBtn.style.display = getCurrentProfileId() === 'custom' ? 'none' : 'inline-flex';

    document.getElementById('addProfileBtn').onclick = function() {
        const lang = getLang();
        let name = prompt(LANGS[lang].newProfileName || "Profile name");
        if (!name) return;
        // Очистка имени для использования в качестве ID
        let baseId = name.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-');
        let id = baseId;
        let i = 2;
        // Проверка уникальности ID
        while (profiles[id] && !builtInProfiles.find(p => p.id === id)) id = baseId + '-' + i++;
        // Проверка, не перезаписываем ли встроенный профиль
        if (builtInProfiles.find(p => p.id === id)) {
            alert("A built-in profile already exists with this name.");
            return;
        }
        profiles[id] = {
            name: name,
            currentAlt: document.getElementById('currentAlt').value,
            targetAlt: document.getElementById('targetAlt').value,
            speed: document.getElementById('speed').value,
            adiAngle: parseInt(document.getElementById('adiAngle').value, 10),
            airportDistance: document.getElementById('airportDistance').value,
            currentAltUnit: document.getElementById('currentAltUnit').value,
            targetAltUnit: document.getElementById('targetAltUnit').value,
            speedUnit: document.getElementById('speedUnit').value,
            airportDistanceUnit: document.getElementById('airportDistanceUnit').value
        };
        saveUserProfiles();
        fillProfileOptions();
        document.getElementById('profileSelect').value = id;
        window.lastProfileId = id;
        calculate();
        deleteProfileBtn.style.display = id === 'custom' ? 'none' : 'inline-flex';
    };

    document.getElementById('deleteProfileBtn').onclick = function() {
        const id = getCurrentProfileId();
        if (!profiles[id] || builtInProfiles.find(p => p.id === id)) return;
        const lang = getLang();
        if (!confirm(`${LANGS[lang].deleteProfile}?`)) return;
        delete profiles[id];
        saveUserProfiles();
        fillProfileOptions();
        document.getElementById('profileSelect').value = 'custom';
        setFieldsFromProfile('custom');
        window.lastProfileId = 'custom';
        calculate();
        deleteProfileBtn.style.display = 'none';
    };

    const inputs = ['currentAlt', 'targetAlt', 'currentAltUnit', 'targetAltUnit', 'speed', 'speedUnit', 'adiAngle', 'airportDistance', 'airportDistanceUnit'];
    inputs.forEach(id => {
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

    const adiSlider = document.getElementById('adiAngle');
    const adiAngleValue = document.getElementById('adiAngleValue');
    adiSlider.addEventListener('input', function() {
        // Округление значения слайдера
        this.value = Math.round(this.value);
        adiAngleValue.textContent = this.value + ' °';
        saveCurrentProfileData(getCurrentProfileId());
        calculate();
    });

    // Инициализация начального расчёта
    saveCurrentProfileData(getCurrentProfileId());
    calculate();
});