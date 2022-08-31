const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const UserDailySchema = mongoose.Schema(
	{
		date: { type: Date, required: true },
		user: { type: ObjectId, required: true, ref: 'User' },
		scheduled: { start: String, end: String },
		scheduled_minutes: Number,
		status: {
			type: String,
			enum: ['regular', 'partial', 'timeoff'],
			default: 'regular'
		}
	},
	{
		collection: 'users_daily',
		toObject: {
			virtuals: true
		},
		toJson: {
			virtuals: true
		}
	}
);

module.exports = {
	UserDailyModel: mongoose.model('UserDaily', UserDailySchema)
};
