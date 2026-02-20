const fs = require('fs');
const { serialize } = require('next-mdx-remote/serialize');
const path = 'content/chapter1/logistic-regression/introduction.mdx';
const src = fs.readFileSync(path, 'utf8');
serialize(src, { parseFrontmatter: true })
  .then(() => console.log('ok'))
  .catch((e) => {
    console.error('message:', e.message);
    console.error('name:', e.name);
    console.error('reason:', e.reason);
    console.error('line/column:', e.line, e.column);
    console.error('stack:', e.stack);
    process.exit(1);
  });
