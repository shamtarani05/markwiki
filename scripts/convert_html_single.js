const fs = require('fs');
const code = fs.readFileSync('C:/Users/ijaza/.gemini/antigravity-ide/brain/d2e2ae89-c37d-4739-b0c2-dc83d78ab357/scratch/convert_html.js', 'utf-8');
const newCode = code.replace(/const pages = \[[\s\S]*?\];/, "const pages = [['marcwiki_the_living_archive', 'page.tsx']];");
fs.writeFileSync('C:/Users/ijaza/.gemini/antigravity-ide/brain/d2e2ae89-c37d-4739-b0c2-dc83d78ab357/scratch/convert_html_single.js', newCode, 'utf-8');
