{
    // When avatar is clicked
    $('#nav-avatar').click(function(e){
        // Open the side menu of nav bar
        $('#nav-side-menu-list').css({
            right: '0px'
        });

         // Stop other pointer events of #layout-main
         $('#layout-main').css({
            "pointer-events": "none",
            "opacity": "0.4"
        })
    })

    // When #nav-side-menu-list-close is clicked
    $('#nav-side-menu-list-close').click(closeNavSideMenu);
    function closeNavSideMenu(){
        // Close the side menu of nav bar
        $('#nav-side-menu-list').css({
            right: '-400px'
        });

        // Start all pointer events of #layout-main
        $('#layout-main').css({
            "pointer-events": "initial",
            "opacity": "1"
        });
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

    // When feed posts list is licked fron the #nav-side-menu-list
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
}