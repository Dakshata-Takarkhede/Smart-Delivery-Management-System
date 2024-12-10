import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({

  customer: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },

  area: {
    type: String,
    required: true,
  },

  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],

  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked', 'delivered'],
    default: 'pending',
  },

  scheduledFor: {
    type: String, // Format HH:mm
    required: true,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
  },

  totalAmount: {
    type: Number,
    required: true,
  },
}, 
{ 
    timestamps: true 
});


export const Order = mongoose.model('Order', OrderSchema);