Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', {
  name: 'home'
});

Router.route('/myinvites', {
  name: 'userInvitePage',
  waitOn: function() { return Meteor.subscribe('invites') && Meteor.subscribe('teams'); }
});

/* Teams */

Router.route('/teams', {
  name: 'teamsList',
  waitOn: function() { return Meteor.subscribe('teams'); }
});
Router.route('/myteams', {
  name: 'teamsCaptainList',
  waitOn: function() { return Meteor.subscribe('teams'); }
});
Router.route('/teams/:_id', {
  name: 'teamPage',
  waitOn: function() { return Meteor.subscribe('teams'); },
  data: function() { return Teams.findOne(this.params._id); }
});
Router.route('/teams/:_id/edit', {
  name: 'teamEdit',
  waitOn: function() { return Meteor.subscribe('teams'); },
  data: function() { return Teams.findOne(this.params._id); },
  onBeforeAction: function() {
    var doc = Teams.findOne(this.params._id);
    if (! ownsDocument(Meteor.userId(), doc)) {
      this.render('accessDenied');
    } else {
      this.next();
    }
  }
});
Router.route('/teams/:_id/viewapplicants', {
  name: 'teamPendingList',
  waitOn: function() { return Meteor.subscribe('teams'); },
  data: function() { return Teams.findOne(this.params._id); },
  onBeforeAction: function() {
    var doc = Teams.findOne(this.params._id);
    if (! ownsDocument(Meteor.userId(), doc)) {
      this.render('accessDenied');
    } else {
      this.next();
    }
  }
});
Router.route('/teams/:_id/invite', {
  name: 'teamInvitePage',
  waitOn: function() { return Meteor.subscribe('teams'); },
  data: function() { return Teams.findOne(this.params._id); },
  onBeforeAction: function() {
    var doc = Teams.findOne(this.params._id);
    if (! ownsDocument(Meteor.userId(), doc)) {
      this.render('accessDenied');
    } else {
      this.next();
    }
  }
});


Router.route('/create/team', {name: 'teamCreate'});

/* Matches */

Router.route('/match/:_id', {
    name: 'matchPage',
    waitOn: function() {
        return Meteor.subscribe('tournaments') &&
        Meteor.subscribe('teams') &&
        Meteor.subscribe('matches');
    },
    data: function () { return Matches.findOne({_id: this.params._id}); }
});


/* Tournaments */


Router.route('/tournaments', {
  name: 'tournamentsList',
  waitOn: function() { return Meteor.subscribe('tournaments'); }
});
Router.route('/tournaments/:_id', {
  name: 'tournamentPage',
  waitOn: function() {
    return Meteor.subscribe('tournaments') &&
    Meteor.subscribe('teams') &&
    Meteor.subscribe('matches');
  },
  data: function() { return Tournaments.findOne(this.params._id); }
});
Router.route('/tournaments/:_id/edit', {
  name: 'tournamentEdit',
  data: function() { return Tournaments.findOne(this.params._id); },
  waitOn: function() {
    return Meteor.subscribe('tournaments') &&
    Meteor.subscribe('teams');
  },
  onBeforeAction: function() {
    var doc = Tournaments.findOne(this.params._id);
    if (! ownsDocument(Meteor.userId(), doc)) {
      this.render('accessDenied');
    } else {
      this.next();
    }
  }
});
Router.route('/tournaments/:_id/join', {
  name: 'tournamentJoinList',
  data: function() { return Tournaments.findOne(this.params._id); },
  waitOn: function() { return Meteor.subscribe('teams') && Meteor.subscribe('tournaments'); },
  onBeforeAction: function() {
    var tournament = Tournaments.findOne(this.params._id);
    if (tournament.locked) {
      this.render('accessDenied');
    } else {
      this.next();
    }
  }
});

Router.route('/create/tournament', {name: 'tournamentCreate'});

var requireLogin = function() {
  if (! Meteor.user()) {
	  if (Meteor.loggingIn()) {
	  	this.render(this.loadingTemplate);
	  } else {
	    this.render('pleaseLogIn');
	  }
	} else {
	  this.next();
	}
};

//hooks
Router.onBeforeAction('dataNotFound', {only: ['teamPage', 'tournamentPage']});
Router.onBeforeAction(requireLogin, {only: ['teamCreate', 'teamEdit', 'tournamentCreate', 'tournamentEdit', 'tournamentJoinList']});