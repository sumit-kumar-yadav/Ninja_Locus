
// Handle the click event of tabs
let profileTabs = $('#profile-tab-section .profile-tabs');
profileTabs.each(function(){
    let tab = $(this);
    tab.click(function(e){
        showClickedProfileTab($(this), profileTabs);
    });
});
function showClickedProfileTab(tab, profileTabs){
    // Remove the active class from all the tabs
    profileTabs.each(function(){
        // mark this not active
        $(this).removeClass('active');
        // Hide this tabs content
        let displayId = $(this).attr('data-display-id');
        $(`#${displayId}`).hide();
    });

    // Add the active class to the current element
    tab.addClass('active');
    // Show this tabs content
    let displayId = tab.attr('data-display-id');
    $(`#${displayId}`).show();

    fetchData(displayId);
}
function fetchData(displayId){
    let displayContainer = $(`#${displayId}`);
    let visited = displayContainer.attr('data-visited');

    if(visited == 'false'){
        // Mark it as visited
        displayContainer.attr('data-visited', 'true');

        if(displayId == 'profile-user-posts'){
            console.log("Visilbe section is : ", displayId);
        }else if(displayId == 'profile-user-about'){
            console.log("Visilbe section is : ", displayId);
        }else if(displayId == 'profile-user-friends'){
            console.log("Visilbe section is : ", displayId);
            fetchAllFriends(displayId);
        }else if(displayId == 'profile-user-edit'){
            console.log("Visilbe section is : ", displayId);
            getJsonData();
        }
    }

    
}

// This function will be called on loading the file
function getJsonData(){
    // Get the json data from our server
    $.getJSON('/json/indianStates.json',function(data){
        $.each(data, function(key,value) {
            // console.log(`key is: ${key}, value is: ${value}`);
            // console.log(result);
            $('#state').append($(`<option value="${value}">${value}</option>`));
        });
    });

    // When state is changed. Fill new stae cities
    $("#state").change(function(){
        let state = $(this).val();
        $.getJSON('/json/indianCities.json', function(data){
            // Remove the cities which are already present then append the new cities
            $('.cities').remove();
            $.each(data, function(key,value) {
                if(state == key){ // If state selected is matched with key 
                    // Append all the cities of state (which are in value) in the id #city
                    for(let city of value){
                        $('#city').append($(`<option class="cities" value="${city}">${city}</option>`));
                    }
                    // break;
                }
            });
        })
    })
}

function fetchAllFriends(displayId){
    let displayContainer = $(`#${displayId}`);
    let profileUserId = displayContainer.attr('data-userId');
    console.log("make an ajax call to fetch all the friends", profileUserId);

    $.ajax({
        type: 'get',
        url: `/friendship/getFriends/${profileUserId}`,
        success: function(data){
            console.log("data fetched in fetching friends : ", data);
            
            for(let friend of data.data.friends){
                if(friend.from_user._id == profileUserId){
                    // Then friend details are in to_user id
                    displayContainer.append(friend.to_user.name);
                }else{
                    // Friend details are in from_user id 
                    displayContainer.append(friend.from_user.name);
                }
            }
        },
        error: function(error){
            console.log(error.responseText);
        }
    });
}