import { execSync } from 'child_process';
import fs from 'fs';

// Create project directory
fs.mkdirSync('vbank-backend', { recursive: true });
process.chdir('vbank-backend');

// Initialize package.json
execSync('npm init -y');

// Install dependencies
execSync('npm install express mysql2 dotenv');
execSync('npm install --save-dev nodemon');

// Create necessary files
fs.writeFileSync('.env', 'DB_HOST=localhost\nDB_USER=root\nDB_PASSWORD=your_password\nDB_NAME=vbank\nPORT=3000');
fs.writeFileSync('server.js', '');
fs.writeFileSync('db.js', '');

console.log('Project setup completed successfully!');