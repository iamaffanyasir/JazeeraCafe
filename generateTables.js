const fs = require('fs');

// Read template files
const htmlTemplate = fs.readFileSync('table1.html', 'utf8');
const jsTemplate = fs.readFileSync('table1.js', 'utf8');

// Generate files for tables 3-12
for (let i = 3; i <= 12; i++) {
    // Generate HTML file
    const newHtml = htmlTemplate
        .replace(/Table 1/g, `Table ${i}`)
        .replace('table1.js', `table${i}.js`);
    
    fs.writeFileSync(`table${i}.html`, newHtml);

    // Generate JS file
    const newJs = jsTemplate
        .replace('const TABLE_NUMBER = 1', `const TABLE_NUMBER = ${i}`)
        .replace(/tableOrders\[1\]/g, `tableOrders[${i}]`)
        .replace(/tableNumber: 1/g, `tableNumber: ${i}`);
    
    fs.writeFileSync(`table${i}.js`, newJs);
}

console.log('Generated files for tables 3-12'); 