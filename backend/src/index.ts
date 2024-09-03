import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

interface Todo {
    id: number;
    text: string;
    isDone: boolean;
}

const todos: Todo[] = [];

todos.push({
    id: 0,
    text: 'start',
    isDone: false
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

app.get('/get-todos', (req, res) => {
    res.send(todos);
});

app.post('/add-todo', (req, res) => {
    const { text } = req.body;

    todos.push({ id: todos.length, text, isDone: false });

    res.status(201).end();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
