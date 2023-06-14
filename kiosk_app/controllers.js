import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { database, projects, users } from './database.js';

import fs from 'fs';
const lang = JSON.parse(fs.readFileSync('./lang.json'));

export const home = asyncHandler(async (req, res, next) => {
  res.render('index', { lang: lang });
});

export const photos = asyncHandler(async (req, res, next) => {
  res.render('photos', { lang: lang });
});

/* ============================= User pages ================================ */


export const user_list = asyncHandler(async (req, res, next) => {
  const user_names = [];
  for (let i = 1; i < users.count(); i++) {
    const get_user = await users.get(i);
    user_names.push({
      'name' : get_user.name,
      'id' : get_user.$loki
    });
  }
  res.render('users', { lang: lang, users: user_names });
});

export const user_detail = asyncHandler(async (req, res, next) => {
  const get_user = await users.get(req.query.id);
  console.log(get_user);
  res.render('user', { lang: lang, user: get_user });
});

export const user_create_get = asyncHandler(async (req, res, next) => {
  res.render('user_create', { lang: lang });
});

export const user_create_post = [

  // Validate and sanitize fields.
  body('name', lang.errors.bad_name ).trim().notEmpty().escape(),
  body('email', lang.errors.bad_email ).trim().isEmail().escape(),
  body('phone', lang.errors.bad_phone ).trim().notEmpty().escape(),
  body('org', lang.errors.bad_org ).trim().notEmpty().escape(),

  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      // There are errors. Render the form again with sanitized values/error messages.
      res.render('user_create', {
        body: req.body,
        errors: errors.array(),
      });
      return;

    } else {

      // Data from form is valid.
      // Check if user with same name already exists.
      const existing_user = await users.findOne({ name: req.body.name });

      if (existing_user) {
        // user exists, redirect to its detail page.
        console.log('user already exists');
        res.render('user_create', {
          lang: lang,
          body: req.body,
          errors: [{msg: lang.errors.user_exists}],
        });
      } else {
        users.insert({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          org: req.body.org,
        });
        // New user saved. Redirect to user detail page.
        res.redirect('../user?id=' + users.count()); // redirect to most recent user
        await database.saveDatabase();
        console.log('new user added');
        console.log("num users: ", users.count());
      }
    }
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
  const project_names = [];
  for (let i = 1; i < projects.count(); i++) {
    const get_project = await projects.get(i);
    project_names.push({
      'name' : get_project.name,
      'id' : get_project.$loki
    });
  }
  res.render('projects', { lang: lang, projects: project_names });
});

export const project_detail = asyncHandler(async (req, res, next) => {
  const get_project = await projects.get(req.query.id);
  console.log(get_project);
  res.render('project', { lang: lang, project: get_project });
});

export const project_create_get = asyncHandler(async (req, res, next) => {
  const user_list = await users.find({ 'name' : { '$ne' : null }});
  res.render('project_create', { lang: lang, users: user_list });
});

export const project_create_post = [

  // Validate and sanitize the name field.
  body('name', 'project name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Get list of registered users
    const user_list = await users.find({ 'name' : { '$ne' : null }});

    if (!errors.isEmpty()) {

      // There are errors. Render the form again with sanitized values/error messages.
      res.render('project_create', {
        lang: lang,
        body: req.body,
        users: user_list,
        errors: errors.array(),
      });
      return;

    } else {

      // Data from form is valid.
      // Check if project with same name already exists.
      const existing_project = await projects.findOne({ name: req.body.name });

      if (existing_project) {
        // project exists, redirect to its detail page.
        console.log('project already exists');
        res.render('project_create', {
          lang: lang,
          body: req.body,
          users: user_list,
          errors: [{msg: lang.errors.project_exists}],
        });
      } else {

        // if checkbox lists have only one item selected, make sure these are converted into arrays
        let tools = Array.isArray(req.body.tools) ? req.body.tools : [req.body.tools];
        let materials = Array.isArray(req.body.materials) ? req.body.materials : [req.body.materials];

        projects.insert({
          name: req.body.name,
          user: req.body.user,
          date_start: req.body.date_start,
          description: req.body.description,
          tools: tools,
          tools_other: req.body.tools_other,
          materials: materials,
          materials_other: req.body.materials_other,
        });
        // New project saved. Redirect to project detail page.
        res.redirect('../project?id=' + projects.count()); // redirect to most recent project
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
