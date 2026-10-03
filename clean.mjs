const fs = require('fs');
const p = 'src/components/planetarium/PlanetariumScene.tsx';
let s = fs.readFileSync(p,'utf8');
s = s.split('<group style={{ position: \"fixed\", inset: 0, zIndex: 0 }}>').join('<div style={{ position: \"fixed\", inset: 0, zIndex: 0 }}>');
s = s.split('</Canvas>').join('</Canvas></div>');
fs.writeFileSync(p, s);
console.log('ok');
