const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const schema = mongoose.Schema(
	{
		name: { type: String, required: true, trim: true }, // Public Holiday, Personal Day-off, Sick Leave, SelfName Project
		customer: {
			id: { type: ObjectId },
			name: { type: String, required: true }
		}, // entities and customers from raman account
		is_system: { type: Boolean, required: true, default: false },
		entity: {
			id: { type: ObjectId },
			name: { type: String, required: true }
		},
		members: [ObjectId],
		deadline: { type: Date, required: true },
		budgeted_hours: { type: Number },
		created_by: { type: ObjectId, ref: 'User' },
		is_archived: { type: Boolean, default: false }
	},
	{
		collection: 'projects',
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		toObject: {
			virtuals: true
		},
		toJson: {
			virtuals: true
		}
	}
);

module.exports = mongoose.model('Projects', schema);
