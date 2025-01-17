import IArticle from '../interfaces/IArticle';
import ICompletedArticle from '../interfaces/ICompletedArticle';
import connection from '../db-config';
import { ResultSetHeader } from 'mysql2';

/////// ARTICLES //
// get articles //
const getAllArticles = async (
  titleFilter = '',
  tagFilter = ''
): Promise<IArticle[]> => {
  let sql = `SELECT articles.id, title, idUser, mainImage, mainContent, creationDate, lastUpdateDate FROM articles`;
  const sqlValues: string[] = [];
  if (tagFilter) {
    sql +=
      ' INNER JOIN articlesCategories ON articles.id = articlesCategories.idArticle WHERE articlesCategories.idCategory = ?';
    sqlValues.push(tagFilter);
  }
  if (titleFilter) {
    if (tagFilter) {
      sql += ` AND articles.title LIKE ?`;
    } else {
      sql += ` WHERE title LIKE ?`;
    }
    sqlValues.push(`%${titleFilter}%`);
  }
  const results = await connection.promise().query<IArticle[]>(sql, sqlValues);
  return results[0];
};

// get article by id
const getArticleById = async (idArticle: number): Promise<IArticle> => {
  const [results] = await connection
    .promise()
    .query<IArticle[]>(
      'SELECT id, title, idUser, mainImage, mainContent, creationDate, lastUpdateDate FROM articles WHERE id = ?',
      [idArticle]
    );
  return results[0];
};

// get articles by user
const getArticlesByUser = async (idUser: number): Promise<IArticle[]> => {
  const results = await connection
    .promise()
    .query<IArticle[]>(
      'SELECT a.id, a.title, a.idUser, a.mainImage, a.mainContent, creationDate, lastUpdateDate FROM articles a INNER JOIN bookmarks ON a.id = bookmarks.idArticle WHERE bookmarks.idUser = ?',
      [idUser]
    );
  return results[0];
};

// GET articles by package
const getArticlesByPackage = async (idPackage: number): Promise<IArticle[]> => {
  const results = await connection
    .promise()
    .query<IArticle[]>(
      'SELECT a.id, a.title, a.idUser, a.mainImage, a.mainContent, creationDate, lastUpdateDate FROM articles a INNER JOIN articlesPackages ON a.id = articlesPackages.idArticle WHERE articlesPackages.idPackage = ?',
      [idPackage]
    );
  return results[0];
};

// GET completedArticle by user and article
const getCompletedArticlesByUserAndArticle = async (
  idUser: number,
  idArticle: number
): Promise<ICompletedArticle> => {
  const [results] = await connection
    .promise()
    .query<ICompletedArticle[]>(
      'SELECT * FROM completedArticles WHERE idUser = ? AND idArticle = ?',
      [idUser, idArticle]
    );
  return results[0];
};

// GET completedArticle by user
const getCompletedArticlesByUser = async (
  idUser: number
): Promise<ICompletedArticle[]> => {
  const results = await connection
    .promise()
    .query<ICompletedArticle[]>(
      'SELECT * FROM completedArticles WHERE idUser = ?',
      [idUser]
    );
  return results[0];
};

// GET completedArticles by package
const getCompletedArticlesByUserAndPackage = async (
  idUser: number,
  idPackage: number
): Promise<ICompletedArticle[]> => {
  const results = await connection
    .promise()
    .query<ICompletedArticle[]>(
      'SELECT * FROM completedArticles AS CA INNER JOIN articlesPackages AS AP ON AP.idArticle = CA.idArticle WHERE CA.idUser= ? AND AP.idPackage = ? ',
      [idUser, idPackage]
    );
  return results[0];
};

//POST article
const addArticle = async (article: IArticle): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO articles (title, idUser, mainImage, mainContent, creationDate, lastUpdateDate) VALUES (?,?,?,?,NOW(),NOW())',
      [article.title, article.idUser, article.mainImage, article.mainContent]
    );
  return results[0].insertId;
};

//POST article by package
const addArticleByPackage = async (
  idPackage: number,
  articlePackage: IArticle
) => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO articlesPackages (idPackage, idArticle) VALUES (?,?)',
      [idPackage, articlePackage.idArticle]
    );
  return results[0].insertId;
};

// POST completed article by user and package
const addCompletedArticleByUser = async (
  idUser: number,
  completedArticle: ICompletedArticle
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO completedArticles (idUser, idArticle, rating) VALUES (?, ?, ?)',
      [idUser, completedArticle.idArticle, completedArticle.rating]
    );
  return results[0].insertId;
};

//PUT article
const updateArticle = async (
  idArticle: number,
  article: IArticle
): Promise<boolean> => {
  let sql = 'UPDATE articles SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;
  if (article.title) {
    sql += 'title = ?';
    sqlValues.push(article.title);
    oneValue = true;
  }
  if (article.idUser) {
    sql += oneValue ? ' , idUser = ? ' : ' idUser = ? ';
    sqlValues.push(article.idUser);
    oneValue = true;
  }
  if (article.mainImage) {
    sql += oneValue ? ' , mainImage = ? ' : ' mainImage = ? ';
    sqlValues.push(article.mainImage);
    oneValue = true;
  }
  if (article.mainContent) {
    sql += oneValue ? ' , mainContent = ? ' : ' mainContent = ? ';
    sqlValues.push(article.mainContent);
    oneValue = true;
  }
  if (
    article.title ||
    article.idUser ||
    article.mainImage ||
    article.mainContent
  ) {
    sql += ' , lastUpdateDate = NOW() ';
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idArticle);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

//DELETE article
const deleteArticle = async (idArticle: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM articles WHERE id = ?', [idArticle]);
  return results[0].affectedRows === 1;
};

// DELETE completedArticles by user
const deleteCompletedArticles = async (idUser: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM completedarticles WHERE idUser = ?', [
      idUser,
    ]);
  return results[0].affectedRows >= 0;
};

export default {
  getAllArticles,
  getArticleById,
  getArticlesByUser,
  getArticlesByPackage,
  getCompletedArticlesByUserAndArticle,
  getCompletedArticlesByUserAndPackage,
  getCompletedArticlesByUser,
  addArticle,
  addArticleByPackage,
  addCompletedArticleByUser,
  updateArticle,
  deleteArticle,
  deleteCompletedArticles,
};
