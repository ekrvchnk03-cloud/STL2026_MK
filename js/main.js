// Общие функции для всех страниц

// Проверка авторизации (наличия пользователя)
function requireUser() {
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// Возврат на дашборд
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Универсальный тост
function showToast(message, type = 'info') {
    const colors = {
        info: 'bg-blue-600',
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600'
    };
    
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = `fixed bottom-6 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity ${colors[type]}`;
        document.body.appendChild(toast);
    } else {
        toast.className = `fixed bottom-6 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity ${colors[type]}`;
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 2500);
}
