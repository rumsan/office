const moment = require('moment-business-time');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const { ProjectModel } = require('../models');
const { DataUtils } = require('../../helpers/utils');
const { Entity } = require('./entity.service');

const Project = {
	async calculateWorkingHours(deadline) {
		return moment(deadline).workingDiff(moment(), 'hours');
	},
	async add(data) {
		data.budgeted_hours = await this.calculateWorkingHours(data.deadline);
		return ProjectModel.create(data);
	},
	async update(id, payload) {
		delete payload.budgeted_hours;
		payload.budgeted_hours = await this.calculateWorkingHours(payload.deadline);
		return ProjectModel.findOneAndUpdate({ _id: id, is_archived: false }, payload, {
			new: true,
			runValidators: true
		});
	},
	getById(id) {
		return ProjectModel.findOne({ _id: id });
	},
	async list(start, limit, search, isArchived, team, member, userTeam, isCustomer, searchTeam) {
		const query = [];
		if (isArchived && isArchived !== 'all') query.push({ $match: { is_archived: true } });
		if (isArchived === 'all') query.push({ $match: { is_system: false } });
		else query.push({ $match: { is_archived: false } });
		if (search)
			query.push({
				$match: {
					$or: [
						{ name: { $regex: new RegExp(`${search}`), $options: 'i' } },
						{ 'customer.name': { $regex: new RegExp(`${search}`), $options: 'i' } },
						{ 'customer.name': { $regex: new RegExp(`${search}`), $options: 'i' } }
					]
				}
			});
		if (!search && !searchTeam && team) {
			query.push({ $match: { 'entity.name': { $regex: new RegExp(`${team}`), $options: 'i' } } });
		}
		if (searchTeam) {
			query.push({
				$match: {
					'entity.id': ObjectId(searchTeam)
				}
			});
		}
		if (member) {
			query.push({
				$match: {
					$or: [
						{
							members: {
								$in: [new ObjectId(member)]
							}
						},
						{
							name: 'Public Holiday',
							'entity.name': userTeam
						},
						{
							name: 'Personal Day-off',
							'entity.name': userTeam
						},
						{
							name: 'Sick Leave',
							'entity.name': userTeam
						},
						{
							name: 'Lunch',
							'entity.name': userTeam
						},
						{
							name: `${userTeam} Internal Work (default)`,
							'entity.name': userTeam
						}
					]
				}
			});
		}
		if (isCustomer) {
			query.push({ $match: { 'customer.name': team } });
		}
		return DataUtils.paging({
			start,
			limit,
			sort: { created_at: -1 },
			model: ProjectModel,
			query
		});
	},
	archive(id) {
		return ProjectModel.findOneAndUpdate({ _id: id, is_archived: false }, { $set: { is_archived: true } });
	},
	async addDefaultProjects() {
		const endDateOfYear = moment().endOf('year').format('YYYY-MM-DD');
		const defaultProjectsName = ['Public Holiday', 'Personal Day-off', 'Sick Leave', 'Lunch'];
		let allEntities = await Entity.getAllEntities();
		allEntities = allEntities.filter(entity => entity.is_archived === false && entity.type === 'business');
		const data = await Promise.all(
			allEntities.map(entity => {
				const defaultProjectList = [...defaultProjectsName];
				defaultProjectList.push(entity.name);
				return Promise.all(
					defaultProjectList.map(async project => {
						const existingProject = await ProjectModel.findOne({
							$and: [{ name: project }, { 'entity.name': entity.name }]
						});
						if (existingProject) return { update: false };
						const payload = {
							name: project, // Public Holiday, Personal Day-off, Sick Leave, SelfName Project
							customer: {
								id: entity._id,
								name: entity.name
							}, // entities and customers from raman account
							is_system: true,
							entity: {
								id: entity._id,
								name: entity.name
							},
							deadline: endDateOfYear
						};
						const res = await this.add(payload);
						if (!res) return { update: false };
						return { update: true };
					})
				);
			})
		);
		const formattedArray = Object.keys(data).reduce((arr, key) => arr.concat(data[key]), []);
		const res = formattedArray.filter(r => r.update);
		return { message: `${res.length} number of projects created` };
	}
};
module.exports = {
	Project,
	add: req => Project.add(req.payload),
	update: req => Project.update(req.params.id, req.payload),
	getById: req => Project.getById(req.params.id),
	list: req => {
		const start = req.query.start || 0;
		const limit = req.query.limit || 20;
		const search = req.query.search || '';
		const isArchived = req.query.is_archived === 'completed' ? true : req.query.is_archived === 'all' ? 'all' : false;
		const { team, member } = req.query;
		const { team: userTeam } = req.currentUser;
		const isCustomer = req.query.isCustomer === 'true';
		const searchTeam = req.query.searchTeam || null;
		return Project.list(start, limit, search, isArchived, team, member, userTeam, isCustomer, searchTeam);
	},
	archive: req => Project.archive(req.params.id),
	setup: req => Project.addDefaultProjects()
};
