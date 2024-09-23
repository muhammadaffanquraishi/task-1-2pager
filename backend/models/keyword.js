const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    unique: true,
  },
});

const Keyword = mongoose.model('Keyword', keywordSchema);

module.exports = Keyword;