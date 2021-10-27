{   
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            let validFile = validatePostExtension(this);

            if(validFile){
                $.ajax({
                    type: 'post',
                    url: '/posts/create',
                    // data: newPostForm.serialize(),
                    data: new FormData(this),
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    beforeSend: function(){
                        let button = $(' button[type=submit]', newPostForm);
                        button.attr("disabled", "disabled");
                        button.css("opacity", "0.7");
                    },
                    success: function(data){
                        // Set the value of form textarea of form as empty
                        $(' textarea', newPostForm).val("");

                        let newPost = newPostDom(data.data.post);
                        $('#posts-list-container').prepend(newPost);
                        
                        deletePost($(' .delete-post-button', newPost));   
                        // jQuery Object (newPost) having class = .delete-post-button is written like this in jquery -->> $(' .delete-post-button', newPost)
                        // This will pass the <a> tag to the function deletePost
                        // Note:  space is required here before .delete-post-button


                        // call the create comment class
                        new PostComments(data.data.post._id);

                        // Enable the functionality of the toggle like button on the new post
                        new ToggleLike($(' .toggle-like-button', newPost));

                        // Call the showPostCommentMoreOption function in home_style.js to add listener on new post's more option
                        showPostCommentMoreOption($(`#post-comment-more-icon-${data.data.post._id}`));

                        // Call the toggleCommentSection function in home_style.js to add listener on the new post's comment option
                        toggleCommentSection($(`#comments-container-${data.data.post._id}`));

                        new Noty({
                            theme: 'relax',
                            text: "Post published!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                            
                        }).show();

                        enablePostButton();

                    }, error: function(error){
                        console.log(error.responseText);
                        new Noty({
                            theme: 'relax',
                            text: error.responseText,
                            type: 'error',
                            layout: 'topRight',
                            timeout: 1500
                            
                        }).show();

                        enablePostButton();
                    }
                });
            }

            function enablePostButton(){
                // Enable the post button
                let button = $(' button[type=submit]', newPostForm);
                button.removeAttr("disabled");
                button.css("opacity", "1");
                // Reset the post form
                newPostForm[0].reset();
            }
        });
    }


    // method to create a post in DOM
    let newPostDom = function(post){
        let newPost = $(`
        <div id="post-${post._id}" class="post-list">

        <div class="user-info">
            <div class="user-post-details">
                <a href="/users/profile/${post.user._id}">
                    <div class="user-name-pic">
                        <img src="/images/Users-avatar.png" alt="img">
                            <span>You</span>
                    </div>
                </a>
                <br>
                <small>${new Date(post.createdAt).toString().substring(4,16)} at ${new Date(post.createdAt).toString().substring(16, 21)}</small>
            </div>

            <span class="post-comment-more-icon" id="post-comment-more-icon-${post._id}">
                <i class="fas fa-ellipsis-h"></i>
            </span>

            <span class="post-comment-close-icon" id="post-comment-close-icon-${post._id}">
                <i class="far fa-times-circle"></i>
            </span>

            <ul class="post-comment-more-options animate__animated animate__flipInX" id="post-comment-more-options-${post._id}">
                 <!-- Delete a post -->
                <a class="delete-post-button" href="/posts/destroy/${post._id}">
                    <li>Delete Post</li>
                </a>
            </ul>
        </div>

        <div class="post-content">
            ${post.content}
        </div>
        
        ${post.postPath ? 
            `<div class="post-image-video">
                ${post.mediaType == 'video' ? `<video class="post-video" src="${post.postPath}" controls onerror="this.onerror=null;this.style='display:none';"></video>`
                                            : `<img class="post-image" src="${post.postPath}" onload="this.style='opacity:1';" onerror="this.onerror=null;this.style='display:none';">`
                }
                <div class="post-image-video-loading loadingio-spinner-eclipse-8jfbkc15oik"><div class="ldio-zwmxbg1ll"><div></div></div></div>
            </div>`
            : ``
        }
        

        <div class="user-controls">
             <!-- Display the likes of this post, if the user is logged in, then show the link to toggle likes, else, just show the count -->
            <div class="likes-container">
                <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">
                    <div class="likes-count">
                        ${post.likes.length}
                        <i class="far fa-thumbs-up"></i> Likes 
                    </div>
                </a>
            </div>

            <div class="comments-container" id="comments-container-${post._id}" data-closed="true">
                <div class="comments-count">
                    <span>${post.comments.length}</span>
                    <span>
                        <i class="fas fa-comment-alt"></i> Comments 
                        <i class="fas fa-caret-down"></i>
                    </span>
                </div>
            </div>
        </div>


        <div class="post-comments" id="post-comments-${post._id}">
                <!-- let's give an id to the new comment form, we'll also need to make the same changes in home_posts.js where we're adding a post to the page -->
                <form id="post-${post._id}-comments-form" action="/comments/create" method="POST" autocomplete="off">
                    <textarea type="text" name="content" placeholder="Type Here to add comment..." required></textarea>
                    <input type="hidden" name="post" value="${post._id}" >
                    <input type="submit" value="Comment">
                </form>
            
            <div class="post-comments-list">
                <div id="post-comments-list-${post._id}">
                    
                </div>
            </div>
        </div>
       

    </div>
        `)

        // Insert the image of the user and then return the dom Element
        $(' .user-name-pic img', newPost).attr('src', $('#nav-avatar').attr('src'));

        return newPost;
    }

    // Method to validate whether right file is choosen or not
    let validatePostExtension = function(formElement){
        var file = $(' input[type=file]', formElement);
        // var fileExtension = file.val().split('.').pop();
        // console.log("File type is : ", file.val(), fileExtension);

        var allowedExtensions = /(\.jpeg|\.JPEG|\.jpg|\.JPG|\.gif|\.GIF|\.png|\.PNG|\.svg|\.SVG|\.mp4|\.MP4)$/;
        if (file.val() != "" && !allowedExtensions.exec(file.val())) {
            alert('Invalid file selected Only upload image/ gif/ mp4 videos');
            file.val("");
            return false;
        }

        return true;
    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){  // Even this works -->> deleteLink.click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
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



    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container .post-list').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            // console.log("#######", deleteButton);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1];
            new PostComments(postId);
        });
    }



    
    createPost();
    convertPostsToAjax();


    
}