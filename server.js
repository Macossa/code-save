
// server.js
const express = require('express');
const cors = require('cors');
const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
    origin: 'https://benamour.fr',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

app.post('/save', async (req, res) => {
    const result = req.body.result;
    console.log('Requ�te re�ue avec succ�s:', result);
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: 'ftp1.neodomaine.com',
            user: 'benamour.fr',
            password: 'HWWGKSM2',
            port: 21,
            secure: false,
            secureOptions: { rejectUnauthorized: false }
        });
        console.log('Connexion FTP r�ussie');

        const filePath = path.join(__dirname, 'analysis_result.txt');
        fs.writeFileSync(filePath, result);
        console.log('Fichier �crit localement:', filePath);

        await client.cd('/code-analyzer/');
        console.log('D�placement dans le r�pertoire /code-analyzer/');

        await client.uploadFrom(filePath, 'analysis_result.txt');
        console.log('Fichier transf�r� avec succ�s sur benamour.fr.');

        res.status(200).send('Fichier sauvegard� avec succ�s sur benamour.fr.');
    } catch (err) {
        console.error('Erreur lors du transfert du fichier:', err);
        res.status(500).send('Erreur lors de la sauvegarde du fichier.');
    } finally {
        client.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en �coute sur le port ${PORT}`);
});
