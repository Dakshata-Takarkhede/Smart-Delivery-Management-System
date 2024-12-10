import mongoose from "mongoose";


const DeliveryPartnerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },

  currentLoad: {
    type: Number,
    default: 0, // Number of active orders assigned
    max: 3, // Maximum load allowed
  },

  areas: {
    type: [String],
    required: true,
  },

  shift: {
    start: {
      type: String, // Format HH:mm
      required: true,
    },
    end: {
      type: String, // Format HH:mm
      required: true,
    },
  },

  metrics: {
    rating: {
      type: Number,
      default: 0,
    },
    completedOrders: {
      type: Number,
      default: 0,
    },
    cancelledOrders: {
      type: Number,
      default: 0,
    },
  },
}, 
{ 
  timestamps: true 
});


export const DeliveryPartner = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);