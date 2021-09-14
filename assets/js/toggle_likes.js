// Create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    $(' .likes-count', self).html(`
                        ${likesCount}
                        <i class="far fa-thumbs-up"></i> Likes 
                    `);
                    
                }else{
                    likesCount += 1;
                    $(' .likes-count', self).html(`
                        ${likesCount}
                        <i class="fas fa-thumbs-up"></i> Likes 
                    `);
                }


                $(self).attr('data-likes', likesCount);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
