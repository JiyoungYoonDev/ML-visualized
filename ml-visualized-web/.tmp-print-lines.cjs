const fs=require('fs');
const p='content/chapter1/logistic-regression/introduction.mdx';
const src=fs.readFileSync(p,'utf8').replace(/^---[\s\S]*?---\s*/,'');
const lines=src.split(/\r?\n/);
for(let i=295;i<=310;i++){
  const text=lines[i-1] ?? '';
  console.log(String(i).padStart(4,' ')+': '+text);
}
