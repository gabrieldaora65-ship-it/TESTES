const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// serviço externo que vai receber os dados (muda depois se quiser)
const EXTERNAL_URL = process.env.EXTERNAL_URL || 'https://testes-3rwa.onrender.com';

app.post('/ens', async (req, res) => {
  try {
    const events = req.body;

    for (const ev of events) {
      if (ev.eventCategoryType === "EngagementEvents.OttMobileOriginated") {
        const payload = {
          contactId: ev.contactId,
          mobileNumber: ev.mobileNumber,
          message: ev.messageBody?.text?.body,
          timestamp: ev.timestampUTC
        };

        console.log("Repassando:", payload);

        await axios.post(EXTERNAL_URL, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    res.status(200).send("ok");
  } catch (e) {
    console.error("Erro:", e.message);
    res.status(200).send("erro");
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
