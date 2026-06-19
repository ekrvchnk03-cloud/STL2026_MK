// Логика раздела 1

const TRAPS = {
    autopay: {
        title: 'Автопродление подписки',
        text: 'Это классическая ловушка. После бесплатного периода с вас будут списывать деньги без уведомления. По статистике, 60% людей не отменяют подписку вовремя и теряют от 500 до 5000 ₽ в год.'
    },
    partners: {
        title: 'Передача данных без ограничений',
        text: 'Когда сервис передаёт данные «партнёрам без ограничений» — это значит, что ваш email, телефон и ФИО могут оказаться в десятках рекламных баз. Именно так начинается спам и звонки от мошенников.'
    },
    unilateral: {
        title: 'Изменение условий в одностороннем порядке',
        text: 'Сегодня сервис бесплатный, завтра — платный. Сегодня хранит 5 ГБ, завтра — 500 МБ. И всё это без вашего согласия. Такие пункты делают соглашение «резиновым» — компания может менять правила игры в любой момент.'
    }
};

let foundTraps = new Set();
let timerInterval;
let timeLeft = 60;

document.addEventListener('DOMContentLoaded', function() {
    const user = requireUser();
    if (!user) return;

    // Запускаем таймер
    startTimer();

    // Навешиваем клики на все пункты
    document.querySelectorAll('#agreementText p').forEach(paragraph => {
        paragraph.addEventListener('click', function() {
            handleClick(this);
        });
        
        // Курсор-указатель для всех пунктов (нельзя выдавать подвохи)
        paragraph.style.cursor = 'pointer';
    });
});

function handleClick(element) {
    const trapKey = element.dataset.trap;
    
    if (trapKey && !foundTraps.has(trapKey)) {
        // Это подвох — и его ещё не нашли
        foundTraps.add(trapKey);
        element.classList.add('suspicious-found');
        element.style.cursor = 'default';
        element.removeEventListener('click', handleClick);
        
        updateProgress();
        showExplanation(trapKey);
        
    } else if (!trapKey) {
        // Это безвредный пункт
        element.classList.add('suspicious-wrong');
        setTimeout(() => {
            element.classList.remove('suspicious-wrong');
        }, 600);
        
        showToast('Это нормальный пункт. Ищи дальше!', 'warning');
    }
}

function updateProgress() {
    const count = foundTraps.size;
    document.getElementById('foundCount').textContent = count;
    
    const btn = document.getElementById('finishBtn');
    
    if (count === 3) {
        btn.disabled = false;
        btn.textContent = '✅ Завершить раздел';
        btn.className = 'w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer font-semibold py-3 px-6 rounded-lg transition transform hover:scale-[1.02]';
        clearInterval(timerInterval);
    } else {
        btn.textContent = `Осталось найти: ${3 - count}`;
    }
}

function showExplanation(trapKey) {
    const trap = TRAPS[trapKey];
    document.getElementById('explanationText').innerHTML = `
        <strong class="text-white">${trap.title}.</strong><br><br>
        ${trap.text}
    `;
    
    const modal = document.getElementById('explanationModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeExplanation() {
    const modal = document.getElementById('explanationModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const min = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const sec = (timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${min}:${sec}`;
        
        if (timeLeft <= 10) {
            document.getElementById('timer').classList.add('text-red-400');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timer').textContent = '00:00';
            // Время вышло, но можно продолжать искать
            showToast('Время вышло! Но вы можете продолжать поиск.', 'warning');
        }
    }, 1000);
}

function finishBlock() {
    if (foundTraps.size < 3) return;
    
    // Сохраняем прохождение
    Storage.setBlockComplete(1);
    
    // Показываем финальную модалку
    const modal = document.getElementById('finishModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
