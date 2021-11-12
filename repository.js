const { google } = require('googleapis');
// const token = require("./token.json");
// const credentials = require("./credentials.json");


// const oAuth2Client = new google.auth.OAuth2(
//     credentials.installed.client_id,
//     credentials.installed.client_secret,
//     credentials.installed.redirect_uris[0],
// );

// oAuth2Client.setCredentials({
//     acces_token: token.access_token,
//     refresh_token: token.refresh_token,
//     scope: token.scope,
//     token_type: token.toke_type,
//     expiry_date: token.expiry_date,
// });

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    process.env.REDIRECTURIS,
);
oAuth2Client.setCredentials({
    acces_token: process.env.ACCESSTOKEN,
    refresh_token: process.env.REFRESHTOKEN,
    scope: process.env.SCOPE,
    token_type: process.env.TOKENTYPE,
    expiry_date: process.env.EXPIRYDATE,
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

async function readEnvios() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '16nrQ187NJdcRmuq8oquMkLGoHpoXqWyEpkFcLbRgLZU',
        range: 'Envios!A2:H',
    });

    const rows = response.data.values;
    const localidades = rows.map((row) => ({
        name: row[0],
        price: +row[1],
    }));

    return localidades;
};

async function readTotalPedidos() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '16nrQ187NJdcRmuq8oquMkLGoHpoXqWyEpkFcLbRgLZU',
        range: 'PEDIDOS!M2',
    });

    const rows = response.data.values;
    const totalPedidos = rows[0];

    return totalPedidos;
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

async function readPedidos() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '16nrQ187NJdcRmuq8oquMkLGoHpoXqWyEpkFcLbRgLZU',
        range: 'PEDIDOS!A3:L',
    });

    const rows = response.data.values;
    if(typeof rows !== 'undefined') {
        const pedidos = rows.map((row) => ({
            numero: +row[0],
            productos: row[1],
            total: +row[2],
            idPago: +row[3],
            estado: row[4],
            nombre: row[5],
            mail: row[6],
            telefono: row[7],
            direccion: row[8],
            localidad: row[9],
            provincia: row[10],
            cp: row[11]
        }));

        return pedidos;
    }   
};

async function writePedidos(pedidos) {
    let values = pedidos.map(p => [p.numero, p.productos, p.total, p.idPago, p.estado, p.nombre, p.mail, p.telefono, p.direccion, p.localidad, p.provincia, p.cp])

    const resource = {
        values,
    };
    const result = await sheets.spreadsheets.values.update({
        spreadsheetId: '16nrQ187NJdcRmuq8oquMkLGoHpoXqWyEpkFcLbRgLZU',
        range: 'PEDIDOS!A3:L',
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
    readEnvios,
    write,
    readPedidos,
    readTotalPedidos,
    // writeTotalPedidos,
    writePedidos,
};
