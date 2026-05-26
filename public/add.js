const API = '/api/books';
const form = document.getElementById('add-form');
const messageDiv = document.getElementById('message');

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const book = {
        isbn: document.getElementById('isbn').value.trim(),
        name: document.getElementById('name').value.trim(),
        author: document.getElementById('author').value.trim(),
        pages: parseInt(document.getElementById('pages').value) || undefined,
        year: parseInt(document.getElementById('year').value) || undefined,
    };

    if (!book.isbn || !book.name || !book.author) {
        showMessage('Заполните все обязательные поля', 'error');
        return;
    }

    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        const data = await res.json();
        
        if (data.success) {
            showMessage('Книга успешно добавлена!', 'success');
            form.reset();
            setTimeout(() => window.location.href = '/', 1000);
        } else {
            showMessage(data.message || 'Ошибка добавления', 'error');
        }
    } catch (error) {
        showMessage('Ошибка сервера', 'error');
    }
});

function showMessage(msg, type) {
    if (messageDiv) {
        messageDiv.innerHTML = `<div class="${type}">${msg}</div>`;
    }
}