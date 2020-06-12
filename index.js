require('dotenv').config()
const YandexCheckout = require("yandex-checkout")(
  process.env.YANDEX_SHOP_ID,
  process.env.YANDEX_SECTER_KEY
);
const axios = require("axios");
const express = require("express");
const pino = require("express-pino-logger")();
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;
app.use(pino);
app.use(bodyParser.json());
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
axios.defaults.headers.common["Authorization"] =
  `Bearer ${process.env.SNIPCART_TOKEN}`;
axios.defaults.headers.post["Content-Type"] = "application/json	";
app.get("/api/", (req, res) => res.send("Hello World!"));
app.post("/api/methods", (req, res) => {
  // Create a payment method list
  req.log.info("return methods");
  let paymentMethodList = [
    {
      id: "yakassa",
      name: "Яндекс Касса",
      iconUrl: "https://kassa.yandex.ru/integration/shopify/img/logo.svg",
      checkoutUrl: "https://magazinarium.ru/api/payment",
    },
  ];

  // Return successfully status code and available payment methods
  res.send(paymentMethodList);
});
function getOrder(publicToken) {
  return axios
    .get(
      `https://payment.snipcart.com/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`
    )
    .then((result) => {
      //   console.log(result.data.invoice);
      return result.data;
    });
}
function generateCallback(publicToken, state) {
  return axios
    .post(
      "https://payment.snipcart.com/api/private/custom-payment-gateway/payment",
      {
        paymentSessionId: publicToken,
        state: state,
        transactionId: "nd",
      }
    )
    .then((res) => {
      console.log("link :", res.data.returnUrl);
      return res.data.returnUrl;
    })
    .catch((err) => {
      console.log(err);
    });
}
function createPaymentLink(amount, link, payId) {
  return YandexCheckout.createPayment({
    amount: {
      value: amount,
      currency: "RUB",
    },
    payment_method_data: {
      type: "bank_card",
    },
    confirmation: {
      type: "redirect",
      return_url: link,
    },
    metadata: {
      orderId: payId,
    },
  })
    .then(function (result) {
      console.log({ payment: result });
      return { payment: result };
    })
    .catch(function (err) {
      console.error(err);
    });
}
app.get("/api/payment", async (req, res) => {
  const publicToken = req.query.publicToken;
  const order = await getOrder(publicToken);
  const callback = await generateCallback(order.id, 'processing');
  const paymentLink = await createPaymentLink(
    order.invoice.amount,
    callback,
    order.id
  );
  let link = paymentLink.payment.confirmation.confirmation_url;
  res.redirect(link);
});
app.post("/api/update_order", async (req, res) => {
  console.log(req.body);
  res.send("Ok");
  const data = req.body;
  switch (data.event) {
    case 'payment.succeeded':
      axios.get(await generateCallback(data.object.metadata.orderId, 'processed')).then(res => (
        console.log(res.status)
      ))
      break;
    case 'payment.canceled':
      axios.get(await generateCallback(data.object.metadata.orderId, 'failed')).then(res => (
        console.log(res.status)
      ))
      break;
      case 'payment.waiting_for_capture': 
      axios.get(await generateCallback(data.object.metadata.orderId, 'processing')).then(res => (
        console.log(res.status)
      ))
      break;
    default:
      console.log('Waiting')
      break;
  }

  //TODO дописать методы обновления платежа, ид в метадате
});
app.get("/api/return", async (req, res) => {
  const paymentSessionId = req.params.psid;
  const payId = req.params.payid;
});
