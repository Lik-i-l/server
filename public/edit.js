const API = '/api/books';
const urlParams = new URLSearchParams(window.location.search);
const isbn = urlParams.get('isbn');

const form = document.getElementById('edit-form');
const messageDiv = document.getElementById('message');

if (!isbn) {
    window.location.href = '/';
}

async function loadBook() {
    try {
        const res = await fetch(`${API}/${isbn}`);
        const data = await res.json();
        
        if (data.success) {
            document.getElementById('isbn').value = data.data.isbn;
            document.getElementById('name').value = data.data.name;
            document.getElementById('author').value = data.data.author;
            document.getElementById('pages').value = data.data.pages || '';
            document.getElementById('year').value = data.data.year || '';
        } else {
            showMessage('Книга не найдена', 'error');
        }
    } catch {
        showMessage('Ошибка загрузки', 'error');
    }
}

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const updated = {
        name: document.getElementById('name').value.trim(),
        author: document.getElementById('author').value.trim(),
        pages: parseInt(document.getElementById('pages').value) || undefined,
        year: parseInt(document.getElementById('year').value) || undefined,
    };

    if (!updated.name || !updated.author) {
        showMessage('Название и автор обязательны', 'error');
        return;
    }

    try {
        const res = await fetch(`${API}/${isbn}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        const data = await res.json();
        
        if (data.success) {
            showMessage('Книга успешно обновлена!', 'success');
            setTimeout(() => window.location.href = '/', 1000);
        } else {
            showMessage(data.message || 'Ошибка обновления', 'error');
        }
    } catch {
        showMessage('Ошибка сервера', 'error');
    }
});

function showMessage(msg, type) {
    if (messageDiv) {
        messageDiv.innerHTML = `<div class="${type}">${msg}</div>`;
    }
}

loadBook();