{
    // Open the side menu of nav bar when avatar is clicked
    $('#nav-avatar').click(function(e){
        $('#nav-side-menu-list').css({
            right: '0px'
        });

        // $('dummy-body').css({
        //     display: block;
        // })
    })

    // Close the side menu of nav bar when #nav-side-menu-list-close is clicked
    $('#nav-side-menu-list-close').click(function(e){
        $('#nav-side-menu-list').css({
            right: '-400px'
        })
    })
}