# Changelog: v28 → v29

This document details the changes introduced in version 29 of the Pilot Flight Calculator compared to version 28.

---

## 🇬🇧 English

### Highlights
- Fixed profile saving/restoring edge cases — prevented accidental overwrite of built-in profiles and improved persistence.
- Fixed modal open/close and page-scroll locking issues (Escape key, backdrop click, focus traps).
- Strengthened input validation to avoid NaN/Infinity propagation into calculations.
- Added guards to prevent division by zero and other numeric edge cases.
- Improved ADI slider behaviour and value display (rounding, clearer UX).
- Accessibility (a11y) improvements: keyboard navigation, focus management, clearer labels/placeholders.
- Updated and corrected translations (en/ru/es/de).
- Small performance tuning (debounce, fewer reflows) and UX animation adjustments.
- Documentation updated (README and changelog).

---

## 🇷🇺 Русский

### Основные изменения
- Исправлено сохранение/восстановление профилей — предотвращено перезаписывание встроенных профилей, повышена надёжность хранения.
- Исправлено поведение модального окна и блокировки прокрутки страницы (Escape, клик по фону, фокус).
- Усилена валидация ввода: предотвращение попадания NaN/Infinity в расчёты.
- Добавлены защиты от деления на ноль и других числовых крайних случаев.
- Повышена удобность ADI-ползунка (округление, явное отображение значения).
- Улучшена доступность: клавиатурная навигация, управление фокусом, понятные лейблы и плейсхолдеры.
- Обновлены переводы и документация.
- Небольшие улучшения производительности и плавности анимаций.

---

## 🇪🇸 Español

### Novedades
- Corrección en guardado/restauración de perfiles — evita sobrescribir perfiles integrados.
- Corrección en apertura/cierre del modal y bloqueo del scroll (Escape, click en fondo).
- Validación de entradas más estricta para evitar NaN/Infinity en cálculos.
- Protecciones contra división por cero y casos numéricos límite.
- Mejora en el control ADI (redondeo y visualización clara del valor).
- Mejoras de accesibilidad: navegación por teclado y gestión del foco.
- Traducciones y documentación actualizadas.
- Ajustes de rendimiento y animaciones.

---

## 🇩🇪 Deutsch

### Änderungen
- Fix: Profil-Speicherung/Wiederherstellung — Verhindert Überschreiben eingebauter Profile, verbessert Persistenz.
- Fix: Modal-Verhalten und Scroll-Lock-Probleme (Escape, Klick auf Hintergrund).
- Verbessertes Input-Validation um NaN/Infinity in Berechnungen zu verhindern.
- Schutz gegen Division durch Null und numerische Randfälle.
- ADI-Regler: besseres Verhalten, Rundung und klarere Anzeige.
- Accessibility-Verbesserungen: Tastaturnavigation und Fokusmanagement.
- Aktualisierte Übersetzungen und Dokumentation.
- Kleine Performance- und Animationstuning-Verbesserungen.
