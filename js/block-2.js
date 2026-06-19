// Логика раздела 2 — Cookie-симулятор

let canFinish = false; // можно ли завершить раздел (после хорошего выбора)

document.addEventListener('DOMContentLoaded', function() {
    const user = requireUser();
    if (!user) return;
});

function handleChoice(choice) {
    if (choice === 'accept') {
        showResult('accept');
    } else if (choice === 'reject') {
        showResult('reject');
    } else if (choice === 'settings') {
        openSettings();
    }
}

function openSettings() {
    const settings = document.getElementById('cookieSettings');
    settings.classList.remove('hidden');
    settings.classList.add('flex');
}

function saveSettings() {
    const analytics = document.getElementById('analyticsCookies').checked;
    const ads = document.getElementById('adCookies').checked;
    const thirdParty = document.getElementById('thirdPartyCookies').checked;
    
    // Закрываем модалку настроек
    const settings = document.getElementById('cookieSettings');
    settings.classList.add('hidden');
    settings.classList.remove('flex');
    
    // Подсчитываем, сколько лишних включил
    const extraCount = [analytics, ads, thirdParty].filter(Boolean).length;
    
    if (extraCount === 0) {
        showResult('settings-good');
    } else if (extraCount <= 1) {
        showResult('settings-okay');
    } else {
        showResult('settings-bad');
    }
}

function showResult(type) {
    // Скрываем баннер
    document.getElementById('cookieBanner').classList.add('hidden');
    
    const container = document.getElementById('resultContainer');
    const card = document.getElementById('resultCard');
    const continueBtn = document.getElementById('continueBtn');
    
    container.classList.remove('hidden');
    
    const results = {
        'accept': {
            border: 'border-red-500',
            bg: 'bg-red-900/20',
            icon: '❌',
            title: 'Вы приняли все cookies',
            text: `Теперь о вас знают: <strong>Google Ads, Meta, Яндекс.Метрика, 3 рекламные сети и 2 системы аналитики</strong>. Каждое ваше движение на сайте, переход, время — всё уйдёт в десятки рекламных баз.`,
            tip: '⚠️ Так делает 76% пользователей. Заметили, что кнопка «Принять всё» — большая зелёная, а «отклонить» — маленькая ссылка? Это <strong>dark pattern</strong>, который намеренно подталкивает к согласию.',
            canFinish: false
        },
        'reject': {
            border: 'border-green-500',
            bg: 'bg-green-900/20',
            icon: '✅',
            title: 'Отлично! Вы отклонили лишние cookies',
            text: 'Сайт всё равно работает — корзина, авторизация, язык остались. Но <strong>без слежки</strong> от десятков рекламных систем.',
            tip: '💡 Обратите внимание: кнопка «отклонить» была намеренно сделана маленькой и серой. Это специально, чтобы было сложнее найти. Теперь вы знаете, куда смотреть.',
            canFinish: true
        },
        'settings-good': {
            border: 'border-green-500',
            bg: 'bg-green-900/20',
            icon: '🎯',
            title: 'Идеальный выбор!',
            text: 'Вы оставили только технические cookies. Сайт работает полноценно, но <strong>данных утекает в десятки раз меньше</strong>.',
            tip: '💡 «Настроить» — самая правильная стратегия. Чуть дольше, но вы реально контролируете, что о вас знает интернет.',
            canFinish: true
        },
        'settings-okay': {
            border: 'border-yellow-500',
            bg: 'bg-yellow-900/20',
            icon: '⚠️',
            title: 'Неплохо, но можно лучше',
            text: 'Вы оставили часть отслеживания. Это уже намного лучше, чем «Принять всё», но <strong>один из типов cookies всё ещё передаёт данные третьим лицам</strong>.',
            tip: '💡 Аналитические cookies (Google Analytics, Яндекс.Метрика) — самые «безобидные», но рекламные и сторонние стоит отключать всегда.',
            canFinish: true
        },
        'settings-bad': {
            border: 'border-red-500',
            bg: 'bg-red-900/20',
            icon: '😐',
            title: 'Почти как «Принять всё»',
            text: 'Вы включили большинство трекеров. Эффект почти такой же, как если бы нажали большую зелёную кнопку.',
            tip: '⚠️ Правило: <strong>чем меньше галочек, тем лучше</strong>. Технические cookies нельзя отключить — этого достаточно для работы сайта.',
            canFinish: false
        }
    };
    
    const result = results[type];
    
    card.className = `rounded-xl p-6 border-2 ${result.border} ${result.bg}`;
    card.innerHTML = `
        <div class="flex items-start gap-4 mb-4">
            <span class="text-4xl">${result.icon}</span>
            <div>
                <h3 class="text-xl font-bold mb-2">${result.title}</h3>
                <p class="text-slate-300 leading-relaxed">${result.text}</p>
            </div>
        </div>
        <div class="bg-slate-900/50 rounded-lg p-3 text-sm text-slate-300 mt-4">
            ${result.tip}
        </div>
    `;
    
    canFinish = result.canFinish;
    
    if (canFinish) {
        continueBtn.classList.remove('hidden');
    } else {
        continueBtn.classList.add('hidden');
    }
    
    // Прокручиваем к результату
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function tryAgain() {
    // Сбрасываем состояние
    document.getElementById('cookieBanner').classList.remove('hidden');
    document.getElementById('resultContainer').classList.add('hidden');
    document.getElementById('analyticsCookies').checked = false;
    document.getElementById('adCookies').checked = false;
    document.getElementById('thirdPartyCookies').checked = false;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function finishBlock() {
    Storage.setBlockComplete(2);
    window.location.href = 'dashboard.html';
}
