const fs = require('fs');
const fixCode = fs.readFileSync('C:/Users/ijaza/.gemini/antigravity-ide/brain/d2e2ae89-c37d-4739-b0c2-dc83d78ab357/scratch/fix_jsx.js', 'utf-8');
const newFixCode = fixCode.replace(/const files = \[[\s\S]*?\];/, "const files = ['D:/FreeLancing_Projects/markwiki/app/(site)/page.tsx'];");
fs.writeFileSync('C:/Users/ijaza/.gemini/antigravity-ide/brain/d2e2ae89-c37d-4739-b0c2-dc83d78ab357/scratch/fix_jsx_single.js', newFixCode, 'utf-8');
