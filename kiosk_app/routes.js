import express from 'express';
import * as controller from './controllers.js';

const router = express.Router();

/* redirect trailing slashes */
// https://stackoverflow.com/questions/13442377/redirect-all-trailing-slashes-globally-in-express
router.get('\\S+\/$', function (req, res) {
  return res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length));
});


/* Home page */
router.get('/', controller.home);

/* User pages */
router.get('/user', controller.user_detail);
router.get('/users', controller.user_list);
router.get('/users/create', controller.user_create_get);
router.post('/users/create', controller.user_create_post);
router.get('/users/edit', controller.user_edit_get);
router.post('/users/edit', controller.user_create_post);
router.get('/users/delete', controller.user_delete_get);

/* Project Pages */
router.get('/project', controller.project_detail);
router.get('/projects', controller.project_list);
router.get('/projects/create', controller.project_create_get);
router.post('/projects/create', controller.project_create_post);
router.get('/projects/edit', controller.project_edit_get);
router.post('/projects/edit', controller.project_create_post);
// update a project and give feedback
router.get('/projects/update', controller.project_update_get);
router.post('/projects/update', controller.project_update_post);
// close a project and give feedback
router.get('/projects/close', controller.project_close_get);
router.post('/projects/close', controller.project_close_post);
router.get('/projects/delete', controller.project_delete_get);

/* Camera and Media */
router.get('/photo', controller.photo);
router.get('/photos', controller.photos);
router.get('/camera', controller.camera);
router.post('/photo/capture', controller.photo_capture);
router.post('/photo/move', controller.photo_move);
router.post('/photo/set_featured', controller.photo_set_featured);
router.post('/photo/email', controller.photo_email);
router.post('/upload', controller.upload);

/* Admin pages */
router.get('/admin', controller.admin);
router.get('/admin/export_users', controller.export_users);
router.get('/admin/export_projects', controller.export_projects);

/* Privacy Policy */
router.get('/privacy_policy', controller.privacy_policy);

export default router;