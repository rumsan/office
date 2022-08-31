const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const TaskSchema = mongoose.Schema(
	{
		date: Date,
		user_id: Object,
		assigned_to: {
			type: ObjectId,
			ref: 'User',
			required: true
		},
		assigned_by: {
			type: ObjectId,
			ref: 'User',
			required: true
		},
		assigned_date: {
			type: Date,
			default: Date.now,
			required: true
		},
		extId: String,
		source: { type: String, enum: ['MeisterTask', 'Gitlab'] },
		name: { type: String },
		est_time: Number,
		sourceData: { type: Object },
		status: { type: String, enum: ['open', 'close'], default: 'open' },
		is_archived: { type: Boolean, default: false }
	},
	{
		collection: 'tasks',
		toObject: {
			virtuals: true
		},
		toJson: {
			virtuals: true
		}
	}
);

const DailyTaskSchema = mongoose.Schema(
	{
		date: { type: Date, required: true, default: Date.now },
		user: {
			type: ObjectId,
			ref: 'User',
			required: true
		},
		task: {
			type: ObjectId,
			ref: 'Task',
			required: true
		},
		status: { type: String, enum: ['incomplete', 'complete'], default: 'incomplete' }
	},
	{
		collection: 'tasks_daily',
		toObject: {
			virtuals: true
		},
		toJson: {
			virtuals: true
		}
	}
);

module.exports = {
	TaskModel: mongoose.model('Task', TaskSchema),
	DailyTaskModel: mongoose.model('DailyTask', DailyTaskSchema)
};
