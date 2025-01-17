import { Express } from 'express';
import cors from 'cors';
import articlesController from './controllers/articles';
import usersController from './controllers/users';
import packagesController from './controllers/packages';
import authController from './controllers/auth';
import categoriesController from './controllers/categories';
import contactController from './helpers/contact';
import faqController from './controllers/faqs';
import guideController from './controllers/guides';
import articlescategoriesController from './controllers/articlesCategories';
import articlespackagesController from './controllers/articlesPackages';
import packagescategoriesController from './controllers/packagesCategories';

const setupRoutes = (server: Express) => {
  ///// USERS /////
  // GET all users
  server.get('/api/users', usersController.getAllUsers);
  // GET user by id
  server.get(
    '/api/users/:idUser',
    usersController.userExists,
    usersController.getUserById
  );
  // POST user
  server.post(
    '/api/users',
    usersController.validateUser,
    usersController.emailIsFree,
    usersController.addUser
  );
  // PUT user
  server.put(
    '/api/users/:idUser',
    usersController.validateUser,
    usersController.userExists,
    usersController.updateUser
  );
  // DELETE user
  server.delete(
    '/api/users/:idUser',
    usersController.userExists,
    usersController.deleteAllBookmarksByUser,
    usersController.deleteCompletedArticles,
    usersController.deleteAllFollowedPackages,
    usersController.deleteUser
  );

  ///// BOOKMARKS /////
  // POST bookmark by user
  server.post(
    '/api/users/:idUser/bookmarks',
    // authController.getCurrentSession,
    usersController.addBookmarkByUser
  );
  // DELETE bookmark by user and article
  server.delete(
    '/api/users/:idUser/bookmarks/:idArticle',
    // authController.getCurrentSession,
    usersController.deleteBookmarkByUser
  );
  // DELETE all bookmarks by user
  server.delete(
    '/api/users/:idUser/bookmarks',
    // authController.getCurrentSession,
    usersController.deleteAllBookmarksByUser
  );
  // GET bookmark by user and article
  server.get(
    '/api/users/:idUser/bookmarks/:idArticle',
    // authController.getCurrentSession,
    usersController.getBookmarkByUserAndArticle
  );

  // GET bookmarks by user
  server.get(
    '/api/users/:idUser/bookmarks',
    usersController.getBookmarksByUser
  );

  ///// LOGIN /////
  server.post('/api/login', authController.validateLogin, authController.login);

  ///// PASSWORD /////
  // server.post('/api/password', authController.validPassword);

  ///// ARTICLES /////
  // GET articles
  server.get('/api/articles', articlesController.getAllArticles);
  // GET article by id
  server.get(
    '/api/articles/:idArticle',
    // authController.getCurrentSession,
    articlesController.getOneArticle
  );
  // GET articles by user (bookmarks)
  server.get(
    '/api/users/:idUser/articles',
    usersController.userExists,
    // authController.getCurrentSession,
    usersController.getArticlesByUser
  );
  //GET articles by package (articlesPackages)
  server.get(
    '/api/packages/:idPackage/articles',
    packagesController.getArticlesByPackage
  );
  //GET completedArticles by user and packages
  server.get(
    '/api/users/:idUser/packages/:idPackage/completedArticles',
    usersController.userExists,
    // authController.getCurrentSession,
    packagesController.packageExists,
    packagesController.getCompletedArticlesByUserAndPackage
  );

  //GET completedArticles by user and article
  server.get(
    '/api/users/:idUser/completedArticles/:idArticle',
    // authController.getCurrentSession,
    usersController.getCompletedArticlesByUserAndArticle
  );

  //GET completedArticles by user
  server.get(
    '/api/users/:idUser/completedArticles/',
    // authController.getCurrentSession,
    usersController.getCompletedArticlesByUser
  );

  // GET comments by article
  server.get(
    '/api/articles/:idArticle/comments',
    articlesController.getCommentsByArticle
  );

  // POST completed article by user
  server.post(
    '/api/users/:idUser/completedArticles',
    // authController.getCurrentSession,
    usersController.addCompletedArticleByUser
  );

  //POST article
  server.post(
    '/api/articles',
    articlesController.validateArticle,
    articlesController.addArticle
  );
  //PUT article
  server.put(
    '/api/articles/:idArticle',
    articlesController.validateArticle,
    articlesController.articleExists,
    articlesController.updateArticle
  );
  //DELETE article
  server.delete(
    '/api/articles/:idArticle',
    articlesController.articleExists,
    articlesController.deleteArticle
  );

  ///// COMPLETED ARTICLES /////
  //GET completedArticles by user and packages
  server.get(
    '/api/users/:idUser/packages/:idPackage/completedArticles',
    usersController.userExists,
    // authController.getCurrentSession,
    packagesController.packageExists,
    packagesController.getCompletedArticlesByUserAndPackage
  );
  //GET completedArticles by user and article
  server.get(
    '/api/users/:idUser/completedArticles/:idArticle',
    // authController.getCurrentSession,
    usersController.getCompletedArticlesByUserAndArticle
  );
  // POST completed article by user
  server.post(
    '/api/users/:idUser/completedArticles',
    // authController.getCurrentSession,
    usersController.addCompletedArticleByUser
  );

  // DELETE completedArticles by user
  server.delete(
    '/api/users/:idUser/completedArticles',
    // authController.getCurrentSession,
    usersController.deleteCompletedArticles
  );

  ///// PACKAGES /////
  // GET all packages (excluding one user)
  server.get(
    '/api/packages',
    // authController.getCurrentSession,
    packagesController.getAllPackages
  );

  // GET all packages by ID
  server.get(
    '/api/packages/:idPackage',
    // authController.getCurrentSession,
    packagesController.getPackageById
  );

  // GET packages (excluding one user)
  server.get(
    '/api/users/:idUser/packages',
    // authController.getCurrentSession,
    packagesController.getAllPackagesExcludingUser
  );

  // Post one package
  server.post(
    '/api/packages/',
    // authController.getCurrentSession,
    packagesController.addOnePackage
  );

  // POST article by package
  server.post(
    '/api/packages/:idPackage/articles',
    packagesController.packageExists,
    packagesController.articlePackageExists,
    packagesController.addArticleByPackage
  );

     // Put one package
     server.put(
      '/api/packages/:idPackage',
      // authController.getCurrentSession,
      packagesController.updateOnePackage
    );
  
    // Delete one package
    server.delete(
      '/api/packages/:idPackage',
      // authController.getCurrentSession,
      packagesController.deleteOnePackage
    );

  ///// FOLLOWED PACKAGES /////
  // GET followedpackages by User (followedPackages)
  server.get(
    '/api/users/:idUser/followedpackages',
    usersController.userExists,
    usersController.getPackagesByUser
  );
  // GET followedpackages by User AND packages (check)
  server.get(
    '/api/users/:idUser/followedpackages/:idPackage',
    usersController.getFollowedPackagesByUserAndPackage
  );
  // POST followedpackages by User (followedPackages)
  server.post(
    '/api/users/:idUser/followedpackages',
    // packagesController.packageExists,
    packagesController.packageIsNotFollowedByUser,
    usersController.addFollowedPackagesByUser
  );
  // DELETE all followedpackages by user
  server.delete(
    '/api/users/:idUser/followedpackages',
    // authController.getCurrentSession,
    usersController.deleteAllFollowedPackages
  );
  // DELETE followedpackages by user by package
  server.delete(
    '/api/users/:idUser/followedpackages/:idPackage',
    // authController.getCurrentSession,
    packagesController.isPackageFollowedByUser,
    usersController.deleteFollowedPackagesByUser
  );

  ///// CATEGORIES /////
  // GET all categories
  server.get('/api/categories', categoriesController.getAllCategories);
  // GET category by id
  server.get(
    '/api/categories/:idCategory',
    categoriesController.getOneCategory
  );
  // GET categories by package
  server.get(
    '/api/packages/:idPackage/categories',
    packagesController.getCategoriesByPackage
  );
  // GET categories by article
  server.get(
    '/api/articles/:idArticle/categories',
    articlesController.getCategoriesByArticle
  );
  // POST category
  server.post('/api/categories', categoriesController.addCategory);

  // PUT faq
  server.put(
    '/api/categories/:idCategory',
    categoriesController.updateCategory
  );
  // DELETE faq
  server.delete(
    '/api/categories/:idCategory',
    categoriesController.deleteCategory
  );

  // PUT category
  server.put('/api/categories/:idCategory', categoriesController.updateCategory);
  // DELETE category
  server.delete('/api/categories/:idCategory', categoriesController.deleteCategory);


  ///// CONTACT FORM /////
  server.post('/api/contact', cors(), contactController.sendMail);

  ///// FAQ /////
  // GET all faqs
  server.get('/api/faq', faqController.getAllFaqs);
  // GET faq by id
  server.get('/api/faq/:idFaq', faqController.getOneFaq);
  // POST faq
  server.post('/api/faq', faqController.addFaq);
  // PUT faq
  server.put('/api/faq/:idFaq', faqController.updateFaq);
  // DELETE faq
  server.delete('/api/faq/:idFaq', faqController.deleteFaq);

  ///// GUIDE /////
  // GET all guides
  server.get('/api/guide', guideController.getAllGuides);
  // GET guide by id
  server.get('/api/guide/:idGuide', guideController.getOneGuide);
  // POST guide
  server.post('/api/guide', guideController.addGuide);
  // PUT guide
  server.put('/api/guide/:idGuide', guideController.updateGuide);
  // DELETE guide
  server.delete('/api/guide/:idGuide', guideController.deleteGuide);

  ///// COMMENT /////
  // GET all comments
  server.get('/api/comments', usersController.getComment);

  //GET one comment
  server.get('/api/comments/:idComment', usersController.getCommentById);

  // POST comments by user
  server.post('/api/users/:idUser/comments', usersController.addCommentByUser);

  // PUT comment by user
  server.put(
    '/api/users/:idUser/comments/:idComment',
    usersController.updateComment
  );
  
  //DELETE comment
  server.delete('/api/comments/:idComment', usersController.deleteComment);

  ///// ARTICLES CATEGORIES (ONLY FOR REACT ADMIN !) /////
  // GET all ArtCat
  server.get('/api/articlescategories', articlescategoriesController.getAllArtCat);
  // GET ArtCat by id
  server.get('/api/articlescategories/:idArtCat', articlescategoriesController.getOneArtCat);
  // POST ArtCat
  server.post('/api/articlescategories', articlescategoriesController.addArtCat);
  // PUT ArtCat
  server.put('/api/articlescategories/:idArtCat', articlescategoriesController.updateArtCat);
  // DELETE ArtCat
  server.delete('/api/articlescategories/:idArtCat', articlescategoriesController.deleteArtCat);


  ///// ARTICLES PACKAGES (ONLY FOR REACT ADMIN !) /////
  // GET all ArtPack
  server.get('/api/articlespackages', articlespackagesController.getAllArtPack);
  // GET ArtPack by id
  server.get('/api/articlespackages/:idArtPack', articlespackagesController.getOneArtPack);
  // POST ArtPack
  server.post('/api/articlespackages', articlespackagesController.addArtPack);
  // PUT ArtPack
  server.put('/api/articlespackages/:idArtPack', articlespackagesController.updateArtPack);
  // DELETE ArtPack
  server.delete('/api/articlespackages/:idArtPack', articlespackagesController.deleteArtPack);

  ///// PACKAGES CATEGORIES (ONLY FOR REACT ADMIN !) /////
  // GET all PackCat
  server.get('/api/packagescategories', packagescategoriesController.getAllPackCat);
  // GET PackCat by id
  server.get('/api/packagescategories/:idPackCat', packagescategoriesController.getOnePackCat);
  // POST PackCat
  server.post('/api/packagescategories', packagescategoriesController.addPackCat);
  // PUT PackCat
  server.put('/api/packagescategories/:idPackCat', packagescategoriesController.updatePackCat);
  // DELETE PackCat
  server.delete('/api/packagescategories/:idPackCat', packagescategoriesController.deletePackCat);
};

export default setupRoutes;
