const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const { ObjectId } = mongoose.Schema;

const schema = {
	entityType: {
		type: String,
		required: true
	},
	entity: { type: ObjectId },
	message: {
		type: String,
		required: true
	},
	description: { type: String },
	redirectUrl: { type: String },
	notifyTo: [
		{
			_id: false,
			userId: { type: ObjectId },
			isRead: { type: Boolean, default: false }
		}
	],
	...commonSchema
};

const notificationSchema = mongoose.Schema(schema, {
	collection: 'notifications',
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

module.exports = mongoose.model('Notifications', notificationSchema);
