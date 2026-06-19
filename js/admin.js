// Логика админ-панели

document.addEventListener('DOMContentLoaded', function() {
    renderUserData();
    renderProgress();
});

function renderUserData() {
    const user = Storage.getUser();
    const container = document.getElementById('userDataBlock');
    
    if (!user) {
        container.innerHTML = `
            <p class="text-slate-400">Пользователь не зарегистрирован на этом устройстве.</p>
            <a href="index.html" class="inline-block mt-2 text-cyan-400 hover:underline">→ Перейти к регистрации</a>
        `;
        return;
    }
    
    const registeredDate = new Date(user.registered_at).toLocaleString('ru-RU');
    
    container.innerHTML = `
        <div class="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <div class="text-xs text-slate-500 mb-1">ФИО</div>
            <div class="font-semibold">${escapeHtml(user.name)}</div>
        </div>
        <div class="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <div class="text-xs text-slate-500 mb-1">Email</div>
            <div class="font-semibold">${escapeHtml(user.email)}</div>
        </div>
        <div class="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <div class="text-xs text-slate-500 mb-1">Телефон</div>
            <div class="font-semibold">${escapeHtml(user.phone)}</div>
        </div>
        <div class="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <div class="text-xs text-slate-500 mb-1">Зарегистрирован</div>
            <div class="font-semibold">${registeredDate}</div>
        </div>
    `;
}

function renderProgress() {
    const progress = Storage.getProgress();
    const container = document.getElementById('progressBlock');
    const score = Storage.getBlock3Score();
    
    const items = [
        { key: 'poll', label: 'Опрос «Читаете ли соглашения»' },
        { key: 'block1', label: 'Раздел 1: Поиск подвохов в соглашении' },
        { key: 'block2', label: 'Раздел 2: Cookie-симулятор' },
        { key: 'block3', label: `Раздел 3: «Даю или не даю?» (${score}/5 правильных)` }
    ];
    
    container.innerHTML = items.map(item => {
        const done = progress[item.key];
        const icon = done ? '✅' : '⏳';
        const textClass = done ? 'text-green-400' : 'text-slate-500';
        
        return `
            <div class="flex items-center gap-3 bg-slate-900 rounded-lg p-3 border border-slate-700">
                <span class="text-xl">${icon}</span>
                <span class="${textClass}">${item.label}</span>
            </div>
        `;
    }).join('');
}

function showRawData() {
    const allData = {};
    
    Object.values(Storage.KEYS).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                allData[key] = JSON.parse(value);
            } catch (e) {
                allData[key] = value;
            }
        }
    });
    
    // Также добавим прочие ключи (опрос, чек-лист)
    const extraKeys = ['mk_poll_stats', 'mk_checklist_progress'];
    extraKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                allData[key] = JSON.parse(value);
            } catch (e) {
                allData[key] = value;
            }
        }
    });
    
    document.getElementById('rawDataContent').textContent = JSON.stringify(allData, null, 2);
    
    const modal = document.getElementById('rawDataModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeRawData() {
    const modal = document.getElementById('rawDataModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function toggleTrap() {
    const modal = document.getElementById('trapModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeTrap() {
    const modal = document.getElementById('trapModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function clearAllData() {
    if (!confirm('⚠️ Удалить все данные с устройства? Это сбросит регистрацию и весь прогресс. Подтвердить?')) return;
    
    // Очищаем всё что связано с МК
    Storage.clearAll();
    localStorage.removeItem('mk_poll_vote');
    localStorage.removeItem('mk_poll_stats');
    localStorage.removeItem('mk_checklist_progress');
    
    alert('Данные очищены. Сейчас перейдём на главную.');
    window.location.href = 'index.html';
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
