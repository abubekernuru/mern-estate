const Listing = require('../models/listing.model.js')
// const { errorHandler } = require('../utils/error.js')

const createListing = async (req, res, next) => {
    
    try {
        const listing = await new Listing(req.body);
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

module.exports = { createListing };