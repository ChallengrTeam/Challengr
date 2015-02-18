Template.tournamentEdit.rendered = function() {
    $('.datetimepicker').datetimepicker();
};

Template.tournamentEdit.helpers({
  isLocked: function() {
  	return this.locked;
  },

  tournamentFormats: function() {
    return [
        {name: "None", current: this.format},
        {name: "Single Elimination", current: this.format}
    ];
  },
});

Template.tournamentFormat.helpers({
    isFormatCurrent: function() {
        return this.name == this.current;
    }
});

Template.tournamentEdit.events({
    'click .bracket-create': function(event, template) {
        Meteor.call('tournamentCreateBracket', this._id, $("#FormatSelect").val(),
            function(error, result) {
                alert(error ? error.reason : "Bracket created!");
                Router.go('tournamentPage', {_id: result._id});
            }
        );
    },

    'click .bracket-clear': function(event, template) {
        Meteor.call('tournamentClearBracket', this._id,
            function(error, result) {
                alert(error ? error.reason : "Bracket cleared!");
                Router.go('tournamentPage', {_id: result._id});
            }
        );
    },

  	'submit form': function(e) {
    	e.preventDefault();
 		var currentTournamentId = this._id;
 		var newName = $(e.target).find('[name=tournamentName]').val();
 		var tournament = Tournaments.findOne({_id: currentTournamentId});

 		var tournamentProperties = {
 	  		tournamentName: newName,
 	  		game: $('#game').text(),
 	  		mode: $('#mode').text(),
            startDate: $('.datetimepicker').text()
 		};

 		Meteor.call('tournamentEdit', currentTournamentId, tournamentProperties,
 			function(error, result) {
			  	// display the error to the user and abort
			  	if (error) return alert(error.reason);

				// show this result but route anyway
		 		if (result.tournamentExists) alert('This tournament name already exists');
				Router.go('tournamentPage', {_id: result._id});
	  	});
	},

	'click .delete': function(e) {
 		e.preventDefault();
 		if (confirm("Delete this tournament?")) {
 			var currentTournamentId = this._id;
 			Tournaments.remove(currentTournamentId);
 			Router.go('tournamentsList');
 		}
 	},

 	'click .lock': function(e) {
 		e.preventDefault();
 		if (confirm("Lock this tournament?")) {
 			var currentTournamentId = this._id;
 			Meteor.call('tournamentLock', currentTournamentId, function(error, result) {
		  // display the error to the user and abort
			  if (error)
			  	return alert(error.reason);

			  Router.go('tournamentPage', {_id: result._id});
	 		});
	 	} 
	},


 	'click .unlock': function(e) {
 		e.preventDefault();
 		if (confirm("Unlock this tournament?")) {
 			var currentTournamentId = this._id;
 			Meteor.call('tournamentUnlock', currentTournamentId, function(error, result) {
		  // display the error to the user and abort
		  if (error)
		  	return alert(error.reason);
		  
		  Router.go('tournamentPage', {_id: result._id});
	 		});
	 	}
	}
});