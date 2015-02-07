Matches = new Mongo.Collection('match');

var Schemas = {};

Schemas.Tournament = new SimpleSchema({
	teamName: {
		type: String,
		label: "Tournament Name",
		max: 200
	},
	teamTag: {
		type: String,
		label: "Tournament Tag",
		max: 6
	},
	userId: {
		type: String,
		label: "User ID"
	},
	author: {
		type: String,
		label: "Author"
	},
	submitted: {
		type: Date,
		label: "date submitted"
	},
	locked: {
		type: Boolean,
		label: "If this Team has closed signups"
	},
	members: {
		type: [Object],
		minCount: 0
	},
	"members.$.memberId": {
		type: String,
		label: "TeamID"
	}
})