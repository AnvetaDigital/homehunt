import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: Number, required: true, index: true},
    location: {
        address: String,
        city: {type: String, index: true},
        state: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
    },
},
category: {
    type: String,
    enum: ["apartment", "villa", "plot", "commercial"],
    required: true,
    index: true
},

images: [
    {
        url: String, 
        public_id: String,
    },
],

amenties: [String],

bedrooms: Number,
bathrooms: Number,
area: Number, // in sqft

listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},

isFeatured: { type: Boolean, default: false},
isSold: { type: Boolean, default: false},

},
{ timestamps: true });

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);