var yandexCheckout = require("yandex-checkout")(
  "696363",
  "test_Jd71ujCSEaN6cDQooKGnm8dIYYZMU_K5TzLaVRaUnpU"
);
const axios = require("axios");
const express = require("express");
var pino = require("express-pino-logger")();
const app = express();
const port = 1234;
app.use(pino);
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// YandexCheckout.createPayment(
//   {
//     amount: {
//       value: "2.00",
//       currency: "RUB",
//     },
//     payment_method_data: {
//       type: "bank_card",
//     },
//     confirmation: {
//       type: "redirect",
//       return_url: "https://www.merchant-website.com/return_url",
//     },
//   }
// )
//   .then(function (result) {
//     console.log({ payment: result });
//   })
//   .catch(function (err) {
//     console.error(err);
//   });
// Get public token from query string

async function SnipcartPaymert() {
  const publicToken =
    "MmU5YzMxNzQtYjE3OC00MDJjLWI5M2QtYWFhZTY2NTk4YWMxNjM3MTY1ODM0ODM5OTE3MTUy";

  // Fetch payment session from API
  const response = await axios.get(
    `https://payment.snipcart.com/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`
  );

  // Retrieve body as JSON if the request's status code is successful
  if (response.ok) {
    const paymentSession = await response.json();
    console.log(paymentSession);
    return paymentSession;
  }
}

app.get("/api/", (req, res) => res.send("Hello World!"));
app.get("/api/methods", (req, res) => {
  // Create a payment method list
  req.log.info("return methods");
  let paymentMethodList = [
    {
      id: "yakassa",
      name: "Яндекс Касса",
      iconUrl: 'https://kassa.yandex.ru/integration/shopify/img/logo.svg',
      checkoutUrl: "https://yandex.ru/",
    },
  ];

  // Return successful status code and available payment methods
  res.send(paymentMethodList);
});
