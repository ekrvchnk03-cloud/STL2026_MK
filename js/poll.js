// Логика опроса

// Стартовые данные (имитация уже проголосовавших)
const INITIAL_STATS = {
    red: 18,    // имитация: 18 человек уже выбрали "не читаю"
    green: 4    // имитация: 4 человека выбрали "читаю"
};

document.addEventListener('DOMContentLoaded', function() {
    const user = requireUser();
    if (!user) return;

    // Если пользователь уже голосовал — показываем результаты
    const myVote = localStorage.getItem('mk_poll_vote');
    if (myVote) {
        showResults(myVote);
    }
});

function vote(choice) {
    // Сохраняем голос локально (на сервер не отправляем — пустышка)
    localStorage.setItem('mk_poll_vote', choice);
    
    // Обновляем "статистику" в localStorage
    const stats = getStats();
    stats[choice]++;
    localStorage.setItem('mk_poll_stats', JSON.stringify(stats));
    
    // Отмечаем опрос как пройденный
    Storage.setPollComplete();
    
    showResults(choice);
}

function getStats() {
    const saved = localStorage.getItem('mk_poll_stats');
    if (saved) {
        return JSON.parse(saved);
    }
    return { ...INITIAL_STATS };
}

function showResults(myChoice) {
    // Скрываем кнопки, показываем результаты
    document.getElementById('voteSection').classList.add('hidden');
    document.getElementById('resultsSection').classList.remove('hidden');
    
    const stats = getStats();
    const total = stats.red + stats.green;
    const redPercent = Math.round((stats.red / total) * 100);
    const greenPercent = 100 - redPercent;
    
    // Обновляем числа
    document.getElementById('redPercent').textContent = redPercent + '%';
    document.getElementById('greenPercent').textContent = greenPercent + '%';
    document.getElementById('redCount').textContent = stats.red + ' голос' + getEnding(stats.red);
    document.getElementById('greenCount').textContent = stats.green + ' голос' + getEnding(stats.green);
    document.getElementById('totalCount').textContent = total;
    
    // Анимация прогресс-баров (с задержкой для эффектности)
    setTimeout(() => {
        document.getElementById('redBar').style.width = redPercent + '%';
        document.getElementById('greenBar').style.width = greenPercent + '%';
    }, 100);
    
    // Сообщение под результатом
    const message = document.getElementById('resultMessage');
    if (myChoice === 'red') {
        message.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-2xl">💡</span>
                <div>
                    <div class="font-semibold mb-1">Честный ответ — это уже шаг.</div>
                    <div class="text-sm text-slate-300">По исследованию Deloitte, 97% людей 18-34 лет соглашаются с условиями, не читая. Вы не одиноки. Сегодня научимся это менять.</div>
                </div>
            </div>
        `;
    } else {
        message.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-2xl">🎯</span>
                <div>
                    <div class="font-semibold mb-1">Уверены?</div>
                    <div class="text-sm text-slate-300">Большинство людей думают, что читают соглашения, но на самом деле просматривают пару строк. На следующем разделе проверим — найдёте ли вы 3 подвоха в коротком тексте.</div>
                </div>
            </div>
        `;
    }
}

function getEnding(num) {
    const lastTwo = num % 100;
    const lastOne = num % 10;
    if (lastTwo >= 11 && lastTwo <= 19) return 'ов';
    if (lastOne === 1) return '';
    if (lastOne >= 2 && lastOne <= 4) return 'а';
    return 'ов';
}
