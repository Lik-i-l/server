import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Book } from '../entity/Book';

export const getBooks = async (req: Request, res: Response) => {
    try {
        const take = req.query.take ? Number(req.query.take) : undefined;
        const page = req.query.page ? Number(req.query.page) : 1;
        const sort = req.query.sort as string || 'id';
        const filter = req.query.filter as string || '';

        const query = AppDataSource.getRepository(Book)
            .createQueryBuilder('book')
            .where('book.isDeleted = false');

        if (filter) {
            query.andWhere('book.name LIKE :filter OR book.author LIKE :filter', 
                { filter: `%${filter}%` });
        }

        if (sort) {
            const order = sort.startsWith('-') ? 'DESC' : 'ASC';
            const field = sort.replace(/^-/, '');
            query.orderBy(`book.${field}`, order);
        }

        if (take) {
            const skip = (page - 1) * take;
            const [books, total] = await query.skip(skip).take(take).getManyAndCount();
            return res.json({ success: true, data: books, total, page, pages: Math.ceil(total / take) });
        }

        const books = await query.getMany();
        res.json({ success: true, data: books, total: books.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createBook = async (req: Request, res: Response) => {
    try {
        const { isbn, name, author, pages, year } = req.body;

        if (!isbn || !name || !author) {
            return res.status(400).json({ success: false, message: 'ISBN, name and author are required' });
        }

        const existingBook = await AppDataSource.getRepository(Book).findOneBy({ isbn });
        if (existingBook) {
            return res.status(409).json({ success: false, message: 'Book with this ISBN already exists' });
        }

        const book = new Book();
        book.isbn = isbn;
        book.name = name;
        book.author = author;
        book.pages = pages;
        book.year = year;

        await AppDataSource.getRepository(Book).save(book);
        res.status(201).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBook = async (req: Request, res: Response) => {
    try {
        const isbn = req.params.isbn as string;
        const book = await AppDataSource.getRepository(Book).findOneBy({ isbn, isDeleted: false });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        res.json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const isbn = req.params.isbn as string;
        const book = await AppDataSource.getRepository(Book).findOneBy({ isbn, isDeleted: false });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        const { name, author, pages, year } = req.body;
        if (name) book.name = name;
        if (author) book.author = author;
        if (pages) book.pages = pages;
        if (year) book.year = year;

        await AppDataSource.getRepository(Book).save(book);
        res.json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const isbn = req.params.isbn as string;
        const book = await AppDataSource.getRepository(Book).findOneBy({ isbn, isDeleted: false });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        book.isDeleted = true;
        await AppDataSource.getRepository(Book).save(book);
        res.json({ success: true, message: 'Book deleted (soft delete)' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBookStatus = async (req: Request, res: Response) => {
    try {
        const isbn = req.params.isbn as string;
        const book = await AppDataSource.getRepository(Book).findOneBy({ isbn, isDeleted: false });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        res.json({ 
            success: true, 
            data: {
                isbn: book.isbn,
                name: book.name,
                available: !book.isDeleted,
                total: 1,
                popularity: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};