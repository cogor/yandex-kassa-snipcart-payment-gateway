const YandexCheckout = require("yandex-checkout")(
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

  // Return successful status code and available payment methods
  res.send(paymentMethodList);
});
async function getOrder(publicToken) {
  return axios
    .get(
      `https://payment.snipcart.com/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`
    )
    .then((result) => {
      console.log(result.data.invoice);
      return result.data.invoice;
    });
}
async function createPaymentLink(amount) {
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
      return_url: "https://www.merchant-website.com/return_url",
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
  const paymentLink = await createPaymentLink(order.amount);
  let link = paymentLink.payment.confirmation.confirmation_url;
  console.log(req.body);
  res.redirect(link);
  //   axios
  //     .get(
  //       `https://payment.snipcart.com/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       res.send(response);
  //     });
});
