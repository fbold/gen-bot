const mongoose = require("mongoose")

const QuoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
})

const quote = mongoose.model("Quote", QuoteSchema)

module.exports = {
  quote,
}
