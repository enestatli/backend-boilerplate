const fs = require('fs');
const path = require('path');
const hogan = require('hogan.js');

const compileTemplate = (template) => {
  const fullPath = path.resolve(
    path.join(process.cwd(), `/email-templates/${template}.hbs`)
  );
  const pre = fs.readFileSync(fullPath, 'utf8');

  return hogan.compile(pre);
};

const renderer = (template, params) => {
  return compileTemplate(template).render(params);
};

module.exports = { renderer };
