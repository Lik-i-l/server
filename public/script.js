const API = '/api/books';
let currentPage = 1;
const take = 10;

async function loadBooks() {
    const filter = document.getElementById('filter')?.value || '';
    const url = `${API}?take=${take}&page=${currentPage}&sort=-id&filter=${encodeURIComponent(filter)}`;
    
    try {
        const res = await fetch(url);
        const { success, data, total, pages } = await res.json();
        
        if (!success) {
            console.error('Ошибка загрузки');
            return;
        }

        const tbody = document.getElementById('books-list');
        if (!tbody) return;

        tbody.innerHTML = data.map(book => `
            <tr>
                <td>${escapeHtml(book.isbn)}</td>
                <td>${escapeHtml(book.name)}</td>
                <td>${escapeHtml(book.author)}</td>
                <td>${book.pages || '-'}</td>
                <td>${book.year || '-'}</td>
                <td class="actions-cell">
                    <a href="/edit.html?isbn=${encodeURIComponent(book.isbn)}" class="btn btn-edit">✏️</a>
                    <button class="btn btn-delete" onclick="deleteBook('${escapeHtml(book.isbn)}')">🗑️</button>
                </td>
            </tr>
        `).join('');

        const pagination = document.getElementById('pagination');
        if (pagination && pages > 1) {
            let btns = '';
            for (let i = 1; i <= pages; i++) {
                btns += `<button class="btn" style="margin:2px" onclick="goToPage(${i})">${i}</button>`;
            }
            pagination.innerHTML = btns;
        } else if (pagination) {
            pagination.innerHTML = '';
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function goToPage(page) {
    currentPage = page;
    loadBooks();
}

async function deleteBook(isbn) {
    if (!confirm('Удалить эту книгу?')) return;
    
    try {
        const res = await fetch(`${API}/${isbn}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            loadBooks();
        } else {
            alert('Ошибка удаления: ' + (data.message || 'Неизвестная ошибка'));
        }
    } catch {
        alert('Ошибка сервера');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

if (document.getElementById('books-list')) {
    loadBooks();
    const filterInput = document.getElementById('filter');
    if (filterInput) {
        filterInput.addEventListener('input', () => {
            currentPage = 1;
            loadBooks();
        });
    }
}