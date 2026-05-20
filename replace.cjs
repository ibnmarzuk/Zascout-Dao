const fs = require('fs');

const path1 = 'views/partials/footer_scripts.ejs';
const content1 = fs.readFileSync(path1, 'utf8');
const newContent1 = content1.replace(/https:\/\/zeroauthoritydao\.com\/favicon\.ico/g, 'https://ui-avatars.com/api/?name=ZA&background=random');
fs.writeFileSync(path1, newContent1);
console.log('Replaced in footer_scripts.ejs');
