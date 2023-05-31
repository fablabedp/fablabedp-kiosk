import express from 'express';
import * as controller from './controllers.js';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/project', controller.project_detail);
router.get('/projects', controller.project_list);
router.get('/projects/create', controller.project_create_get);
router.post('/projects/create', controller.project_create_post);

export default router;