const fs=require('fs');
const p='content/chapter1/logistic-regression/introduction.mdx';
const src=fs.readFileSync(p,'utf8').replace(/^---[\s\S]*?---\s*/,'');
const lines=src.split(/\r?\n/);
for(let i=130;i<=190;i++) console.log(String(i).padStart(4,' ')+': '+(lines[i-1]??''));
