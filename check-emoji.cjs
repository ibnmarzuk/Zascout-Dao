const fs = require('fs');
const path = require('path');
const regex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu;
const files = ['views/index.ejs', 'views/mcp.ejs', 'views/quests.ejs', 'server.ts'];
files.forEach(file => {
    if(fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const matches = Array.from(content.matchAll(regex));
        if(matches.length > 0) {
            console.log(file, matches.map(m => m[0]).join(', '));
        }
    }
});
