const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, '..', 'json');
const filePath1 = path.join(folderPath, 'bars.json');
const filePath2 = path.join(folderPath, 'bars2.json');
const filePath3 = path.join(folderPath, 'barStats.json');
const envPath = path.join(__dirname, '..', '.env');

// Check if folder exists, if not, create it
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// Create data.json with initial content inside the folder
fs.writeFileSync(filePath1, '[]', 'utf8', (err) => {
    if (err) throw err;
    console.log('data.json file has been created inside dataFolder!');
});

fs.writeFileSync(filePath2, '[]', 'utf8', (err) => {
    if (err) throw err;
    console.log('data.json file has been created inside dataFolder!');
});

fs.writeFileSync(filePath3, '[]', 'utf8', (err) => {
    if (err) throw err;
    console.log('data.json file has been created inside dataFolder!');
});


const envContent = 
`ALPACA_KEY_ID="xxx"
ALPACA_SECRET_KEY="xxx"`

// Write the content to a new .env file
fs.writeFile(envPath, envContent, (err) => {
    if (err) {
        console.error('Error writing .env file', err);
    } else {
        console.log('.env file created successfully');
    }
});
