/**
 * Created by andreivinogradov on 15.04.17.
 */

const fest = require('fest');
const fs = require('fs');

const xmls = fs.readdirSync('./static/templates/src');

if (!fs.existsSync('./static/templates/views')) {
  fs.mkdirSync('./static/templates/views');
}

xmls.forEach((xml) => {
  if (xml === 'basic.xml') {
    return;
  }
  const fileName = xml.split('.')[0];
  const compiled = fest.compile(`./static/templates/src/${fileName}.xml`, { beautify: false });
  fs.writeFileSync(`./static/templates/views/${fileName}.js`, compiled, 'utf8');
});
