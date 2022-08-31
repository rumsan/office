const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const schema = {
	user: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	reason: { type: String, require: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	is_approved: { type: Boolean, default: false },
	approved_by: { type: ObjectId, ref: 'User' },
	type: { type: String, enum: ['half day', 'full day'], require: true }
};

const LeaveSchema = mongoose.Schema(schema, {
	collection: 'leave',
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

module.exports = mongoose.model('Leave', LeaveSchema);
