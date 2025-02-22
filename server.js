const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("getter de MPNotifications", req.body);
  res.json(req.body);
});

app.get("/get_order", async (req, res) => {
  const { external_reference } = req.query;

  const response = await axios.get(
    `https://api.mercadopago.com/merchant_orders/search?external_reference=${external_reference}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NODE_ENV_TOKEN}`,
      },
    }
  );
  console.log("RESPONSE GET: ", response)
  res.json(response.data);
});

app.post("/notification", (req, res) => {
  const data = req.body;
  const query = req.query;
  console.log("Datos recibidos:", data);
  console.log("Querys recibidos:", query);

  // Guarda las notificaciones en un archivo (opcional)
  // fs.appendFile('notifications.log', JSON.stringify(data) + '\n', (err) => {
  //     if (err) {
  //         console.error('Error al guardar la notificación:', err);
  //     }
  // });

  // Procesa los datos según tus necesidades
  if (data && data.type === "payment") {
    const paymentId = data.data.id;
    // Aquí puedes agregar la lógica para procesar el pago
    console.log("ID de pago:", paymentId);
    // ...
  }

  // Responder con un 200 OK a MercadoPago
  res.status(200).json({ status: "received" });
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

app.post("/sendConfirm", (req, res) => {
  const { enableChunk } = req.body;

  console.log("first ", enableChunk);
  console.log("Second ", process.env);
  console.log("Third ");
  console.log("four ");
  const transporter = nodemailer.createTransport({
    service: "gmail", // Puedes usar cualquier servicio de correo compatible
    auth: {
      user: process.env.NODE_ENV_EMAIL_USER,
      pass: process.env.NODE_ENV_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NODE_ENV_EMAIL_USER,
    to: process.env.NODE_ENV_EMAIL_USER,
    subject: "CHECK POINT DEV",
    text: enableChunk,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
