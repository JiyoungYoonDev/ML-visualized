const fs = require('fs');
const { compile } = require('@mdx-js/mdx');
const p = 'content/chapter1/logistic-regression/introduction.mdx';
const src = fs.readFileSync(p,'utf8').replace(/^---[\s\S]*?---\s*/, '');
compile(src, { jsx: true, format: 'mdx' }).then(()=>console.log('ok')).catch(e=>{console.error('message:', e.message); console.error('line:', e.line, 'col:', e.column); console.error('name:', e.name);});
