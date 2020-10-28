// const fs = require('fs')
// var easyinvoice = require('easyinvoice');
// const Cart = require('./models/cart');

// const getItem = async () => {
//     let name = [], quantity = [], price = []
//     try {
//             let cart = await Cart.find().populate("product")
//                 cart.map((products) => {
//                 name.push(products.product.name)
//                 quantity.push(products.Quantity)
//                 price.push(products.product.price)
//             })
//     }
//     catch(e) {
//         console.log(e)
//          return res.status(400).json(e)
//     }
//     return name[0]
// }

// console.log(getItem())
// exports.invoice = (req, res) => {
//         var data = {
//             //"documentTitle": "RECEIPT", //Defaults to INVOICE
//             "currency": "USD",
//             "taxNotation": "vat", //or gst
//             "marginTop": 25,
//             "marginRight": 25,
//             "marginLeft": 25,
//             "marginBottom": 25,
//             "logo": "https://www.easyinvoice.cloud/img/logo.png", //or base64
//             "sender": {
//                 "company": "Sample Corp",
//                 "address": "Sample Street 123",
//                 "zip": "1234 AB",
//                 "city": "Sampletown",
//                 "country": "Samplecountry"
//             },
//             "client": {
//                    "company": "Client Corp",
//                    "address": "Clientstreet 456",
//                    "zip": "4567 CD",
//                    "city": "Clientcity",
//                    "country": "Clientcountry"
//             },
//             "invoiceNumber": "2020.0001",
//             "invoiceDate": "05-01-2020",
//             "products": ,
//             // "products": [
//             //     {
//             //         "quantity": "2",
//             //         "description": "Test1",
//             //         "tax": 6,
//             //         "price": 33.87
//             //     },
//             //     {
//             //         "quantity": "4",
//             //         "description": "Test2",
//             //         "tax": 21,
//             //         "price": 10.45
//             //     }
//             // ],
//             "bottomNotice": "Kindly pay your invoice within 15 days."
//         };
//         easyinvoice.createInvoice(data, async function (result) {
//             await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
//         });
//     return res.json(data)
// }