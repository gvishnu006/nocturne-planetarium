import fs from "fs";
import path from "path";
const OUT = path.join(process.cwd(), "public", "data", "stars.json");
const DATA_DIR = path.join(process.cwd(), "public", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const stars = [
  {id:"Sirius", ra:6.752477, dec:-16.716115, mag:-1.46, bv:-0.03},
  {id:"Canopus", ra:6.399195, dec:-52.695660, mag:-0.74, bv:0.15},
  {id:"Vega", ra:18.615606, dec:38.783692, mag:0.03, bv:0.00},
  {id:"Capella", ra:5.278138, dec:45.997992, mag:0.08, bv:0.80},
  {id:"Rigel", ra:5.242297, dec:-8.201640, mag:0.13, bv:-0.03},
  {id:"Betelgeuse", ra:5.919529, dec:7.407063, mag:0.42, bv:1.50},
  {id:"Altair", ra:19.846245, dec:8.868322, mag:0.77, bv:0.22},
  {id:"Arcturus", ra:14.261208, dec:19.182409, mag:-0.05, bv:1.23},
  {id:"Procyon", ra:7.655047, dec:5.224994, mag:0.37, bv:0.42},
  {id:"Spica", ra:13.419885, dec:-11.161322, mag:0.98, bv:-0.23},
  {id:"Antares", ra:16.490129, dec:-26.431944, mag:0.96, bv:1.83},
  {id:"Aldebaran", ra:4.598714, dec:16.509301, mag:0.87, bv:1.54},
  {id:"Pollux", ra:7.754540, dec:28.026200, mag:1.16, bv:0.99},
  {id:"Regulus", ra:10.139617, dec:11.967209, mag:1.36, bv:-0.11},
  {id:"Deneb", ra:20.690532, dec:45.280340, mag:1.25, bv:0.09},
  {id:"Dubhe", ra:11.062215, dec:61.751119, mag:1.81, bv:1.07},
  {id:"Alioth", ra:12.900429, dec:55.959834, mag:1.76, bv:-0.02},
  {id:"Alkaid", ra:13.792329, dec:49.313267, mag:1.85, bv:-0.10},
  {id:"Polaris", ra:2.529047, dec:89.264138, mag:1.97, bv:0.64},
  {id:"Achernar", ra:1.628533, dec:-57.236753, mag:0.46, bv:-0.16},
  {id:"Fomalhaut", ra:22.960848, dec:-29.622222, mag:1.16, bv:0.09},
  {id:"Hadar", ra:14.063722, dec:-60.373028, mag:0.61, bv:-0.23},
  {id:"Peacock", ra:20.427532, dec:-56.735111, mag:1.91, bv:-0.13},
  {id:"Castor", ra:7.576653, dec:31.888276, mag:1.58, bv:0.00},
  {id:"Alnitak", ra:5.679421, dec:-1.942572, mag:1.74, bv:-0.21},
  {id:"Alnilam", ra:5.603558, dec:-1.201951, mag:1.69, bv:-0.19},
  {id:"Mintaka", ra:5.533445, dec:-0.299120, mag:2.25, bv:-0.22},
  {id:"Saiph", ra:5.795420, dec:-9.669629, mag:2.07, bv:-0.18},
  {id:"Merak", ra:11.030678, dec:56.382484, mag:2.34, bv:0.03},
  {id:"Phecda", ra:11.897240, dec:53.694707, mag:2.41, bv:0.00},
  {id:"Megrez", ra:12.257447, dec:57.032626, mag:3.32, bv:0.07},
  {id:"Mizar", ra:13.398746, dec:54.925414, mag:2.23, bv:0.13},
  {id:"Schedar", ra:0.675116, dec:56.537318, mag:2.24, bv:0.42},
  {id:"Caph", ra:0.152983, dec:59.149781, mag:2.28, bv:0.38},
  {id:"GammaCas", ra:0.945122, dec:60.716740, mag:2.39, bv:0.40},
  {id:"Ruchbah", ra:1.430714, dec:60.235283, mag:2.66, bv:0.36},
];
fs.writeFileSync(OUT, JSON.stringify(stars, null, 2));
console.log("done", stars.length);
