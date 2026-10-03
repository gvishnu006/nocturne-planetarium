const fs = require('fs');
const p = 'C:/Users/ADMIN/planetarium/src/components/planetarium/PlanetariumScene.tsx';
let s = fs.readFileSync(p, 'utf8');
s = s.replace('<div style={{ position: \"fixed\", inset: 0, zIndex: 0 }}>', '<div style={{ position:\"fixed\", inset:0, zIndex:0 }}>');
fs.writeFileSync(p, s);
console.log('ok');
