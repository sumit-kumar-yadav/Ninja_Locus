{
    // Handle multiline PostComments 
    function handleMultilineTextAreaInput(textarea){
        // To keep the functionality of tab
        $(textarea).keydown(function(e){
            let target = e.target;
            let value = target.value;

            if(e.keyCode === 9) { // tab was pressed
                // prevent the focus lose
                e.preventDefault();

                // get caret position/selection
                var start = this.selectionStart;
                var end = this.selectionEnd;

                // set textarea value to: text before caret + tab + text after caret
                target.value = value.substring(0, start)
                            + "\t"
                            + value.substring(end);

                // put caret at right position again (add one for the tab)
                this.selectionStart = this.selectionEnd = start + 1;

            }
        });

        // To increase the textarea when input text grows automatically
        $(textarea).on("input", function () {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        });
    }
    // Loop over all the available textArea and call handleMultilineTextAreaInput 
    $('textarea').each(function(){
        handleMultilineTextAreaInput($(this));
    });
 
    // Show the comments section if comment is clicked
    function toggleCommentSection(commentSection){
        commentSection.click(function(e){
            // if Comment box is closed
            if(commentSection.attr('data-closed') == "true"){
                // Rotate up the dropdown icon
                $(' .fa-caret-down', commentSection).css({
                    "transform": "rotateX(180deg)"
                })

                // get the unique post id
                let postId = commentSection.prop('id').split("-")[2];
                // Get the post.user._id  (poster id)
                let posterId = commentSection.attr('data-posterId');

                // Set the max-height
                $(`#post-comments-${postId}`).css({
                    "max-height": "1000px"
                });

                let commentLoadingContainer = $(`#post-comments-list-${postId}`);

                // If comment's data is not fetched yet
                let dataFetched = commentSection.attr('data-fetched');
                if(dataFetched == 'false'){
                    // Show loading of comments 
                    $(` .comment-loading-animation`, commentLoadingContainer).css("display", "flex");

                    // Make ajax call to fetch all the comments 
                    $.ajax({
                        type: 'get',
                        url: `/comments/fetch/?postId=${postId}`,
                        // data: $(self).serialize(),
                        success: function(data){
                            // Hide loading of comments 
                            $(` .comment-loading-animation`, commentLoadingContainer).css("display", "none");

                            // If commets are present 
                            if(data.data.comment && data.data.comment.length > 0){
                                // Loop over the comments and append it in the post 
                                for(let comment of data.data.comment){
                                    let preparedComment = prepareComments(comment, data.data.loggedInUserId, posterId);
                                    commentLoadingContainer.append(preparedComment);

                                    // Add event listerners on the new fetched comments
                                    showPostCommentMoreOption($(`#post-comment-more-icon-${comment._id}`));
                                     // Enable the functionality of the toggle like button on the new comment
                                    new ToggleLike($(' .toggle-like-button', preparedComment));
                                    // To make ajax call to delete the fetched comments (this function is inside the home_post_comments.js outside the class)
                                    deleteCommentAjax($(' .delete-comment-button', preparedComment));
                                }

                                // Scroll at the bottom of the comment
                                scrollToBottomOfComment(commentLoadingContainer.parent()[0]);
                                
                            }else{
                                console.log("No comments found");
                            }

                            // Set that data is fetched
                            commentSection.attr('data-fetched', 'true');
                        },
                        error: function(error){
                            console.log(error.responseText);
                        }
                    });
                }

                // set data-closed as false
                commentSection.attr('data-closed', "false");

                // Scroll at the bottom of the comment
                scrollToBottomOfComment(commentLoadingContainer.parent()[0]);

            }else{  // Comment box is opened

                // Rotate down the dropdown icon
                $(' .fa-caret-down', commentSection).css({
                    "transform": "rotateX(0deg)"
                })

                // get the unique post id
                let postId = commentSection.prop('id').split("-")[2];
                
                // Collapse the comment section
                $(`#post-comments-${postId}`).css({
                    "max-height": "0px"
                });

                // set data-closed as true
                commentSection.attr('data-closed', "true");
            }

        });
    }
    $('.comments-container').each(function(){
        let self = $(this);
        toggleCommentSection(self);
    });

    function scrollToBottomOfComment(container){
        // Commented as for now
        // container.scrollTop = (container.scrollHeight - container.clientHeight);
    }

    function showPostCommentMoreOption(icon){
        // console.log("icon is: ", icon)
        icon.click(function(e){
            // Hide the more icon
            icon.css({
                "background-color": "grey",
                "display": "none"
            });

            // Get the post or comment id and open the option lists
            let Id = icon.prop('id').split('-')[4];
            $(`#post-comment-more-options-${Id}`).css({
                "display": "block"
            });
            // Show the close icon
            $(`#post-comment-close-icon-${Id}`).css({
                "display": "initial"
            });
        });
    }
    // Show more options when clicked
    $('.post-comment-more-icon').each(function(){
        let self = $(this);
        showPostCommentMoreOption(self);
    });

    // Close more options when clicked outside the container
    function closePostCommentMoreOption(){
        $(document).mouseup(function (e) {
            if ($(e.target).closest(".post-comment-more-options").length
                        === 0) {
                $(".post-comment-more-options").hide();
                $('.post-comment-more-icon').css({
                    "background-color": "initial",
                    "display": "initial"
                });
                // Hide the close icon
                $(`.post-comment-close-icon`).css({
                    "display": "none"
                });
            }
        });
    }
    closePostCommentMoreOption();

    // Fetch all the comments (called within the ajax of toggleCommentSection function)
    function prepareComments(comment, loggedInUserId, posterId){
        return $(`
        <div id="comment-${comment._id}" class="comment-list-container">
            <div class="comment-user-info">
                <div class="user-comment-details">
                    <a href="/users/profile/${comment.user._id}">
                        <div class="comment-user-name-pic">
                            <img src="${comment.user.avatar}" alt="img" onerror="this.onerror=null;this.src='/images/Users-avatar.png';">
                            ${loggedInUserId == comment.user._id
                                ? `<span>You</span>`
                                : `<span>${comment.user.name}</span>`
                            }
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
                    ${loggedInUserId == comment.user._id || loggedInUserId == posterId
                        ? `<a class="delete-comment-button" href="/comments/destroy/?id=${comment._id}&post_user_id=${posterId}">
                                <li>Delete Comment</li>
                            </a>`
                        :  `<a href="/users/profile/${comment.user._id}">
                                <li>View Profile</li>
                            </a>
                            <a href="/">
                                <li>Report Comment</li>
                            </a>`
                    }
                </ul>
            </div>

            <div class="comment-content">
                ${comment.content}
            </div>

            <div class="comment-user-controls">
                <!-- Display the likes of this comment, if the user is logged in, then show the link to toggle likes, else, just show the count -->
                <div class="comment-likes-container">
                ${loggedInUserId
                ? `
                    <a class="toggle-like-button" data-likes="${comment.likes.length}" href="/likes/toggle/?id=${comment._id}&type=Comment">
                        <div class="likes-count">
                            <span>${comment.likes.length}</span>
                            <span>
                                <i class="far fa-thumbs-up"></i>
                                <span style="color: blue;">Likes</span>
                            </span> 
                        </div>
                    </a>
                `
                : `
                    <div class="likes-count">
                        <span>${comment.likes.length}</span>
                        <span>
                            <i class="far fa-thumbs-up"></i>
                            <span style="color: blue;">Likes</span>
                        </span>
                    </div>
                `
                }
                </div>
            </div>

        </div>   
        `)
    }

    // Lazy loading of post's images and videos
    (function lazyLoadingOfPostImageVideo() {

        // If IntersectionObserver is working fine in the user's vrowser
        if ("IntersectionObserver" in window) {
            // Fetch all the img and video tags to be lazy loaded
            let lazyloadElements = document.querySelectorAll(".post-list [data-src]");

            let options = {
                root: document.getElementById('feed-posts'),    // Scrollable element
                // threshold: 0,
                rootMargin: "400px"      // Start Observing before 400px
            };
            // Create IntersectionObserver API
            let imageVideoObserver = new IntersectionObserver(function(entries, imageVideoObserver) {
                entries.forEach(function(entry) {
                    // If it's entering the the viewport, then add src and unobserve them
                    if (entry.isIntersecting) {    // Here isIntersecting means entering the viewport either from top or bottom (Note: only entering, not leaving)
                        let imageOrVideo = entry.target;
                        // console.log("imageOrVideo is: ", imageOrVideo);

                        // Set the src from the data-src 
                        imageOrVideo.src = imageOrVideo.dataset.src;
                        imageVideoObserver.unobserve(imageOrVideo);
                    }
                });
            }, options);
        
            // Loop over all teh fetched elements to be observed
            lazyloadElements.forEach(function(imageOrVideo) {
                imageVideoObserver.observe(imageOrVideo);
            });
        }
        else{

            var lazyloadThrottleTimeout;
            
            function lazyload () {
                console.log("Called");
                if(lazyloadThrottleTimeout) {
                    clearTimeout(lazyloadThrottleTimeout);
                }    

                lazyloadThrottleTimeout = setTimeout(function() {
                    let lazyloadElements = document.querySelectorAll(".post-list [data-src]");
                    
                    lazyloadElements.forEach(function(imageOrVideo) {
                        let coordinates = imageOrVideo.getBoundingClientRect();
                        if(coordinates.top <= window.innerHeight + 400) {
                             // Set the src from the data-src 
                            imageOrVideo.src = imageOrVideo.dataset.src;
                            imageOrVideo.removeAttribute('data-src');   // Remove it so that it won't be called again
                        }
                    });

                    if(lazyloadElements.length == 0) { 
                        console.log("All are visited")
                        // Remove the event Listeners
                        $('#feed-posts').off('scroll', lazyload);
                        $('#feed-posts').off('resize', lazyload);
                        $('#feed-posts').off('orientationchange', lazyload);
                    }
                }, 20);
            }
            // Call it to load the already visible images / videos 
            lazyload();

            // Add event listener
            $('#feed-posts').on('scroll resize orientationchange', lazyload);

        }

    })();
    
}
