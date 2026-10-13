import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try {
  let name=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!name.startsWith(root+path.sep)&&name!==root)throw Error('Invalid path');
  if((await stat(name)).isDirectory())name=path.join(name,'index.html');
  res.setHeader('Content-Type',types[path.extname(name)]||'application/octet-stream');res.end(await readFile(name));
 }catch{res.writeHead(404,{'Content-Type':'text/html'});res.end(await readFile(path.join(root,'404.html')));}
});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log(`Mind Garden: http://localhost:${server.address().port}`));
