// Логика раздела 3 — Даю или не даю?

const QUESTIONS = [
    {
        context: 'Вы скачали бесплатное приложение «Фонарик». При первом запуске:',
        appIcon: '🔦',
        appName: 'Фонарик Pro',
        permission: '«Приложение хочет получить доступ к вашей <strong>геолокации</strong>»',
        correct: 'deny',
        feedback: {
            title: 'Фонарику не нужна геолокация',
            text: 'В 2014 году приложение <strong>Brightest Flashlight Free</strong> (10 млн скачиваний) попало в скандал: оно собирало данные о местоположении пользователей и продавало их рекламным сетям. Если функция приложения — включить вспышку, то ему не нужно ничего, кроме доступа к камере.'
        }
    },
    {
        context: 'Вы установили мобильную игру-головоломку. После запуска появляется окно:',
        appIcon: '🎮',
        appName: 'Puzzle Master',
        permission: '«Разрешить доступ к <strong>списку контактов</strong> для приглашения друзей?»',
        correct: 'deny',
        feedback: {
            title: 'Игре не нужны ваши контакты',
            text: 'Это классический трюк: «дай контакты, мы пригласим друзей». На деле приложение получает <strong>имена, телефоны и email всех ваших знакомых</strong> — и часто продаёт эти базы рекламодателям. Хотите пригласить друга? Просто отправьте ему ссылку через мессенджер.'
        }
    },
    {
        context: 'Вы открыли мессенджер для звонка маме:',
        appIcon: '💬',
        appName: 'Messenger',
        permission: '«Приложение запрашивает доступ к <strong>микрофону</strong>»',
        correct: 'allow',
        feedback: {
            title: 'Это нормальный запрос',
            text: 'Мессенджеру нужен микрофон, чтобы вы могли совершать голосовые звонки. <strong>Это логично и оправданно</strong>. Главное — в настройках телефона выбрать опцию «<strong>Разрешить только при использовании</strong>» — тогда приложение не сможет писать звук в фоне.'
        }
    },
    {
        context: 'Вы записались на онлайн-курс по программированию. Приложение курса просит:',
        appIcon: '📚',
        appName: 'CodeAcademy',
        permission: '«Разрешить доступ к <strong>фото и медиафайлам</strong>?»',
        correct: 'deny',
        feedback: {
            title: 'Зачем курсу ваши фото?',
            text: 'Образовательному приложению фотографии не нужны вообще. Под этим разрешением скрывается доступ <strong>ко всей галерее</strong> — личные фото, документы, скриншоты переписок. Если когда-то понадобится загрузить аватарку — приложение запросит доступ конкретно к одному файлу.'
        }
    },
    {
        context: 'Вы заходите в приложение Госуслуг для подачи заявления:',
        appIcon: '🏛',
        appName: 'Госуслуги',
        permission: '«Включить <strong>двухфакторную аутентификацию (2FA)</strong> для защиты аккаунта?»',
        correct: 'allow',
        feedback: {
            title: 'Это нужно сделать обязательно!',
            text: 'Это не запрос данных, а <strong>предложение защитить аккаунт</strong>. 2FA — это второй ключ к вашему аккаунту: даже если злоумышленник украдёт пароль, без второго кода с вашего телефона он не войдёт. <strong>Включайте 2FA везде, где можно</strong>: банк, почта, Госуслуги, соцсети.'
        }
    }
];

let currentIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', function() {
    const user = requireUser();
    if (!user) return;
    
    showQuestion();
});

function showQuestion() {
    const q = QUESTIONS[currentIndex];
    
    document.getElementById('context').textContent = q.context;
    document.getElementById('appIcon').textContent = q.appIcon;
    document.getElementById('appName').textContent = q.appName;
    document.getElementById('permissionText').innerHTML = q.permission;
    
    document.getElementById('currentQ').textContent = currentIndex + 1;
    document.getElementById('score').textContent = score;
    document.getElementById('progressBar').style.width = `${((currentIndex + 1) / 5) * 100}%`;
    
    // Сброс UI
    document.getElementById('questionCard').classList.remove('hidden');
    document.getElementById('feedbackCard').classList.add('hidden');
    document.getElementById('nextBtn').classList.add('hidden');
}

function answer(choice) {
    const q = QUESTIONS[currentIndex];
    const isCorrect = (choice === q.correct);
    
    if (isCorrect) score++;
    
    // Скрываем карточку вопроса
    document.getElementById('questionCard').classList.add('hidden');
    
    // Показываем фидбек
    const feedback = document.getElementById('feedbackCard');
    feedback.classList.remove('hidden');
    
    if (isCorrect) {
        feedback.className = 'rounded-xl p-6 border-2 border-green-500 bg-green-900/20 mb-4';
        feedback.innerHTML = `
            <div class="flex items-start gap-4 mb-3">
                <span class="text-4xl">✅</span>
                <div>
                    <h3 class="text-xl font-bold mb-1">Правильно!</h3>
                    <p class="text-green-300 font-semibold">${q.feedback.title}</p>
                </div>
            </div>
            <p class="text-slate-300 leading-relaxed">${q.feedback.text}</p>
        `;
    } else {
        feedback.className = 'rounded-xl p-6 border-2 border-red-500 bg-red-900/20 mb-4';
        feedback.innerHTML = `
            <div class="flex items-start gap-4 mb-3">
                <span class="text-4xl">❌</span>
                <div>
                    <h3 class="text-xl font-bold mb-1">Не лучший выбор</h3>
                    <p class="text-red-300 font-semibold">${q.feedback.title}</p>
                </div>
            </div>
            <p class="text-slate-300 leading-relaxed">${q.feedback.text}</p>
        `;
    }
    
    // Обновляем счётчик
    document.getElementById('score').textContent = score;
    
    // Показываем кнопку "далее"
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.classList.remove('hidden');
    
    if (currentIndex === QUESTIONS.length - 1) {
        nextBtn.textContent = 'Посмотреть результат →';
    } else {
        nextBtn.textContent = 'Следующий вопрос →';
    }
    
    // Прокрутка к фидбеку
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function nextQuestion() {
    currentIndex++;
    
    if (currentIndex >= QUESTIONS.length) {
        finishBlock();
    } else {
        showQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function finishBlock() {
    // Сохраняем результат
    Storage.saveBlock3Score(score);
    Storage.setBlockComplete(3);
    
    // Финальная модалка
    document.getElementById('finalScore').textContent = score;
    
    let emoji = '🎉';
    if (score === 5) emoji = '🏆';
    else if (score >= 3) emoji = '👍';
    else emoji = '💪';
    
    document.getElementById('finalEmoji').textContent = emoji;
    
    const modal = document.getElementById('finishModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
