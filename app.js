// Tab Router Implementation
        function switchTab(tabId) {
            // Hide all views
            document.getElementById('view-pulse').classList.add('hidden');
            document.getElementById('view-declare').classList.add('hidden');
            document.getElementById('view-journal').classList.add('hidden');
            document.getElementById('view-compliance').classList.add('hidden');
            
            // Deactivate all buttons
            document.getElementById('tab-pulse').classList.remove('active-tab');
            document.getElementById('tab-declare').classList.remove('active-tab');
            document.getElementById('tab-journal').classList.remove('active-tab');
            document.getElementById('tab-compliance').classList.remove('active-tab');

            // Activate targeting assets
            document.getElementById('view-' + tabId).classList.remove('hidden');
            document.getElementById('tab-' + tabId).classList.add('active-tab');
            
            triggerToast("Switched to module framework viewport context.", "info");
        }

        // Chip selection interaction logic
        let selectedChips = [];
        function toggleTaxonomyChip(element, value) {
            const circle = element.querySelector('i');
            if(selectedChips.includes(value)) {
                selectedChips = selectedChips.filter(item => item !== value);
                element.classList.remove('border-blue-500', 'border-indigo-500', 'border-purple-500', 'border-emerald-500', 'bg-gray-800');
                circle.classList.remove('text-blue-400', 'text-indigo-400', 'text-purple-400', 'text-emerald-400');
                circle.classList.add('text-gray-700');
            } else {
                selectedChips.push(value);
                element.classList.add('bg-gray-800');
                circle.classList.remove('text-gray-700');
                if (value === 'Spark') circle.classList.add('text-blue-400');
                if (value === 'Refine') circle.classList.add('text-indigo-400');
                if (value === 'Synthesize') circle.classList.add('text-purple-400');
                if (value === 'Critique') circle.classList.add('text-emerald-400');
            }
        }

        function simulateSubmission() {
            if(selectedChips.length === 0) {
                triggerToast("Please select at least one taxonomy vector to declare.", "error");
                return;
            }
            triggerToast("Hashed & Committed securely to the integrity ledger!", "success");
            selectedChips = [];
            setTimeout(() => { switchTab('pulse'); }, 1000);
        }

        // Lightweight dynamic component for notifications
        function triggerToast(message, type = "success") {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `glass p-4 rounded-xl text-xs font-semibold flex items-center gap-3 border-l-4 opacity-0 transform translate-y-2 transition-all duration-300 pointer-events-auto`;
            
            if(type === 'success') { toast.classList.add('border-l-emerald-500'); toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 text-sm"></i> <span class="text-white">${message}</span>`; }
            if(type === 'info') { toast.classList.add('border-l-blue-500'); toast.innerHTML = `<i class="fa-solid fa-circle-info text-blue-400 text-sm"></i> <span class="text-white">${message}</span>`; }
            if(type === 'error') { toast.classList.add('border-l-rose-500'); toast.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose-400 text-sm"></i> <span class="text-white">${message}</span>`; }

            container.appendChild(toast);
            setTimeout(() => { toast.classList.remove('opacity-0', 'translate-y-2'); }, 50);
            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => { toast.remove(); }, 300);
            }, 3000);
        }

// Live UTC clock and responsive navigation
function updateClock() {
  const clock = document.getElementById('live-clock');
  if (!clock) return;
  const now = new Date();
  clock.textContent = now.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}
updateClock();
setInterval(updateClock, 1000);

const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.querySelectorAll('nav button').forEach(btn => btn.addEventListener('click', () => sidebar.classList.remove('open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') sidebar.classList.remove('open'); });
}
