Template.teamEdit.events({
  'submit form': function(e) {
    e.preventDefault();
 		var currentTeamId = this._id;
 		var teamProperties = {
 	  	teamName: $(e.target).find('[name=teamName]').val(),
 	  	teamTag: $(e.target).find('[name=teamTag]').val()
 		}
 		Meteor.call('teamEdit', currentTeamId, teamProperties, function(error, result) {
	  // display the error to the user and abort
	  if (error)
	  	return alert(error.reason);

	  // show this result but route anyway
 		if (result.teamExists)
 			alert('This team name already exists');
	  
	  Router.go('teamPage', {_id: result._id});
	  });
	},

	'click .delete': function(e) {
 		e.preventDefault();
 		if (confirm("Delete this team?")) {
 			var currentTeamId = this._id;
 			Teams.remove(currentTeamId);
 			Router.go('teamsList');
 		}
 	}
});