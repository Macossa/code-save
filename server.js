
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
    console.log('Requête reçue avec succès:', result);
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
        console.log('Connexion FTP réussie');

        const filePath = path.join(__dirname, 'analysis_result.txt');
        fs.writeFileSync(filePath, result);
        console.log('Fichier écrit localement:', filePath);

        await client.cd('/code-analyzer/');
        console.log('Déplacement dans le répertoire /code-analyzer/');

        await client.uploadFrom(filePath, 'analysis_result.txt');
        console.log('Fichier transféré avec succès sur benamour.fr.');

        res.status(200).send('Fichier sauvegardé avec succès sur benamour.fr.');
    } catch (err) {
        console.error('Erreur lors du transfert du fichier:', err);
        res.status(500).send('Erreur lors de la sauvegarde du fichier.');
    } finally {
        client.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
