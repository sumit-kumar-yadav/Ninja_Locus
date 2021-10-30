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
                if (data.data.deleted == true){
                    likesCount -= 1;
                    $(' .likes-count', self).html(`
                        <span>${likesCount}</span>
                        <span>
                            <i class="far fa-thumbs-up"></i>
                            <span style="color: blue;">Likes</span>
                        </span> 
                    `);
                    $(' .likes-count', self).css({
                        "color": "grey"
                    });
                    
                }else{
                    likesCount += 1;
                    $(' .likes-count', self).html(`
                        <span>${likesCount}</span>
                        <span>
                            <i class="fas fa-thumbs-up animate__animated animate__heartBeat"></i>
                            <span style="color: blue;">Likes</span>
                        </span>
                    `);
                    $(' .likes-count', self).css({
                        "color": "blue"
                    })
                }


                $(self).attr('data-likes', likesCount);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
