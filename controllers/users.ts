import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import Article from '../models/article';
import User from '../models/user';
import Package from '../models/package';
import Bookmark from '../models/bookmark';
import Comment from '../models/comment';
import Joi from 'joi';
import IUser from '../interfaces/IUser';
import IBookmark from '../interfaces/IBookmark';
import IComment from '../interfaces/IComment';
import ICompletedArticle from '../interfaces/ICompletedArticle';
import IFollowedPackage from '../interfaces/IFollowedPackage';
import bookmark from '../models/bookmark';

// [MIDDLEWARE] Check if user exists
const userExists = (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idUser } = req.params;
    const userExists = await User.getUserById(Number(idUser));
    if (!userExists) {
      next(new ErrorHandler(404, 'This user does not exist'));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// [MIDDLEWARE] User Validation with JOI
const validateUser = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional'; // On créé une variable required qui définit si les données sont requises ou non. Si la méthode est POST, le required devient obligatoire (mais pas si la méthode est PUT).
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    firstName: Joi.string().max(80).presence(required),
    lastName: Joi.string().max(80).presence(required),
    phoneNumber: [Joi.string().max(40).optional(), Joi.allow(null)],
    email: Joi.string().email().max(150).presence(required),
    userPicture: [Joi.string().max(500).optional(), Joi.allow(null)],
    password: Joi.string().min(6).max(50).presence(required),
    idTheme: Joi.number().min(1).max(10).optional(),
    idLanguage: Joi.number().min(1).max(10).optional(),
    isAdmin: Joi.number().min(0).max(1).optional(),
    id: Joi.number().optional(),
    registrationDate: Joi.date().optional(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// [MIDDLEWARE] Check if email is free
const emailIsFree = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body as IUser;
    const emailExists = await User.getUserByEmail(email);
    if (emailExists) {
      next(new ErrorHandler(409, 'Email is already used'));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

//GET all users
const getAllUsers = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.getAllUsers();
    // react admin
    res.setHeader(
      'Content-Range',
      `users : 0-${users.length}/${users.length + 1}`
    );
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET user by ID
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idUser } = req.params;
    const user = await User.getUserById(Number(idUser));
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// GET articles by user (bookmark)
const getArticlesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params; // le params récupéré dans la requête est un string
    const articles = await Article.getArticlesByUser(Number(idUser)); // conversion avec Number du string en number
    return res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

//GET bookmark by user and article
const getBookmarkByUserAndArticle = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser, idArticle } = req.params;
    const bookmark = await Bookmark.getBookmarkByUserAndArticle(
      Number(idUser),
      Number(idArticle)
    );
    return res.status(200).json(bookmark);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET all bookmarks by user
const getBookmarksByUser = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const bookmarks = await bookmark.getAllBookmarksByUser(Number(idUser));
    return res.status(200).json(bookmarks);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

//GET completed by user and article
const getCompletedArticlesByUserAndArticle = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser, idArticle } = req.params;
    const completedArticle = await Article.getCompletedArticlesByUserAndArticle(
      Number(idUser),
      Number(idArticle)
    );
    return res.status(200).json(completedArticle);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

//GET completed by user
const getCompletedArticlesByUser = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const completedArticle = await Article.getCompletedArticlesByUser(
      Number(idUser)
    );
    return res.status(200).json(completedArticle);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET followed by user and packages (followedPackages)
const getFollowedPackagesByUserAndPackage = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser, idPackage } = req.params; // le params récupéré dans la requête est un string
    const packages = await Package.getFollowedPackageByUser(
      Number(idUser),
      Number(idPackage)
    ); // conversion avec Number du string en number
    return res.status(200).json(packages);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET packages by user (followedPackages)
const getPackagesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params; // le params récupéré dans la requête est un string
    const packages = await Package.getPackagesByUserId(Number(idUser)); // conversion avec Number du string en number
    return res.status(200).json(packages);
  } catch (err) {
    next(err);
  }
};

//POST user
const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body as IUser; // On prend le body qu'on met dans une constante user.
    user.id = await User.addUser(user); // Puis on rajoute à cette constante l'id qui vient de l'insertId de la requête.
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

//POST bookmark by user
const addBookmarkByUser = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const bookmark = req.body as IBookmark;
    bookmark.idUser = Number(idUser);
    bookmark.id = await Bookmark.addBookmark(Number(idUser), bookmark);
    res.status(201).json(bookmark);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// POST completed articles by user and package
const addCompletedArticleByUser = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const completedArticle = req.body as ICompletedArticle;
    completedArticle.idUser = Number(idUser);
    completedArticle.id = await Article.addCompletedArticleByUser(
      Number(idUser),
      completedArticle
    );
    res.status(201).json(completedArticle);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// POST followed packages by user
const addFollowedPackagesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const followedPackage = req.body as IFollowedPackage;
    followedPackage.idUser = Number(idUser);
    followedPackage.id = await Package.addFollowedPackagesByUser(
      Number(idUser),
      followedPackage
    );
    res.status(201).json(followedPackage);
  } catch (err) {
    next(err);
  }
};

// DELETE followed packages by user by package
const deleteFollowedPackagesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser, idPackage } = req.params;
    const followedPackageDeleted =
      await Package.deleteFollowedPackageByUserAndPackage(
        Number(idUser),
        Number(idPackage)
      ); //boolean
    followedPackageDeleted ? res.sendStatus(204) : res.sendStatus(500);
  } catch (err) {
    next(err);
  }
};

// GET all comments
const getComment = (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await Comment.getAllComments();
    // react-admin
    res.setHeader(
      'Content-Range',
      `users : 0-${comments.length}/${comments.length + 1}`
    );
    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

//GET comment by id
const getCommentById = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idComment } = req.params;
    const comment = await Comment.getCommentById(Number(idComment));
    comment ? res.status(200).json(comment) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

//POST comment by user
const addCommentByUser = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const comment = req.body as IComment;
    comment.idUser = Number(idUser);
    comment.id = await Comment.addComment(Number(idUser), comment);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// PUT comment
const updateComment = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const { idComment } = req.params;
    const commentUpdated = await Comment.updateCommentByUser(Number(idUser));
    console.log(idComment);
    if (commentUpdated) {
      const comment = await Comment.getCommentByUser();
      res.status(200).send(comment);
    } else {
      throw new ErrorHandler(500, 'Comment cannot be updated');
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// DELETE faq
const deleteComment = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idComment } = req.params;
    const comment = await Comment.getCommentById(Number(idComment));
    const commentDeleted = await Comment.deleteComment(Number(idComment)); //faqDelected => boolean
    if (commentDeleted) {
      res.status(200).send(comment); //needed by react-admin
    } else {
      throw new ErrorHandler(500, 'Comment cannot be deleted');
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

//PUT user
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idUser } = req.params;
    const userUpdated = await User.updateUser(
      Number(idUser),
      req.body as IUser
    ); //userUpdated is a boolean, returned by the model
    if (userUpdated) {
      const user = await User.getUserById(Number(idUser));
      res.status(200).send(user); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, 'User cannot be updated');
    }
  } catch (err) {
    next(err);
  }
};

//DELETE user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idUser } = req.params;
    const user = await User.getUserById(Number(idUser));
    const userDeleted = await User.deleteUser(Number(idUser)); //userDeleted = boolean
    if (userDeleted) {
      res.status(200).send(user); //needed by react-admin
    } else {
      throw new ErrorHandler(500, 'User cannot be deleted');
    }
  } catch (err) {
    next(err);
  }
};

//DELETE bookmark by user
const deleteBookmarkByUser = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser, idArticle } = req.params;
    const bookmarkDeleted = await Bookmark.deleteBookmark(
      Number(idUser),
      Number(idArticle)
    ); //boolean
    bookmarkDeleted ? res.sendStatus(204) : res.sendStatus(500);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// DELETE all bookmarks by user
const deleteAllBookmarksByUser = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const allBookmarksDeleted = await Bookmark.deleteAllBookmarks(
      Number(idUser)
    );

    // boolean
    allBookmarksDeleted ? next() : res.sendStatus(500);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// DELETE completedArticles by user
const deleteCompletedArticles = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const completedArticlesDeleted = await Article.deleteCompletedArticles(
      Number(idUser)
    );

    completedArticlesDeleted ? next() : res.sendStatus(500);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// DELETE followedpackages by user by package
const deleteFollowedPackages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser, idPackage } = req.params;
    const followedPackagesDeleted =
      await Package.deleteFollowedPackageByUserAndPackage(
        Number(idUser),
        Number(idPackage)
      );
    followedPackagesDeleted ? res.sendStatus(204) : res.sendStatus(500);
  } catch (err) {
    next(err);
  }
};

// [MIDDLEWARE] DELETE all followedpackages by user
const deleteAllFollowedPackages = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const allFollowedPackagesDeleted = await Package.deleteAllFollowedPackages(
      Number(idUser)
    );

    allFollowedPackagesDeleted ? next() : res.sendStatus(500);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

export default {
  userExists,
  validateUser,
  emailIsFree,
  getAllUsers,
  getUserById,
  getArticlesByUser,
  getBookmarkByUserAndArticle,
  getBookmarksByUser,
  deleteAllBookmarksByUser,
  getCompletedArticlesByUserAndArticle,
  getCompletedArticlesByUser,
  getPackagesByUser,
  getFollowedPackagesByUserAndPackage,
  addUser,
  getComment,
  addCommentByUser,
  updateComment,
  addBookmarkByUser,
  addCompletedArticleByUser,
  addFollowedPackagesByUser,
  deleteFollowedPackagesByUser,
  updateUser,
  deleteUser,
  deleteBookmarkByUser,
  deleteCompletedArticles,
  deleteFollowedPackages,
  deleteAllFollowedPackages,
  getCommentById,
  deleteComment,
};
