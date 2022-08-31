const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const { ObjectId } = mongoose.Schema;

const schema = mongoose.Schema(
	{
		project: { type: ObjectId, ref: 'Projects', required: true },
		details: { type: String },
		date: { type: Date, required: true },
		hours: { type: Number, required: true },
		...commonSchema
	},
	{
		collection: 'charges',
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		toObject: {
			virtuals: true
		},
		toJson: {
			virtuals: true
		}
	}
);

module.exports = mongoose.model('Charges', schema);
