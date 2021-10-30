{
    // To keep the focus even if tab is pressed
    $('textarea').each(function(){
        
        // To keep the functionality of tab
        $(this).keydown(function(e){
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
        })

        // To increase the textarea when input text grows automatically
        $(this).on("input", function () {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        });
    })

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
                //get comments related to that post
                $(`#post-comments-${postId}`).css({
                    // "height": "auto",
                    "max-height": "1000px"
                    // "overflow-y": "scroll"
                });

                // set data-closed as false
                commentSection.attr('data-closed', "false");

            }else{  // Comment box is opened

                // Rotate down the dropdown icon
                $(' .fa-caret-down', commentSection).css({
                    "transform": "rotateX(0deg)"
                })

                // get the unique post id
                let postId = commentSection.prop('id').split("-")[2];
                //get comments related to that post
                $(`#post-comments-${postId}`).css({
                    // "height": "0px",
                    "max-height": "0px"
                    // "overflow-y": "hidden"
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
