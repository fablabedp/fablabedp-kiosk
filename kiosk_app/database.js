import loki from 'lokijs';

let projects, users;

const db = new loki('database.json', {
  autoload: true,
  autoloadCallback : databaseInit,
});

function databaseInit() {
  projects = db.getCollection("projects");
  if (!projects) {
    projects = db.addCollection("projects");
  }
  users = db.getCollection("users");
  if (!users) {
    users = db.addCollection("users");
  }
  db.saveDatabase();
  console.log('database initialised with', users.count(), 'users and', projects.count(), 'projects');
}

// flush database on program exit
process.on('SIGINT', function() {
  db.close();
});


export { db as database, projects, users };