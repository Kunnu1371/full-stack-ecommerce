const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false);

const uri = process.env.MONGO_URI;
mongoose.connect(uri , {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("DB Connected !!!"))
.catch(err => console.log("Error: " + err))