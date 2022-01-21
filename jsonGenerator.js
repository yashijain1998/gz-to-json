const fs       = require('fs');
const zlib     = require('zlib');
const readline = require('readline');


function generateJson() {
    let logJson = [];
    const regexp = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z/;
    let lineReader = readline.createInterface({
        input: fs.createReadStream('log.gz').pipe(zlib.createGunzip())
      });
      
    lineReader.on('line', (currentline) => {
        if (currentline.length !==0) {
            const result = currentline.match(regexp);
            logJson.push({
                "timestamp": new Date(result[0]).getTime(),
                "message": currentline.substring(result[0].length)
            })
        }
      });

    lineReader.on('close', async function () {
      await fs.promises.writeFile('log.json', JSON.stringify(logJson,null,4));
      });
}

(() => {
    generateJson();
  })();
