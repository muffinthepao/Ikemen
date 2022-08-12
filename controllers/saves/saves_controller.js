const userModel = require("../../models/authentication/users");
const listingModel = require("../../models/listings/listings");
const saveModel = require("../../models/saves/saves");

const listingsValidator = require("../Joi_validators/listings");
const reviewsValidator = require("../Joi_validators/reviews");

const controller = {
  saveListing: async (req, res) => {
    const listingID = req.params.listing_id
    const user = await userModel.findOne({ email: req.session.user });
  
    try {
      const save = await saveModel.create({
        user: user._id,
        yelpID: listingID
      });
  
      const listing = await listingModel.findOne({ yelpID: listingID })
  
      if (listing){
        await listingModel.findOneAndUpdate({ yelpID: listingID },
          {
            $push: {
              saves: save._id,
            },
            $inc: {
              saveCount: 1
            }
          }
        );
      } else {
        await listingModel.create({
          yelpID: listingID,
          saves: [save._id],
          saveCount: 1
        })
      }
  
  
      res.redirect(`/food/${listingID}`);
    } catch (err) {
      console.log(err);
      res.send("unable to save listing");
    }
  },
  
  deleteSavedListing: async (req, res) => {
    const listingID = req.params.listing_id;
    const user = await userModel.findOne({ email: req.session.user });
    const save = await saveModel.findOneAndDelete({yelpID: listingID, user: user._id})
  

    try {
      await saveModel.findOneAndDelete({yelpID: listingID, user: user._id})
      await listingModel.findOneAndUpdate({yelpID: listingID}, 
        {
          $pull: {
            saves: save._id,
          },
          $inc: {
            saveCount: -1,
          },
        },
        )
      res.redirect(`/food/${listingID}`);
      
    } catch (err) {
      console.log(err)
      res.send("unable to unsave listing")
    }

  }
}

module.exports = controller;

