

class Friendship{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(friendId){
        this.friendId = friendId;
        this.friendElement = $(`#friend-${this.friendId}`);
        // console.log(this.friendElement);
        this.deleteLink = $(' .remove-friend-button', this.friendElement);
        // console.log(this.deleteLink);
        
        // let self = this;
        this.deleteFriend();
    }

    // createFriend(friendId){}
    // newFriendDom(friendId){}

    deleteFriend(){
        let self = this;
        $(this.deleteLink).click(function(e){
            e.preventDefault();
            console.log($(self.deleteLink));

            $.ajax({
                type: 'get',
                url: $(self.deleteLink).prop('href'),
                success: function(data){
                    // console.log(data);
                    $(self.friendElement).remove();
                    console.log('Successfully deleted');

                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}

// Iterating over all the existing user's friends
$('.friends-of-user').each(function(){
    let self = $(this);
    // console.log('lets check', self, $(self));

    // get the friend id by splitting the id attribute
    let friendId = self.prop('id').split("-")[1];
    // console.log(friendId);
    new Friendship(friendId);
});