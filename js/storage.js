// Универсальный модуль для работы с локальным хранилищем
const Storage = {
    
    // ВАЖНО: данные сохраняются ТОЛЬКО локально, на сервер не уходят
    // Это часть концепции «сайт-пустышка»

    KEYS: {
        USER: 'mk_user',
        PROGRESS: 'mk_progress',
        POLL_VOTE: 'mk_poll_vote',
        BLOCK_3_SCORE: 'mk_block3_score'
    },

    // Сохранение данных пользователя (только в localStorage!)
    saveUser(userData) {
        localStorage.setItem(this.KEYS.USER, JSON.stringify(userData));
    },

    getUser() {
        const data = localStorage.getItem(this.KEYS.USER);
        return data ? JSON.parse(data) : null;
    },

    // Прогресс по блокам
    getProgress() {
        const data = localStorage.getItem(this.KEYS.PROGRESS);
        return data ? JSON.parse(data) : {
            block1: false,
            block2: false,
            block3: false,
            poll: false
        };
    },

    setBlockComplete(blockNum) {
        const progress = this.getProgress();
        progress[`block${blockNum}`] = true;
        localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(progress));
    },

    setPollComplete() {
        const progress = this.getProgress();
        progress.poll = true;
        localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(progress));
    },

    // Доступность блока
    isBlockAvailable(blockNum) {
        const progress = this.getProgress();
        if (blockNum === 1) return true;
        if (blockNum === 2) return progress.block1;
        if (blockNum === 3) return progress.block2;
        return false;
    },

    isChecklistAvailable() {
        const p = this.getProgress();
        return p.block1 && p.block2 && p.block3;
    },

    // Очистка (для тестов / для админки)
    clearAll() {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    },

    // Результат блока 3
    saveBlock3Score(score) {
        localStorage.setItem(this.KEYS.BLOCK_3_SCORE, score);
    },

    getBlock3Score() {
        return parseInt(localStorage.getItem(this.KEYS.BLOCK_3_SCORE)) || 0;
    }
};
