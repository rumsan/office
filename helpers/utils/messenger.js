const nodemailer = require('nodemailer');
const config = require('config');

const host_url = config.get('app.frontEndUrl');
const handlebars = require('handlebars');
const fs = require('fs');

const transporter = nodemailer.createTransport(config.get('services.nodemailer'));

handlebars.registerHelper('host_url', () => host_url);

const Templates = {
	leave_request: {
		subject: 'New leave request.',
		html: `${__dirname}/../../assets/email_templates/leave_request.html`
	},
	leave_response: {
		subject: 'Leave Request Response',
		html: `${__dirname}/../../assets/email_templates/leave_response.html`
	}
};

function TemplateMapper(from, name) {
	const template = Templates[name];
	template.from = from;
	return template;
}

class Messenger {
	constructor() {}

	getTemplate(from, name) {
		return TemplateMapper(from, name);
	}

	getHtmlBody(from, name, data) {
		const template = this.getTemplate(from, name);
		if (!template) return null;

		const text = fs.readFileSync(template.html, { encoding: 'utf-8' });
		const hTemplate = handlebars.compile(text);
		return hTemplate(data);
	}

	async send(payload) {
		const me = this;
		const template = this.getTemplate(payload.data.sender, payload.template);
		if (!template) throw new Error('No template is defined');
		if (!payload.to) throw new Error('No receipent was specified');

		if (payload.subject) {
			template.subject = payload.subject;
		}
		return transporter.sendMail({
			from: template.from,
			subject: template.subject,
			to: payload.to,
			html: me.getHtmlBody(template.from, payload.template, payload.data)
		});
	}

	checkNotifyMethod(data) {
		if (data.email) return 'email';
		return 'sms';
	}
}

module.exports = new Messenger();
