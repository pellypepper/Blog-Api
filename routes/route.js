const express = require('express');
const app = express();
const articleRouter = express.Router();

app.use(express.json());

const articles = [
    {
        id: 1,
        title: "We are the world",
        content: "Some content here...",
        author: "Frank Edward",
        date: "2024-01-01",
        tags: ["world", "humanity"]
    },
    {
        id: 2,
        title: "We are the good",
        content: "Some other content...",
        author: "Mike Edward",
        date: "2024-02-15",
        tags: ["good", "hope"]
    },
    {
        id: 3,
        title: "We are amazing",
        content: "Even more content...",
        author: "Frank Jack",
        date: "2024-03-10",
        tags: ["amazing", "inspiration"]
    }
];

// Adjust the routes by removing /articles from each route
articleRouter.get('/', (req, res) => {
    const { date, tag } = req.query;
    let filterArticles = articles;

    if (date) {
        filterArticles = filterArticles.filter((article) => article.date === date);
    }
    if (tag) {
        filterArticles = filterArticles.filter((article) => article.tags.includes(tag));
    }
    res.send(filterArticles);
});

articleRouter.get('/:id', (req, res) => {
    const param = parseInt(req.params.id, 10);
    const currentArticle = articles.find((article) => article.id === param);
    if (currentArticle) {
        res.send(currentArticle);
    } else {
        res.status(404).send({ error: "Article not found" });
    }
});

articleRouter.post('/', (req, res) => {
    const { title, content, author, date, tags } = req.body;
    if (!title) return res.status(400).send({ error: "Missing title" });
    if (!content) return res.status(400).send({ error: "Missing content" });
    if (!author) return res.status(400).send({ error: "Missing author" });
    if (!date) return res.status(400).send({ error: "Missing date" });

    const newArticle = { id: articles.length + 1, title, content, author, date, tags: tags || [] };
    articles.push(newArticle);
    res.status(201).json({ message: "Article created", article: newArticle });
});

articleRouter.delete('/:id', (req, res) => {
    const param = parseInt(req.params.id, 10);
    const index = articles.findIndex((article) => article.id === param);
    if (index !== -1) {
        const deleteArticle = articles.splice(index, 1);
        res.status(200).send({ message: "Article deleted", article: deleteArticle[0] });
    } else {
        res.status(404).send({ error: "Article not found" });
    }
});

articleRouter.put('/:id', (req, res) => {
    const param = parseInt(req.params.id, 10);
    const { title, content, author, date, tags } = req.body;
    const article = articles.find(a => a.id === param);
    if (article) {
        if (title) article.title = title;
        if (author) article.author = author;
        if (content) article.content = content;
        if (date) article.date = date;
        if (tags) article.tags = tags || [];
        res.status(200).send({ message: "Article updated", article: article });
    } else {
        res.status(404).send({ error: "Article not found" });
    }
});

// Use `/articles` as the base route for the articleRouter
app.use('/articles', articleRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
