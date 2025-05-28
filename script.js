const translations = {
  ru: {
    siteTitle: "Aeronautica: Calculate flight",
    mainHeading: "Полётный расчёт с индивидуальными единицами",
    adiLabel: "ADI (°)",
    calculateBtn: "Рассчитать",
    placeholders: {
      startAlt: "Начальная высота",
      endAlt: "Конечная высота",
      speed: "Скорость",
      distanceToAirport: "Дистанция до аэродрома",
    },
    result: (vSpeed, vFt, timeMin, distKm, warning) => `
      <b>Результаты:</b><br>
      Вертикальная скорость: ${vSpeed.toFixed(2)} м/с (${vFt.toFixed(0)} ft/min)<br>
      Время: ${timeMin.toFixed(2)} мин<br>
      Расстояние: ${distKm.toFixed(2)} км<br>
      ${warning}
    `,
    warning: "<div style='color:orange;'>⚠ Недостаточная дистанция для такого снижения.</div>"
  },
  en: {
    siteTitle: "Aeronautica: Calculate flight",
    mainHeading: "Flight calculation with custom units",
    adiLabel: "ADI (°)",
    calculateBtn: "Calculate",
    placeholders: {
      startAlt: "Start altitude",
      endAlt: "End altitude",
      speed: "Speed",
      distanceToAirport: "Distance to airport",
    },
    result: (vSpeed, vFt, timeMin, distKm, warning) => `
      <b>Results:</b><br>
      Vertical speed: ${vSpeed.toFixed(2)} m/s (${vFt.toFixed(0)} ft/min)<br>
      Time: ${timeMin.toFixed(2)} min<br>
      Distance: ${distKm.toFixed(2)} km<br>
      ${warning}
    `,
    warning: "<div style='color:orange;'>⚠ Not enough distance for such descent.</div>"
  },
  de: {
    siteTitle: "Aeronautica: Flugberechnung",
    mainHeading: "Flugberechnung mit individuellen Einheiten",
    adiLabel: "ADI (°)",
    calculateBtn: "Berechnen",
    placeholders: {
      startAlt: "Starthöhe",
      endAlt: "Zielhöhe",
      speed: "Geschwindigkeit",
      distanceToAirport: "Entfernung zum Flughafen",
    },
    result: (vSpeed, vFt, timeMin, distKm, warning) => `
      <b>Ergebnisse:</b><br>
      Vertikale Geschwindigkeit: ${vSpeed.toFixed(2)} m/s (${vFt.toFixed(0)} ft/min)<br>
      Zeit: ${timeMin.toFixed(2)} Min<br>
      Entfernung: ${distKm.toFixed(2)} km<br>
      ${warning}
    `,
    warning: "<div style='color:orange;'>⚠ Nicht genug Entfernung für diesen Sinkflug.</div>"
  },
  es: {
    siteTitle: "Aeronautica: Cálculo de vuelo",
    mainHeading: "Cálculo de vuelo con unidades personalizadas",
    adiLabel: "ADI (°)",
    calculateBtn: "Calcular",
    placeholders: {
      startAlt: "Altitud inicial",
      endAlt: "Altitud final",
      speed: "Velocidad",
      distanceToAirport: "Distancia al aeropuerto",
    },
    result: (vSpeed, vFt, timeMin, distKm, warning) => `
      <b>Resultados:</b><br>
      Velocidad vertical: ${vSpeed.toFixed(2)} m/s (${vFt.toFixed(0)} ft/min)<br>
      Tiempo: ${timeMin.toFixed(2)} min<br>
      Distancia: ${distKm.toFixed(2)} km<br>
      ${warning}
    `,
    warning: "<div style='color:orange;'>⚠ Distancia insuficiente para este descenso.</div>"
  },
  ua: {
    siteTitle: "Aeronautica: Розрахунок польоту",
    mainHeading: "Розрахунок польоту з власними одиницями",
    adiLabel: "ADI (°)",
    calculateBtn: "Розрахувати",
    placeholders: {
      startAlt: "Початкова висота",
      endAlt: "Кінцева висота",
      speed: "Швидкість",
      distanceToAirport: "Відстань до аеропорту",
    },
    result: (vSpeed, vFt, timeMin, distKm, warning) => `
      <b>Результати:</b><br>
      Вертикальна швидкість: ${vSpeed.toFixed(2)} м/с (${vFt.toFixed(0)} ft/min)<br>
      Час: ${timeMin.toFixed(2)} хв<br>
      Відстань: ${distKm.toFixed(2)} км<br>
      ${warning}
    `,
    warning: "<div style='color:orange;'>⚠ Недостатня відстань для такого зниження.</div>"
  }
};

function applyLanguage(lang) {
  const t = translations[lang];
  document.getElementById("siteTitle").innerText = t.siteTitle;
  document.getElementById("mainHeading").innerText = t.mainHeading;
  document.getElementById("adiLabel").innerText = t.adiLabel;
  document.getElementById("calculateBtn").innerText = t.calculateBtn;

  document.getElementById("startAlt").placeholder = t.placeholders.startAlt;
  document.getElementById("endAlt").placeholder = t.placeholders.endAlt;
  document.getElementById("speed").placeholder = t.placeholders.speed;
  document.getElementById("distanceToAirport").placeholder = t.placeholders.distanceToAirport;
}

function changeLang(lang) {
  localStorage.setItem("lang", lang);
  applyLanguage(lang);
}

function convertToSI(value, unit) {
  switch (unit) {
    case 'ft': return value * 0.3048;
    case 'm': return value;
    case 'km': return value * 1000;
    case 'nm': return value * 1852;
    case 'knots': return value * 0.514444;
    case 'kmh': return value * 1000 / 3600;
    case 'ms': return value;
    default: return value;
  }
}

function calculate() {
  const lang = localStorage.getItem("lang") || "en";
  const t = translations[lang];

  const startAlt = convertToSI(parseFloat(document.getElementById('startAlt').value), document.getElementById('unitStartAlt').value);
  const endAlt = convertToSI(parseFloat(document.getElementById('endAlt').value), document.getElementById('unitEndAlt').value);
  const speed = convertToSI(parseFloat(document.getElementById('speed').value), document.getElementById('unitSpeed').value);
  const distance = convertToSI(parseFloat(document.getElementById('distanceToAirport').value), document.getElementById('unitDistance').value);
  const adi = parseFloat(document.getElementById('adiAngle').value);

  const rad = Math.abs(adi) * Math.PI / 180;
  const verticalSpeed = Math.tan(rad) * speed;
  const deltaH = Math.abs(startAlt - endAlt);
  const timeSec = deltaH / verticalSpeed;
  const distCovered = speed * timeSec;

  const warning = distCovered > distance ? t.warning : "";

  document.getElementById('result').innerHTML = t.result(
    verticalSpeed,
    verticalSpeed / 0.00508,
    timeSec / 60,
    distCovered / 1000,
    warning
  );
}

window.onload = () => {
  const savedLang = localStorage.getItem("lang") || "en";
  document.getElementById("langSelect").value = savedLang;
  applyLanguage(savedLang);
};
