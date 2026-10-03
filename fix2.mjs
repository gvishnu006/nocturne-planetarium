const fs = require('fs');
const p = 'C:/Users/ADMIN/planetarium/src/components/planetarium/PlanetariumScene.tsx';
let s = fs.readFileSync(p, 'utf8');
// remove any group tags
s = s.replace(/<group[^>]*>/g, '');
s = s.replace(/<\/group>/g, '');
fs.writeFileSync(p, s);
console.log('ok');
