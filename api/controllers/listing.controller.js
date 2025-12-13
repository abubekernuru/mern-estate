const Listing = require('../models/listing.model.js')

const createListing = async (req, res, next) => {
    await new Listing(req.body);
    res.status(200).json(Listing)
}

module.exports = { createListing };