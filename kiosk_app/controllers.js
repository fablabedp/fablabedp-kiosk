import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { database, projects, users } from './database.js';
import filenamify from 'filenamify';

import fs from 'fs';
import path from 'path';
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
  const user_array = await users.find({ 'name' : { '$ne' : null }});
  user_array.forEach((user) => {
    user_names.push({
        'name' : user.name,
        'id' : user.$loki
      });
  });

  let msg;
  switch (req.query.msg) {
    case 'delete':
      msg = lang.home.deleted_user + req.query.user_name;
      break;
  }

  res.render('users', { lang: lang, users: user_names, msg: msg });
});

export const user_detail = asyncHandler(async (req, res, next) => {
  const get_user = await users.get(req.query.id);
  console.log(get_user);
  res.render('user', { lang: lang, user: get_user });
});

export const user_create_get = asyncHandler(async (req, res, next) => {
  res.render('user_create', { lang: lang, new_user: 'true' });
});

export const user_edit_get = asyncHandler(async (req, res, next) => {
  const get_user = await users.get(req.query.id);
  console.log(get_user);
  req.body.name  = get_user.name;
  req.body.email = get_user.email;
  req.body.phone = get_user.phone;
  req.body.org   = get_user.org;
  res.render('user_create', { lang: lang, new_user: 'false', user: get_user, body: req.body });
});


export const user_create_post = [

  // Validate and sanitize fields.
  body('name', lang.errors.bad_name ).trim().notEmpty().escape(),
  body('email', lang.errors.bad_email ).trim().isEmail().escape(),
  body('phone', lang.errors.bad_phone ).trim().notEmpty().escape().isNumeric(),
  body('org', lang.errors.bad_org ).trim().notEmpty().escape(),

  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      // There are errors. Render the form again with sanitized values/error messages.
      res.render('user_create', {
        lang: lang,
        body: req.body,
        new_user: req.body.new_user,
        errors: errors.array(),
      });
      return;

    } else {


      const user_list = await users.find({ 'name' : { '$ne' : null }});
      console.log(user_list);

      // Data from form is valid.
      // Check if user with same name already exists.
      let existing_user = await users.findOne({ name: req.body.name });

      if (existing_user && req.body.new_user == 'true') {
        // user exists, redirect to its detail page.
        console.log('user already exists');
        res.render('user_create', {
          lang: lang,
          body: req.body,
          new_user: req.body.new_user,
          errors: [{msg: lang.errors.user_exists}],
        });

      } else {

        // create a new user if needed, otherwise get id of exisiting user
        let id = -1;
        if(req.body.new_user == 'true') {
          console.log('creating new user');
          users.insert({name: req.body.name});
          existing_user = await users.findOne({name: req.body.name});
          id = existing_user.$loki;
        } else {
          console.log('editing existing user');
          id = existing_user.$loki;
        }

        existing_user.name  = req.body.name;
        existing_user.email = req.body.email;
        existing_user.phone = req.body.phone;
        existing_user.org   = req.body.org;
        users.update(existing_user);

        // New user saved. Redirect to user detail page.
        res.redirect('../user?id=' + id);
        await database.saveDatabase();
        console.log('new user added');
        console.log("num users: ", users.count());
      }
    }
  }),
];


export const user_delete_get = asyncHandler(async (req, res, next) => {
  const user = await users.get(req.query.id);
  console.log('removing user ' + user.$loki + ': ' + user.name);
  let name = user.name;
  users.remove(user.$loki);
  res.redirect("/users?msg=delete&user_name=" + name);
  await database.saveDatabase();
});



/* =========================== Project pages =============================== */

export const project_list = asyncHandler(async (req, res, next) => {
  let project_names = [];

  const project_array = await projects.find({ 'name' : { '$ne' : null }});
  project_array.forEach((project) => {
    project_names.push({
        'name' : project.name,
        'active' : project.active,
        'date_start' : project.date_start,
        'id' : project.$loki
      });
  });

  let msg;
  switch (req.query.msg) {
    case 'delete':
      msg = lang.home.deleted_project + req.query.project_name;
      break;
  }
  // Sorting projects not working yet...
  // project_names = project_names.sort((a,b) => {
  //   return new Date(b.date_start) - new Date(a.date_start);
  // });
  res.render('projects', { lang: lang, projects: project_names, msg: msg });
});

export const project_detail = asyncHandler(async (req, res, next) => {
  const get_project = await projects.get(req.query.id);
  console.log(get_project);

  const media_dir = './public/media/' + get_project.media_dir;

  let msg;
  switch (req.query.msg) {
    case 'upload_success':
      msg = lang.projects.upload_success;
      break;
  }

  fs.readdir(media_dir, (err, files) => {
    res.render('project', { lang: lang, project: get_project, media: files, msg: msg});
  });
});

export const project_create_get = asyncHandler(async (req, res, next) => {
  const user_list = await users.find({ 'name' : { '$ne' : null }});
  req.body.team = [];
  res.render('project_create', { lang: lang, users: user_list, new_project: 'true' });
});

export const project_edit_get = asyncHandler(async (req, res, next) => {
  const user_list = await users.find({ 'name' : { '$ne' : null }});
  const get_project = await projects.get(req.query.id);
  console.log(get_project);
  req.body.name = get_project.name;
  req.body.team = [];
  get_project.team.forEach((member) => {
      req.body.team.push(JSON.stringify(member));
  });
  req.body.date_start  = get_project.date_start;
  req.body.description = get_project.description;
  req.body.tools = [];
  get_project.tools.forEach((tool) => {
      req.body.tools.push(JSON.stringify(tool));
  });
  req.body.tools_other     = get_project.tools_other;
  req.body.materials       = get_project.materials;
  req.body.materials_other = get_project.materials_other;
  res.render('project_create', { lang: lang, users: user_list, new_project: 'false', project: get_project, body: req.body});
});

export const project_create_post = [

  // Validate and sanitize the name field.
  body('name', lang.errors.short_name )
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Check there are team members
  body('team', lang.errors.empty_team )
    .notEmpty(),

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
        new_project: req.body.new_project,
        errors: errors.array(),
      });
      return;

    } else {

      // Data from form is valid.
      // Check if project with same name already exists.
      let existing_project = await projects.findOne({ name: req.body.name });

      // If this is supposed to be a new project, show error that a project with this name already exists
      if (existing_project && req.body.new_project == 'true') {
        console.log('project already exists');
        res.render('project_create', {
          lang: lang,
          body: req.body,
          users: user_list,
          new_project: req.body.new_project,
          errors: [{msg: lang.errors.project_exists}],
        });

      } else {

        // create a new project if needed, otherwise get id of exisiting project
        let id = -1;
        if(req.body.new_project == 'true') {
          projects.insert({name: req.body.name, active: true});
          existing_project = await projects.findOne({name: req.body.name});
          id = existing_project.$loki;
        } else {
          existing_project = await projects.get(req.body.id);
          id = existing_project.$loki;
        }

        // if team and checkbox lists have only one entry, make sure these are converted into arrays
        let team = Array.isArray(req.body.team) ? req.body.team : [req.body.team];
        let tools = Array.isArray(req.body.tools) ? req.body.tools : [req.body.tools];
        let materials = Array.isArray(req.body.materials) ? req.body.materials : [req.body.materials];

        // if there are no tools or materials selected, initialise the arrays
        if (req.body.tools === undefined) {
          tools = [];
        }
        if (req.body.materials === undefined) {
          materials = [];
        }

        existing_project.name = req.body.name;
        existing_project.team = [];
        team.forEach((member) => {
          existing_project.team.push(JSON.parse(member));
        });
        existing_project.date_start  = req.body.date_start;
        existing_project.description = req.body.description;

        // media dir
        let new_media_dir =
          req.body.date_start.slice(-4) + '_'
          + filenamify(req.body.name, {replacement: '-'})
          .replaceAll(' ', '-');

        if(req.body.new_project == 'true') {
          // create new media dir if new project
          existing_project.media_dir = new_media_dir;
          fs.mkdir(new_media_dir, (err) => {
            if (err) {
              return console.error(err);
            }
            console.log('Media directory created successfully');
          });
        } else {
          // rename existing media dir
          try {
            fs.renameSync(
              path.join('./public/media/',existing_project.media_dir),
              path.join('./public/media/',new_media_dir)
              );
            existing_project.media_dir = new_media_dir;
            console.log('Media directory renamed successfully');
          } catch(err) {
            console.log(err);
          }
        }

        existing_project.tools = [];
        tools.forEach((tool) => {
          existing_project.tools.push(JSON.parse(tool));
        });
        // console.log(existing_project.tools);
        existing_project.tools_other     = req.body.tools_other;
        existing_project.materials       = materials;
        existing_project.materials_other = req.body.materials_other;
        projects.update(existing_project);

        // project saved. Redirect to project detail page.
        res.redirect('../project?id=' + id);
        await database.saveDatabase();

        if(req.body.new_project == 'true') {
          console.log('added new project:', id);
          console.log(existing_project);
        } else {
          console.log('updated project:', id);
        }
        console.log("num projects: ", projects.count());

      }
    }
  }),
];

export const project_update_get = asyncHandler(async (req, res, next) => {
  const get_project = await projects.get(req.query.id);
  console.log(get_project);
  req.body.name = get_project.name;
  res.render('project_update', { lang: lang, project: get_project, body: req.body});
});

export const project_update_post = [

  // Check there is a rating > 0
  body('log_rating', lang.errors.no_rating )
    .if(body('log_msg').notEmpty())
    .isInt({ min: 1 }),

  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request. (currently no validation is needed)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      const get_project = await projects.get(req.query.id);
      console.log(get_project);
      req.body.name = get_project.name;

      // There are errors. Render the form again with sanitized values/error messages.
      res.render('project_update', {
        lang: lang,
        project: get_project,
        body: req.body,
        errors: errors.array(),
      });
      return;

    } else {

      // Data from form is valid.
      // get existing project
      let existing_project = await projects.findOne({ name: req.body.name });

      let id = existing_project.$loki;

      // Check if there is a new log to add
      if(req.body.log_rating > 0) {

        // Check if there is any existing log for the project
        if(!existing_project.log) {
          existing_project.log = [];
        }

        // Add log to project
        existing_project.log.push({
          'date': req.body.date,
          'rating': req.body.log_rating,
          'msg': req.body.log_msg
        });

      }

      // Update hours
      existing_project.team.forEach((member) => {
        member.hours += Number(req.body[member.name]);
      });
      existing_project.tools.forEach((tool) => {
        tool.hours += Number(req.body[tool.alias]);
      });

      // Save project and redirect to project detail page.
      res.redirect('../project?id=' + id);
      await database.saveDatabase();

      console.log('updated project:', id);

    }
  }),
];

export const project_close_get = asyncHandler(async (req, res, next) => {
  const get_project = await projects.get(req.query.id);
  console.log(get_project);
  req.body.name = get_project.name;
  res.render('project_close', { lang: lang, project: get_project, body: req.body});
});

export const project_close_post = [

  // Check there is a rating > 0
  body('evaluation_rating', lang.errors.no_rating )
    .isInt({ min: 1 }),

  // Check there is feedback
  body('evaluation_msg', lang.errors.no_evaluation_msg )
    .notEmpty(),

  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request. (currently no validation is needed)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      const get_project = await projects.get(req.query.id);
      console.log(get_project);
      req.body.name = get_project.name;

      // There are errors. Render the form again with sanitized values/error messages.
      res.render('project_close', {
        lang: lang,
        project: get_project,
        body: req.body,
        errors: errors.array(),
      });
      return;

    } else {

      // Data from form is valid.
      // get existing project
      let existing_project = await projects.findOne({ name: req.body.name });

      let id = existing_project.$loki;

      // Check if there is any existing log for the project
      if(!existing_project.log) {
        existing_project.log = [];
      }

      // close the project
      existing_project.active = false;
      existing_project.date_end = req.body.date;

      // Add evaluation to project
      existing_project.evaluation = {
        'rating': req.body.evaluation_rating,
        'msg': req.body.evaluation_msg
      };

      // Save project and redirect to project detail page.
      res.redirect('../project?id=' + id);
      await database.saveDatabase();

      console.log('closed project:', id);

    }
  }),
];

export const project_delete_get = asyncHandler(async (req, res, next) => {
  const project = await projects.get(req.query.id);
  console.log('removing project ' + project.$loki + ': ' + project.name);
  let name = project.name;
  projects.remove(project.$loki);
  res.redirect("/projects?msg=delete&project_name=" + name);
  await database.saveDatabase();
});

export const project_photos = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: project photos page');
});



// ---------------------------------------------------------------------------------- //



export const photo_upload = [
  asyncHandler(async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }

    const upload_media = req.files.upload_media;
    const upload_path = './public/media/' + req.body.media_dir + '/' + upload_media.name;

    upload_media.mv(upload_path, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('./project?id=' + req.body.id + '&msg=upload_success');
    });
  }),
];