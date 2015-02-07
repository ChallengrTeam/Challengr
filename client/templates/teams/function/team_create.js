Template.teamCreate.events({
  'submit form': function(e) {
    e.preventDefault();
    var post = {
      teamName: $(e.target).find('[name=teamName]').val(),
      teamTag: $(e.target).find('[name=teamTag]').val()
    };
  Meteor.call('teamInsert', post, function(error, result) {
	  // display the error to the user and abort
	  if (error)
	  	return alert(error.reason);

	  // show this result but route anyway
 		if (result.teamExists)
 			alert('This team already exists');

 		 if (result.notLoggedIn)
 			alert('Please Log In');
	  
	  Router.go('teamPage', {_id: result._id});
	  });
	}
});