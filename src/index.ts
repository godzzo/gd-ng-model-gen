
import gsjson = require('google-spreadsheet-to-json');

gsjson({
	spreadsheetId: '1A-CnEIWo4YUtYWqw8QZGkfOJzzw0TBXEL1kll3C9nbE',
	credentials: "credentials/gd-drive-access-a930341b5052.json"
    // other options...
})
.then(function(result: any) {
    console.log(result.length);
    console.log(result);
})
.catch(function(err: any) {
    console.log(err.message);
    console.log(err.stack);
});

export const NgModelGen = (name: string) => 'Hello '+name;
