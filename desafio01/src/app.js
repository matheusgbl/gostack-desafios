const express = require("express");
const { v4: uuid } = require('uuid');
const cors = require("cors");
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateProjectId);

const repositories = [];

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.' })
  }
  return next();
}

app.get("/repositories", (req, res) => {
  const {title}  = req.query;

  const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories

  return res.json(results)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(), 
    title, 
    url, 
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository does not exists.' });
  }

  repositories[repositoryIndex].likes += 1;

  return res.json(repositories[repositoryIndex]);
});

module.exports = app;
