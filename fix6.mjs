const fs = require('fs');
const p = 'src/components/planetarium/PlanetariumScene.tsx';
let s = fs.readFileSync(p,'utf8');
s = s.replace('<group style={{ position: \"fixed\", inset: 0, zIndex: 0 }}>', '<div style={{ position: \"fixed\", inset: 0, zIndex: 0 }}>');
s = s.replace('</Canvas>', '</Canvas></div>');
fs.writeFileSync(p, s);
console.log('ok');
