document.addEventListener('DOMContentLoaded', function() {
    
    // Проверяем, есть ли пользователь
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Имя пользователя
    const firstName = user.name.split(' ')[1] || user.name.split(' ')[0] || 'друг';
    document.getElementById('userName').textContent = firstName;

    // Прогресс
    updateProgress();

    // Обработка кликов по карточкам
    document.querySelectorAll('.block-card').forEach(card => {
        card.addEventListener('click', function() {
            const blockNum = parseInt(this.dataset.block);
            
            if (this.id === 'checklistCard') {
                if (Storage.isChecklistAvailable()) {
                    window.location.href = 'checklist.html';
                } else {
                    showToast('Сначала пройдите все 3 раздела');
                }
                return;
            }
            
            if (Storage.isBlockAvailable(blockNum)) {
                window.location.href = `block-${blockNum}.html`;
            } else {
                showToast('Сначала пройдите предыдущий раздел');
            }
        });
    });

    // Клик по чек-листу
    document.getElementById('checklistCard').addEventListener('click', function() {
        if (Storage.isChecklistAvailable()) {
            window.location.href = 'checklist.html';
        } else {
            showToast('Сначала пройдите все 3 раздела');
        }
    });
});

function updateProgress() {
    const progress = Storage.getProgress();
    const completed = [progress.block1, progress.block2, progress.block3].filter(Boolean).length;
    const percent = Math.round((completed / 3) * 100);
    
    document.getElementById('progressText').textContent = `${completed}/3`;
    document.getElementById('progressBar').style.width = `${percent}%`;

    // Обновляем доступность блоков
    for (let i = 1; i <= 3; i++) {
        const card = document.getElementById(`block${i}`);
        const statusIcon = card.querySelector('.status-icon');
        
        if (progress[`block${i}`]) {
            card.classList.remove('opacity-50');
            card.classList.add('border-green-500');
            statusIcon.textContent = '✅';
        } else if (Storage.isBlockAvailable(i)) {
            card.classList.remove('opacity-50');
            statusIcon.textContent = '';
        }
    }

    // Чек-лист
    if (Storage.isChecklistAvailable()) {
        const checklistCard = document.getElementById('checklistCard');
        checklistCard.classList.remove('opacity-50');
        checklistCard.classList.add('border-yellow-500');
        checklistCard.querySelector('.status-icon').textContent = '🎉';
    }

    // Опрос
    if (Storage.getProgress().poll) {
        document.getElementById('pollStatus').textContent = '✅ Пройдено';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
}
