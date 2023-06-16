const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

const file = fs.createWriteStream("prisma/db.sqlite");
const webUrl = process.env.DATABASE_URL_WEB;
console.log(`Downloading from ${webUrl}`);
const request = http.get(webUrl, function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed");
   });
});