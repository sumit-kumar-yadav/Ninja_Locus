{
    // When avatar is clicked
    $('#nav-avatar').click(function(e){
        // Open the side menu of nav bar
        $('#nav-side-menu-list').css({
            'display': 'initial'
        });

        // Open the blur div (#blur-screen)
        $('#blur-screen').css('display', "initial");
    })

    // When #nav-side-menu-list-close is clicked
    $('#nav-side-menu-list-close').click(closeNavSideMenu);
    function closeNavSideMenu(){
        // Close the side menu of nav bar
        $('#nav-side-menu-list').css({
            'display': 'none'
        });

        // Close the blur div (#blur-screen)
        $('#blur-screen').css('display', "none");
    }
    

    // When Ninja list is licked fron the #nav-side-menu-list
    function openNinjaSectionOfHomePage(e){
        e.preventDefault();

        // Close the #feed-posts section
        $('#feed-posts').css({
            "display": "none"
        });
        
        closeNavSideMenu();

        // Open the #users-container section
        $('#users-container').css({
            "display": "initial"
        })
    }

    // When feed posts list is clicked fron the #nav-side-menu-list
    function openFeedPostsSectionOfHomePage(e){
        e.preventDefault();

        // Close the #feed-posts section
        $('#feed-posts').css({
            "display": "inherit"
        });
        
        closeNavSideMenu();

        // Open the #users-container section
        $('#users-container').css({
            "display": "none"
        })
    }

    // Common closing of element of header when out of focus
    (function closeElement(){
        $(document).mouseup(function (e) {
            // To close the searched users appearing in lists
            if ($(e.target).closest("#searched-users").length === 0 && $(e.target).closest("#search-bar").length === 0){
                searchEngineClass.setOriginal();  // From search_engine.js file
            }
        });
    })()
}