console.log('js file of toggle_friendship is loaded');
class ToggleFriendship{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleFriendship();
    }


    toggleFriendship(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'GET',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                
                if (data.data.friendAdded == true){
                    $(' button', self).html(`Cancel Request`);
                }else{
                    $(' button', self).html(`Add Friend`);
                }

            })
            .fail(function(errData) {
                console.log('error in completing the request', errData);
            });
            

        });
    }
}


new ToggleFriendship($('.toggle-friend-button'));