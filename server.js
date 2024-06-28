const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/notification', (req, res) => {
    const data = req.body;
    console.log('Datos recibidos:', data);

    // Guarda las notificaciones en un archivo (opcional)
    fs.appendFile('notifications.log', JSON.stringify(data) + '\n', (err) => {
        if (err) {
            console.error('Error al guardar la notificación:', err);
        }
    });

    // Procesa los datos según tus necesidades
    if (data && data.type === 'payment') {
        const paymentId = data.data.id;
        // Aquí puedes agregar la lógica para procesar el pago
        console.log('ID de pago:', paymentId);
        // ...
    }

    // Responder con un 200 OK a MercadoPago
    res.status(200).json({ status: 'received' });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
