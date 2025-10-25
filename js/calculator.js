import { debounce, isValidNumber } from './utils.js';
import { getLang, LANGS } from './i18n.js';

export function convertToMeters(value, unit) {
    if (!isValidNumber(value)) return 0;
    if (unit === 'ft') return value * 0.3048;
    return value;
}

export function convertToMps(value, unit) {
    if (!isValidNumber(value)) return 0;

    switch (unit) {
        case 'kts': return value * 0.514444;
        case 'mph': return value * 0.44704;
        case 'kmh': return value * 0.277778;
        case 'mps': return value;
        default: return value;
    }
}

export function convertDistanceToKm(value, unit) {
    if (!isValidNumber(value)) return 0;

    switch (unit) {
        case 'km': return value;
        case 'mi': return value * 1.609344;
        case 'nmi': return value * 1.852;
        default: return value;
    }
}

export function convertKmToUnit(km, unit) {
    if (!isValidNumber(km)) return 0;

    switch (unit) {
        case 'km': return km;
        case 'mi': return km * 0.621371;
        case 'nmi': return km * 0.539957;
        default: return km;
    }
}

export const calculate = debounce(function() {
    const lang = getLang();

    // Get input values
    const currentAlt = parseFloat(document.getElementById('currentAlt').value);
    const targetAlt = parseFloat(document.getElementById('targetAlt').value);
    const currentAltUnit = document.getElementById('currentAltUnit').value;
    const targetAltUnit = document.getElementById('targetAltUnit').value;
    const speed = parseFloat(document.getElementById('speed').value);
    const speedUnit = document.getElementById('speedUnit').value;
    const adiAngle = Math.round(parseInt(document.getElementById('adiAngle').value, 10) || 0);
    const airportDistance = parseFloat(document.getElementById('airportDistance').value);
    const airportDistanceUnit = document.getElementById('airportDistanceUnit').value;

    // Validate inputs
    const isValidCurrentAlt = isValidNumber(currentAlt) && currentAlt >= 0;
    const isValidTargetAlt = isValidNumber(targetAlt) && targetAlt >= 0;
    const isValidSpeed = isValidNumber(speed) && speed > 0;
    const isValidAdiAngle = isValidNumber(adiAngle);
    const isValidAirportDistance = isValidNumber(airportDistance) && airportDistance >= 0;

    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;

    resultsDiv.classList.remove('animate-results');

    requestAnimationFrame(() => {
        // Check if we have valid inputs for calculation
        if (!isValidCurrentAlt || !isValidTargetAlt || !isValidSpeed || !isValidAdiAngle) {
            let subtext = LANGS[lang].calcAuto;

            if ((currentAlt < 0 || targetAlt < 0 || speed <= 0 || airportDistance < 0) &&
                (isValidNumber(currentAlt) || isValidNumber(targetAlt) || isValidNumber(speed) || isValidNumber(airportDistance))) {
                subtext = LANGS[lang].invalidInput;
            }

            resultsDiv.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <div class="empty-text">${LANGS[lang].fillFields}</div>
                    <div class="empty-subtext">${subtext}</div>
                </div>
            `;
            resultsDiv.classList.add('animate-results');
            return;
        }

        // Convert units to metric
        const currentAltM = convertToMeters(currentAlt, currentAltUnit);
        const targetAltM = convertToMeters(targetAlt, targetAltUnit);
        const speedMps = convertToMps(speed, speedUnit);
        const angle = adiAngle;

        // Calculate altitude difference
        const altDiff = Math.abs(targetAltM - currentAltM);

        // Calculate vertical speed
        const verticalSpeedMps = speedMps * Math.sin(angle * Math.PI / 180);

        // Check for no vertical movement
        if (Math.abs(verticalSpeedMps) < 0.001) {
            resultsDiv.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <div class="empty-text">${LANGS[lang].noVertical}</div>
                    <div class="empty-subtext">${LANGS[lang].calcAuto}</div>
                </div>
            `;
            resultsDiv.classList.add('animate-results');
            return;
        }

        // Calculate results
        const verticalSpeedFpm = verticalSpeedMps * 196.85;
        const timeMinutes = altDiff / Math.abs(verticalSpeedMps) / 60;
        const horizontalSpeedMps = speedMps * Math.cos(angle * Math.PI / 180);
        const distanceKm = (horizontalSpeedMps * timeMinutes * 60) / 1000;

        // Airport reachability check
        let airportStatusHtml = '';
        if (isValidAirportDistance && adiAngle < 0) {
            const airportDistanceConverted = convertDistanceToKm(airportDistance, airportDistanceUnit);
            const canReachAirport = distanceKm <= airportDistanceConverted;

            airportStatusHtml = `
                <div class="airport-status ${canReachAirport ? 'success' : 'danger'}">
                    <span class="status-indicator">${canReachAirport ? '✅' : '❌'}</span>
                    ${canReachAirport ? LANGS[lang].canReach : LANGS[lang].cannotReach}
                </div>
            `;
        }

        // Format distance with appropriate unit
        const distValue = convertKmToUnit(distanceKm, airportDistanceUnit).toFixed(1);
        const distUnit = airportDistanceUnit;

        // Display results
        resultsDiv.innerHTML = `
            ${airportStatusHtml}
            <div class="result-card blue" style="--order: 1;">
                <div class="result-label">${LANGS[lang].verticalSpeed}</div>
                <div class="result-value">
                    ${Math.abs(verticalSpeedMps).toFixed(2)} m/s
                    <span class="result-subtext">(${Math.abs(verticalSpeedFpm).toFixed(0)} ft/min)</span>
                </div>
            </div>
            <div class="result-card blue" style="--order: 2;">
                <div class="result-label">${LANGS[lang].timeToReach}</div>
                <div class="result-value">${timeMinutes.toFixed(1)} minutes</div>
            </div>
            <div class="result-card purple" style="--order: 3;">
                <div class="result-label">${LANGS[lang].horizontalDistance}</div>
                <div class="result-value">${distValue} ${distUnit}</div>
            </div>
        `;

        resultsDiv.classList.add('animate-results');
    });
}, 400);