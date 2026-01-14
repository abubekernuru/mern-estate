// const Listing = require('../models/listing.model.js');
// const { errorHandler } = require('../utils/error.js');

// const createListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.create(req.body);
//     return res.status(201).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteListing = async (req, res, next)=> {
//   const listing = await Listing.findById(req.params.id);

//   if(!listing){
//     return next((errorHandler(404, "Listing not found!")));
//   }
//   if(req.user.id !== listing.userRef){
//     return next(errorHandler(401, "You can delete only your own listings!"));
//   }
//   try {
//     await Listing.findByIdAndDelete(req.params.id);
//     res.status(200).json("Listing has been deleted succefully")
//   } catch (error) {
//     next(errorHandler(401, "You can delete only your own listings!"))
//   }
// }

// const updateListing = async (req, res, next)=>{
//   const listing = await Listing.findById(req.params.id);

//   if(!listing){
//     return next((errorHandler(404, "Listing not found!")));
//   }
//   if(req.user.id !== listing.userRef){
//     return next(errorHandler(401, "You can update only your own listings!"));
//   }

//   try {
//     const updatedListing = await Listing.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {new: true}
//     )
//     await res.status(200).json(updatedListing);
//   } catch (error) {
//     next(error)
//   }
// }
// // Search API
// const getListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return next(errorHandler(404, 'Listing not found!'));
//     }
//     res.status(200).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

// const getListings = async (req, res, next) => {
//   try {
    
//     const limit = parseInt(req.query.limit) || 9;
//     const startIndex = parseInt(req.query.startIndex) || 0;
  
//     let offer = req.query.offer;
//     if(offer === undefined || offer === 'false'){
//       offer = { $in: [false, true] };
//     }
//     let furnished = req.query.furnished;
//     if(furnished === undefined || furnished === 'false'){
//       furnished = { $in: [false, true] };
//     }
//     let parking = req.query.parking;
//     if(parking === undefined || parking === 'false'){
//       parking = {$in: [false, true] };
//     }
  
//     let type = req.query.type;
//     if(type === undefined || type === "all"){
//       type = {$in: ['sale', 'rent']}
//     }
  
//     const searchTerm = req.query.searchTerm || '';
//     const sort = req.query.sort || 'createdAt';
//     const order = req.query.order || 'desc';
  
//     const listings = await Listing.find({
//       name: {$regex: searchTerm, $options: 'i'},
//       offer,
//       furnished,
//       parking,
//       type,
//     })
//     .sort({[sort]: order})
//     .limit(limit)
//     .skip(startIndex);
  
//     return res.status(200).json(listings);
//   } catch (error) {
//     next(error);
//   }

// }

// module.exports = { createListing, deleteListing, updateListing, getListing, getListings };


const Listing = require('../models/listing.model.js');
const mongoose = require('mongoose');
const { errorHandler } = require('../utils/error.js');

const createListing = async (req, res, next) => {
  try {
    // Ensure the user is authenticated (token -> req.user set by verifyToken)
    if (!req.user || !req.user.id) {
      // Helpful debug logging to inspect why user was missing
      console.warn('[createListing] unauthenticated request. cookies:', req.cookies, 'body:', req.body);
      return next(errorHandler(401, 'Unauthorized - sign in to create listings'));
    }

    const payload = { ...req.body };

    // Remove any client-supplied id
    if (payload._id) delete payload._id;

    // Set the authenticated user as the owner
    payload.userRef = String(req.user.id);

    // Basic validation for required fields
    if (!payload.name || !payload.imageUrls || !Array.isArray(payload.imageUrls) || payload.imageUrls.length < 1) {
      return next(errorHandler(400, 'Missing required listing fields (name, imageUrls)'));
    }

    const listing = await Listing.create(payload);
    return res.status(201).json(listing);
  } catch (error) {
    // If this is a Mongoose validation error, return a 400 with details
    if (error.name === 'ValidationError') {
      return next(errorHandler(400, `Listing validation failed: ${Object.values(error.errors).map(e => e.message).join(', ')}`));
    }
    next(error);
  }
};

const deleteListing = async (req, res, next)=> {  // Validate id to avoid Mongoose CastError
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(errorHandler(400, 'Invalid listing id'));
  }
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
  // Validate id first
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(errorHandler(400, 'Invalid listing id'));
  }

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
    // Validate id to avoid CastError
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, 'Invalid listing id'));
    }

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