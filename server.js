const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log("getter de MPNotifications", req.body)
    res.json(req.body)
})

app.post('/notification', (req, res) => {
    const data = req.body;
    const query = req.query
    console.log('Datos recibidos:', data);
    console.log('Querys recibidos:', query);

    // Guarda las notificaciones en un archivo (opcional)
    // fs.appendFile('notifications.log', JSON.stringify(data) + '\n', (err) => {
    //     if (err) {
    //         console.error('Error al guardar la notificación:', err);
    //     }
    // });

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

app.post("/create_order", async (req, res) => {

    try {
      const response = await axios.post(
        "https://api.mercadopago.com/instore/orders/qr/seller/collectors/52153870/pos/SUC001POS001/qrs",
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NODE_ENV_TOKEN}`,
          },
        }
      );
  
      console.log("RESPONSE: ", response.data);
  
      res.json(response.data.qr_data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating order");
    }
  });

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
