const fs = require('fs')
var easyinvoice = require('easyinvoice');
const Cart = require('./models/cart')


// exports.getCartItems = async (req, res) => {
//     var name = [], quantity = [], price = []
//     await Cart.find()
//         .populate("product")
//         .exec(async(err, cart) => {
//         if(err) return res.status(400).json(err)
//         await cart.map((products) => {
//             name.push(products.product.name)
//             quantity.push(products.Quantity)
//             price.push(products.product.price)
//         })        
//     })
// }

var data = {
    "currency": "INR",
    "taxNotation": "vat", //or gst
    "marginTop": 25,
    "marginRight": 25,
    "marginLeft": 25,
    "marginBottom": 25,
    "logo": "https://www.easyinvoice.cloud/img/logo.png", //or base64
    //"logoExtension": "png", //only when logo is base64
    "sender": {
        "company": "Smartaxom",
        "address": "Sample Street 123",
        "zip": "1234 AB",
        "city": "Sampletown",
        "country": "Samplecountry"
    },
    "client": {
        "company": "Client Corp",
        "address": "Clientstreet 456",
        "zip": "4567 CD",
        "city": "Clientcity",
        "country": "Clientcountry"
    },
    "invoiceNumber": "2020.0001",
    "invoiceDate": "05-01-2020",
    
    
    "products": [
        {
            "quantity": "2",
            "description": "Test1",
            "tax": 6,
            "price": 33.87
        },
        {
            "quantity": "4",
            "description": "Test2",
            "tax": 21,
            "price": 10.45
        }
    ],
    
    "bottomNotice": "Kindly pay your invoice within 15 days."
};    
easyinvoice.createInvoice(data, async function (result) {
    await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
});
