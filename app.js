(() => {
  'use strict';

  const TAB_IDS = ['pulse', 'declare', 'journal', 'compliance'];
  let selectedChips = [];

  function getElement(id) {
    return document.getElementById(id);
  }

  function switchTab(tabId, showNotice = true) {
    if (!TAB_IDS.includes(tabId)) return;

    TAB_IDS.forEach((id) => {
      const view = getElement(`view-${id}`);
      const tab = getElement(`tab-${id}`);

      if (view) view.classList.toggle('hidden', id !== tabId);
      if (tab) {
        tab.classList.toggle('active-tab', id === tabId);
        tab.setAttribute('aria-selected', String(id === tabId));
      }
    });

    const sidebar = getElement('sidebar');
    if (sidebar) sidebar.classList.remove('open');

    // Keep browser history/shareable links useful without reloading the page.
    if (history.replaceState) history.replaceState(null, '', `#${tabId}`);

    if (showNotice) triggerToast('Module changed successfully.', 'info');
  }

  function toggleTaxonomyChip(element, value) {
    if (!element) return;
    const circle = element.querySelector('i');
    const isSelected = selectedChips.includes(value);

    if (isSelected) {
      selectedChips = selectedChips.filter((item) => item !== value);
      element.classList.remove(
        'border-blue-500', 'border-indigo-500', 'border-purple-500',
        'border-emerald-500', 'bg-gray-800'
      );
      element.setAttribute('aria-pressed', 'false');
      if (circle) {
        circle.classList.remove('text-blue-400', 'text-indigo-400', 'text-purple-400', 'text-emerald-400');
        circle.classList.add('text-gray-700');
      }
      return;
    }

    selectedChips.push(value);
    element.classList.add('bg-gray-800');
    element.setAttribute('aria-pressed', 'true');

    if (circle) {
      circle.classList.remove('text-gray-700');
      const colorClass = {
        Spark: 'text-blue-400',
        Refine: 'text-indigo-400',
        Synthesize: 'text-purple-400',
        Critique: 'text-emerald-400'
      }[value];
      if (colorClass) circle.classList.add(colorClass);
    }
  }

  function simulateSubmission() {
    if (selectedChips.length === 0) {
      triggerToast('Please select at least one taxonomy vector to declare.', 'error');
      return;
    }

    triggerToast('Declaration securely committed to the integrity ledger.', 'success');
    selectedChips = [];

    document.querySelectorAll('[aria-pressed="true"]').forEach((chip) => {
      chip.setAttribute('aria-pressed', 'false');
      chip.classList.remove('bg-gray-800');
      const icon = chip.querySelector('i');
      if (icon) {
        icon.classList.remove('text-blue-400', 'text-indigo-400', 'text-purple-400', 'text-emerald-400');
        icon.classList.add('text-gray-700');
      }
    });

    window.setTimeout(() => switchTab('pulse', false), 900);
  }

  function triggerToast(message, type = 'success') {
    const container = getElement('toast-container');
    if (!container) return;

    const config = {
      success: ['border-l-emerald-500', 'fa-circle-check', 'text-emerald-400'],
      info: ['border-l-blue-500', 'fa-circle-info', 'text-blue-400'],
      error: ['border-l-rose-500', 'fa-circle-exclamation', 'text-rose-400']
    }[type] || ['border-l-blue-500', 'fa-circle-info', 'text-blue-400'];

    const toast = document.createElement('div');
    toast.className = `glass p-4 rounded-xl text-xs font-semibold flex items-center gap-3 border-l-4 ${config[0]} opacity-0 transform translate-y-2 transition-all duration-300 pointer-events-auto`;

    const icon = document.createElement('i');
    icon.className = `fa-solid ${config[1]} ${config[2]} text-sm`;
    const text = document.createElement('span');
    text.className = 'text-white';
    text.textContent = message;
    toast.append(icon, text);
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.remove('opacity-0', 'translate-y-2'));
    window.setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      window.setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  function updateClock() {
    const clock = getElement('live-clock');
    if (!clock) return;
    clock.textContent = new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
  }

  function initialize() {
    // Expose handlers used by the existing inline onclick attributes.
    window.switchTab = switchTab;
    window.toggleTaxonomyChip = toggleTaxonomyChip;
    window.simulateSubmission = simulateSubmission;

    const menuToggle = getElement('menu-toggle');
    const sidebar = getElement('sidebar');
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') sidebar.classList.remove('open');
      });
    }

    // Also bind navigation programmatically, so tabs work even if inline handlers are blocked.
    TAB_IDS.forEach((id) => {
      const tab = getElement(`tab-${id}`);
      if (!tab) return;
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', () => switchTab(id));
    });

    const requestedTab = window.location.hash.replace('#', '');
    switchTab(TAB_IDS.includes(requestedTab) ? requestedTab : 'pulse', false);
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
