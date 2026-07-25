const fs = require('fs');
const path = require('path');

function countStats(dirPath) {
    let totalSize = 0;
    let totalFiles = 0;
    let totalLines = 0;
    
    function walk(dir) {
        let files = [];
        try {
            files = fs.readdirSync(dir);
        } catch (e) {
            return;
        }
        
        for (const file of files) {
            if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
            
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                totalFiles++;
                totalSize += stat.size;
                const content = fs.readFileSync(fullPath, 'utf8');
                totalLines += content.split('\n').length;
            }
        }
    }
    
    walk(dirPath);
    return { files: totalFiles, lines: totalLines, size: totalSize };
}

const client = countStats('client/src');
const server = countStats('server');
const shared = countStats('shared');

console.log(`Client (React): ${client.files} files, ${client.lines} lines, ${(client.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Server (Node.js): ${server.files} files, ${server.lines} lines, ${(server.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Shared (Schema): ${shared.files} files, ${shared.lines} lines, ${(shared.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total TS/TSX: ${client.files + server.files + shared.files} files, ${client.lines + server.lines + shared.lines} lines`);
