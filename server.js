app.post('/save', async (req, res) => {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: 'ftp1.neodomaine.com',
            user: 'benamour.fr',
            password: 'HWWGKSM2', // Assurez-vous que cela est correct
            port: 21,
            secure: false,
            secureOptions: { rejectUnauthorized: false }
        });
        console.log('Connexion FTP réussie');
        res.status(200).send('Connexion FTP réussie.');
    } catch (err) {
        console.error('Erreur lors de la connexion FTP:', err);
        res.status(500).send('Erreur lors de la connexion FTP.');
    } finally {
        client.close();
    }
});