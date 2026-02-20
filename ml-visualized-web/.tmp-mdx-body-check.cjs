const fs = require('fs');
const { compile } = require('@mdx-js/mdx');
const path = 'content/chapter1/logistic-regression/introduction.mdx';
const src = fs.readFileSync(path, 'utf8');
const body = src.replace(/^---[\s\S]*?---\s*/,'');
compile(body, { jsx: true, format: 'mdx' })
  .then(() => console.log('ok'))
  .catch((e) => {
    console.error('message:', e.message);
    console.error('name:', e.name);
    console.error('reason:', e.reason);
    console.error('line/column:', e.line, e.column);
    process.exit(1);
  });
