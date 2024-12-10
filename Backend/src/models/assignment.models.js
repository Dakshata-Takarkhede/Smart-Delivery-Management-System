import mongoose from "mongoose";


const AssignmentSchema = new mongoose.Schema({

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },

  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
  },

  reason: {
    type: String, // Optional field for failed assignments
  },
}, 
{ 
    timestamps: true 
});


export const Assignment = mongoose.model('Assignment', AssignmentSchema);