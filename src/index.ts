import express from 'express';
import { AppDataSource } from './data-source';
import { Book } from './entity/Book';
import bookRoutes from './routes/bookRoutes';

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/api', bookRoutes);

AppDataSource.initialize().then(async () => {
    console.log('Database connected');
    
    const bookRepository = AppDataSource.getRepository(Book);
    const count = await bookRepository.count();
    
    if (count === 0) {
        const initialBook = new Book();
        initialBook.isbn = "978-5-386-13515-7";
        initialBook.name = "В поисках Аляски";
        initialBook.author = "Джон Грин";
        initialBook.pages = 309;
        initialBook.year = 2019;
        
        await bookRepository.save(initialBook);
        console.log('Initial book added: "В поисках Аляски"');
    }
    
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}).catch(error => {
    console.error('Database connection error:', error);
});