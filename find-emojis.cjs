const fs = require('fs');
const path = require('path');
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/gu;

function searchEmojis(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!['node_modules', '.git'].includes(file)) {
                searchEmojis(fullPath);
            }
        } else if (file.endsWith('.ejs') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(emojiRegex);
            if (matches) {
                console.log(`Found emojis in ${fullPath}:`, Array.from(new Set(matches)).join(' '));
            }
        }
    }
}
searchEmojis(process.cwd());
