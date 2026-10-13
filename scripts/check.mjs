import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
async function walk(dir){const files=[];for(const name of await readdir(dir)){const p=path.join(dir,name);if((await stat(p)).isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
const files=await walk(root);let links=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const text=await readFile(file,'utf8');
 assert.equal((text.match(/<h1\b/g)||[]).length,1,`${file}: expected one h1`);
 assert(!text.includes('sc-camel-view-box'),`${file}: invalid exported SVG attribute`);
 for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
  const target=match[1];if(!target.startsWith('/'))continue;
  const [pathname,fragment]=target.split('#');let dest=path.join(root,pathname);
  if(pathname.endsWith('/'))dest=path.join(dest,'index.html');
  await stat(dest);links++;
  if(fragment){const other=await readFile(dest,'utf8');assert(other.includes(`id="${fragment}"`),`${file}: missing fragment ${target}`);}
 }
}
const icons=JSON.parse(await readFile('src/assets/icons.json','utf8'));
for(const name of ['Sprout','Book','Compass','Owl','WillowTree','Butterfly','SummerSun','Teacup','Seed'])assert(icons[name],`Missing icon: ${name}`);
const content=JSON.parse(await readFile('src/content.json','utf8'));
assert(content.every(e=>!e.description.includes('<')), 'Descriptions contain exported HTML');
console.log(`Verified ${files.filter(f=>f.endsWith('.html')).length} pages, ${links} local links/assets, content, and required icons.`);
