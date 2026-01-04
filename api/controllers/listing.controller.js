const Listing = require('../models/listing.model.js');
const { errorHandler } = require('../utils/error.js');

const createListing = async (req, res, next) => {
  try {
    // Don't trust client for user or id fields — use token data
    const payload = { ...req.body };

    // Remove any _id that may have been accidentally supplied (causes ObjectId cast errors)
    if (payload._id) delete payload._id;

    // Ensure the listing belongs to the authenticated user (from verifyToken)
    if (req.user && req.user.id) {
      payload.userRef = req.user.id;
    }

    // Basic validation for required fields
    if (!payload.name || !payload.imageUrls || !Array.isArray(payload.imageUrls) || payload.imageUrls.length < 1) {
      return next(errorHandler(400, 'Missing required listing fields (name, imageUrls)'));
    }

    const listing = await Listing.create(payload);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next)=> {
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next((errorHandler(404, "Listing not found!")));
  }
  if(String(req.user.id) !== String(listing.userRef)){
    return next(errorHandler(401, "You can delete only your own listings!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted succefully")
  } catch (error) {
    next(errorHandler(401, "You can delete only your own listings!"))
  }
}

const updateListing = async (req, res, next)=>{
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next((errorHandler(404, "Listing not found!")));
  }
  if(String(req.user.id) !== String(listing.userRef)){
    return next(errorHandler(401, "You can update only your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    )
    await res.status(200).json(updatedListing);
  } catch (error) {
    next(error)
  }
}
// Search API
const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
  
    let offer = req.query.offer;
    if(offer === undefined || offer === 'false'){
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false'){
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if(parking === undefined || parking === 'false'){
      parking = {$in: [false, true] };
    }
  
    let type = req.query.type;
    if(type === undefined || type === "all"){
      type = {$in: ['sale', 'rent']}
    }
  
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';
  
    const listings = await Listing.find({
      name: {$regex: searchTerm, $options: 'i'},
      offer,
      furnished,
      parking,
      type,
    })
    .sort({[sort]: order})
    .limit(limit)
    .skip(startIndex);
  
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }

}

module.exports = { createListing, deleteListing, updateListing, getListing, getListings };