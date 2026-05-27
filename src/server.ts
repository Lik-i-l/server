import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

interface Book {
    isbn: string;
    name: string;
    author: string;
    pages: number;
    year: number;
    addedOn: Date;
    isDeleted: boolean;
}

let books: Book[] = [
    { isbn: '978-5-699-12345-6', name: 'Война и мир', author: 'Толстой', pages: 1200, year: 1869, addedOn: new Date(), isDeleted: false },
    { isbn: '978-5-17-118-1234', name: 'Преступление и наказание', author: 'Достоевский', pages: 600, year: 1866, addedOn: new Date(), isDeleted: false },
];

app.get('/api/books', (req, res) => {
    let take = parseInt(req.query.take as string) || 10;
    let page = parseInt(req.query.page as string) || 1;
    let sort = req.query.sort as string || '';
    let filter = req.query.filter as string || '';

    let result = books.filter(b => !b.isDeleted);

    if (filter) {
        result = result.filter(b => 
            b.name.toLowerCase().includes(filter.toLowerCase()) ||
            b.author.toLowerCase().includes(filter.toLowerCase())
        );
    }

    if (sort) {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        result.sort((a, b) => {
            const aVal = a[field as keyof Book];
            const bVal = b[field as keyof Book];
            if (aVal < bVal) return isDesc ? 1 : -1;
            if (aVal > bVal) return isDesc ? -1 : 1;
            return 0;
        });
    }

    const total = result.length;
    const start = (page - 1) * take;
    result = result.slice(start, start + take);

    res.json({ data: result, total, page, take });
});

app.get('/api/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn && !b.isDeleted);
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });
    res.json(book);
});

app.post('/api/books', (req, res) => {
    const { isbn, name, author, pages, year } = req.body;
    if (!isbn || !name || !author) {
        return res.status(400).json({ message: 'ISBN, название и автор обязательны' });
    }
    if (books.find(b => b.isbn === isbn)) {
        return res.status(409).json({ message: 'Книга с таким ISBN уже существует' });
    }
    const newBook: Book = { isbn, name, author, pages: pages || 0, year: year || 0, addedOn: new Date(), isDeleted: false };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.patch('/api/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn && !b.isDeleted);
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });
    const { name, author, pages, year } = req.body;
    if (name) book.name = name;
    if (author) book.author = author;
    if (pages) book.pages = pages;
    if (year) book.year = year;
    res.json(book);
});

app.delete('/api/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn && !b.isDeleted);
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });
    book.isDeleted = true;
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
