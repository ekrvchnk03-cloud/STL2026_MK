// Логика чек-листа

const CHECKLIST = {
    block1: [
        { id: 'c1', text: 'Перед каждым «Согласен» искать Ctrl+F: «третьи лица», «автопродление», «в одностороннем порядке»' },
        { id: 'c2', text: 'Раз в месяц проверять список активных подписок в App Store / Google Play / банке' },
        { id: 'c3', text: 'Отключить автопродление в сервисах, которыми пользуюсь редко' }
    ],
    block2: [
        { id: 'c4', text: 'При cookie-баннере не нажимать «Принять всё» — выбирать «Настроить» или «Отклонить»' },
        { id: 'c5', text: 'Установить браузерные расширения для блокировки трекеров (uBlock Origin, Privacy Badger)' },
        { id: 'c6', text: 'Использовать приватный режим браузера для покупок и поиска чувствительной информации' }
    ],
    block3: [
        { id: 'c7', text: 'Проверить разрешения всех приложений на телефоне (Настройки → Приложения → Разрешения)' },
        { id: 'c8', text: 'Отключить геолокацию у приложений, которым она не нужна (фонарик, калькулятор, игры)' },
        { id: 'c9', text: 'Запретить приложениям доступ к контактам, если это не мессенджер или почта' }
    ],
    block4: [
        { id: 'c10', text: 'Включить двухфакторную аутентификацию (2FA) на Госуслугах, в банке и почте' },
        { id: 'c11', text: 'Установить менеджер паролей (Bitwarden, 1Password или встроенный в браузер)' },
        { id: 'c12', text: 'Заменить одинаковые пароли на разные хотя бы в 5 самых важных аккаунтах' }
    ],
    block5: [
        { id: 'c13', text: 'Раз в месяц проверять haveibeenpwned.com — не утекли ли мои данные' },
        { id: 'c14', text: 'Раз в полгода чистить список приложений, имеющих доступ к моим аккаунтам Google / Apple' },
        { id: 'c15', text: 'Раз в год пересматривать настройки приватности в основных соцсетях и сервисах' }
    ]
};

const STORAGE_KEY = 'mk_checklist_progress';

document.addEventListener('DOMContentLoaded', function() {
    const user = requireUser();
    if (!user) return;
    
    // Проверяем, что чек-лист доступен
    if (!Storage.isChecklistAvailable()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    renderChecklist();
    updateProgress();
});

function renderChecklist() {
    const progress = getProgress();
    
    Object.keys(CHECKLIST).forEach(blockKey => {
        const container = document.getElementById(`${blockKey}Items`);
        if (!container) return;
        
        const items = CHECKLIST[blockKey];
        container.innerHTML = items.map(item => {
            const checked = progress[item.id] ? 'checked' : '';
            const textClass = progress[item.id] ? 'line-through text-slate-500' : 'text-slate-200';
            
            return `
                <label class="flex items-start gap-3 bg-slate-800 hover:bg-slate-700/70 border border-slate-700 rounded-lg p-4 cursor-pointer transition">
                    <input 
                        type="checkbox" 
                        ${checked}
                        data-id="${item.id}"
                        onchange="toggleItem('${item.id}')"
                        class="mt-0.5 w-5 h-5 accent-green-500 flex-shrink-0 cursor-pointer"
                    >
                    <span class="text-sm ${textClass} leading-relaxed" data-text="${item.id}">${item.text}</span>
                </label>
            `;
        }).join('');
    });
}

function toggleItem(id) {
    const progress = getProgress();
    progress[id] = !progress[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    
    // Обновляем визуально без перерисовки всего списка
    const textSpan = document.querySelector(`[data-text="${id}"]`);
    if (textSpan) {
        if (progress[id]) {
            textSpan.classList.add('line-through', 'text-slate-500');
            textSpan.classList.remove('text-slate-200');
        } else {
            textSpan.classList.remove('line-through', 'text-slate-500');
            textSpan.classList.add('text-slate-200');
        }
    }
    
    updateProgress();
}

function getProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

function updateProgress() {
    const progress = getProgress();
    const completed = Object.values(progress).filter(Boolean).length;
    const percent = Math.round((completed / 15) * 100);
    
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('progressBar').style.width = `${percent}%`;
}

function resetChecklist() {
    if (!confirm('Сбросить все отметки в чек-листе?')) return;
    
    localStorage.removeItem(STORAGE_KEY);
    renderChecklist();
    updateProgress();
    showToast('Чек-лист сброшен', 'info');
}

function printChecklist() {
    window.print();
}
