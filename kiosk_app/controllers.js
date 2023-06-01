import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { database, projects, users } from './database.js';



/* ============================= User pages ================================ */


export const user_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: User list');
});

export const user_detail = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: User detail');
});

export const user_create_get = asyncHandler(async (req, res, next) => {
  res.render('user_create');
});

export const user_create_post = [
  asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: New user confirmed');
  }),
];

export const user_edit_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Edit user form');
});

export const user_edit_post = [
  asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Edit user confirmed');
  }),
];



/* =========================== Project pages =============================== */

export const project_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Project list');
});

export const project_detail = asyncHandler(async (req, res, next) => {
  const get_project = await projects.get(req.query.id);
  res.render('project', { project: get_project });
});

export const project_create_get = asyncHandler(async (req, res, next) => {
  res.render('project_create');
});

export const project_create_post = [

  // Validate and sanitize the name field.
  body('project_name', 'project name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      // There are errors. Render the form again with sanitized values/error messages.
      res.render('project_create', {
        body: req.body,
        errors: errors.array(),
      });
      return;

    } else {

      // Data from form is valid.
      // Check if project with same name already exists.
      const existing_project = await projects.findOne({ name: req.body.project_name });

      if (existing_project) {
        // project exists, redirect to its detail page.
        console.log('project with this name already exists');
        res.render('project_create', {
          body: req.body,
          errors: [{msg: 'A project with this name already exists.'}],
        });
      } else {
        projects.insert({ name: req.body.project_name });
        // New project saved. Redirect to project detail page.
        const new_project = await projects.findOne({ name: req.body.project_name });
        res.render('project', { project: new_project });
        await database.saveDatabase();
        console.log('new project added');
        console.log("num projects: ", projects.count());
      }
    }
  }),
];


export const project_edit_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Edit project form');
});

export const project_edit_post = [
  asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Edit project confirmed');
  }),
];

export const project_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Update project form');
});

export const project_update_post = [
  asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Update project confirmed');
  }),
];

export const project_close_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Close project form');
});

export const project_close_post = [
  asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Close project confirmed');
  }),
];

export const project_photos = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: project photos page');
});
