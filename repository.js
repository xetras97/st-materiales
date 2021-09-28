const { google } = require('googleapis');
const token = require("./token.json");
const credentials = require("./credentials.json");


const oAuth2Client = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0],
);

oAuth2Client.setCredentials({
    acces_token: token.access_token,
    refresh_token: token.refresh_token,
    scope: token.scope,
    token_type: token.toke_type,
    expiry_date: token.expiry_date,
});


const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

async function read() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '16nrQ187NJdcRmuq8oquMkLGoHpoXqWyEpkFcLbRgLZU',
        range: 'Productos!A2:H',
    });

    const rows = response.data.values;
    const products = rows.map((row) => ({
        id: row[0],
        name: row[1],
        price: +row[2],
        category: row[3],
        stock: +row[4],
        image: row[5],
        description: row[6],
        new: row[7],
    }));

    return products;
};

async function write(products) {
    let values = products.map(p => [p.id, p.name, p.price, p.category, p.stock, p.image, p.description, p.new])

    const resource = {
        values,
    };
    const result = await sheets.spreadsheets.values.update({
        spreadsheetId: '16nrQ187NJdcRmuq8oquMkLGoHpoXqWyEpkFcLbRgLZU',
        range: 'Productos!A2:H',
        valueInputOption: "RAW",
        resource,
    });

    console.log(result.updatedCells);
};

async function readAndWrite() {
    const products = await read();
    products[0].stock = 10;
    await write(products);
};

module.exports = {
    read,
    write,
};

readAndWrite();