// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    // Set the value of form textarea of form as empty
                    $(' textarea', pSelf.newCommentForm).val("");

                    let newComment = pSelf.newCommentDom(data.data.comment, data.data.post_user_id);
                    $(`#post-comments-list-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // Enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));

                    // Call the showPostCommentMoreOption function in home_style.js to add listener on new post's more option
                    showPostCommentMoreOption($(`#post-comment-more-icon-${data.data.comment._id}`));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment, post_user_id){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        
        let newComment = $(`
        <div id="comment-${comment._id}" class="comment-list-container">
            <div class="comment-user-info">
                <div class="user-comment-details">
                    <a href="/users/profile/${comment.user.id}">
                        <div class="comment-user-name-pic">
                            <img src="/images/Users-avatar.png" alt="img">
                                <span>You</span>
                        </div>
                    </a>
                    <br>
                    <small>${new Date(comment.createdAt).toString().substring(4,16)} at ${new Date(comment.createdAt).toString().substring(16, 21)}</small>
                </div>
                <span class="post-comment-more-icon" id="post-comment-more-icon-${comment._id}">
                    <i class="fas fa-ellipsis-h"></i>
                </span>
                <span class="post-comment-close-icon" id="post-comment-close-icon-${comment._id}">
                    <i class="far fa-times-circle"></i>
                </span>

                <ul class="post-comment-more-options animate__animated animate__flipInX" id="post-comment-more-options-${comment._id}">
                    <!-- Delete a comment -->
                    <a class="delete-comment-button" href="/comments/destroy/?id=${comment._id}&post_user_id=${post_user_id}">
                        <li>Delete Comment</li>
                    </a>

                </ul>
            </div>

            <div class="comment-content">
                ${comment.content}
            </div>

            <div class="comment-user-controls">
                <!-- Display the likes of this comment, if the user is logged in, then show the link to toggle likes, else, just show the count -->
                <div class="comment-likes-container">
                    <a class="toggle-like-button" data-likes="${comment.likes.length}" href="/likes/toggle/?id=${comment._id}&type=Comment">
                        <div class="likes-count">
                            ${comment.likes.length}
                            <i class="far fa-thumbs-up"></i> Likes 
                        </div>
                    </a>
                </div>
            </div>

        </div>
        `);

        $(' .comment-user-name-pic img', newComment).attr('src', $('#nav-avatar').attr('src'));
        return newComment;
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log('Successfully deleted');
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}