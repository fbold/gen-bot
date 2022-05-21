const mongoose = require("mongoose")
const models = require("./models")

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

const addQuote = async (quote_) => {
  const quote = new models.quote({
    text: quote_,
  })
  return await quote.save()
}

const getAllQuotes = async () => {
  return await models.quote.find()
}

const getQuoteByID = async (id) => {
  return await models.quote.findById(id)
}

const deleteQuoteByID = async (id) => {
  return await models.quote.findByIdAndDelete(id)
}

const getRandomQuote = async (excludeIDs) => {
  return await models.quote.aggregate([
    { $match: { _id: { $nin: excludeIDs } } },
    { $sample: { size: 1 } },
  ])
}

module.exports = {
  addQuote,
  getAllQuotes,
  getQuoteByID,
  deleteQuoteByID,
  getRandomQuote,
}
