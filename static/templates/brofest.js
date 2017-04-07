/**
 * Created by andreivinogradov on 23.03.17.
 */

const fs = require('fs');
const path = require('path');

const playTSrc = fs.readFileSync(path.join(__dirname, '/views/play.js'), 'utf8');
const leadersTSrc = fs.readFileSync(path.join(__dirname, '/views/leaders.js'), 'utf8');
const notFoundTSrc = fs.readFileSync(path.join(__dirname, '/views/404.js'), 'utf8');
const aboutTSrc = fs.readFileSync(path.join(__dirname, '/views/about.js'), 'utf8');
const loginTSrc = fs.readFileSync(path.join(__dirname, '/views/login.js'), 'utf8');
const registerTSrc = fs.readFileSync(path.join(__dirname, '/views/register.js'), 'utf8');
const leadersTablerc = fs.readFileSync(path.join(__dirname, '/views/leadersTable.js'), 'utf8');

const rightCodes = [
  playTSrc,
  leadersTSrc,
  notFoundTSrc,
  aboutTSrc,
  loginTSrc,
  registerTSrc,
  leadersTablerc,
]
  .map(template =>
    new Function(`
      return ${template.substring(template.indexOf('function', 3),
        template.lastIndexOf('}'))}
    `)());

module.exports = rightCodes;
