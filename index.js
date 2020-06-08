var yandexCheckout = require("yandex-checkout")(
  "696363",
  "test_Jd71ujCSEaN6cDQooKGnm8dIYYZMU_K5TzLaVRaUnpU"
);
const axios = require("axios");
const express = require("express");
const app = express();
const port = 1234;

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

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/methods", (req, res) => {
  // Create a payment method list
  let paymentMethodList = [
    {
      id: "yakassa",
      name: "Яндекс Касса",
      iconUrl:
        "data:image/png;base64,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",
      checkoutUrl: "https://yandex.ru/",
    },
  ];

  // Return successful status code and available payment methods
  res.send(paymentMethodList);
});
