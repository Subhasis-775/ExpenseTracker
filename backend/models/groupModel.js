import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: String, // Storing names for simplicity
        required: true
    }],
    currency: {
        type: String,
        default: 'INR'
    }
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);
export default Group;
