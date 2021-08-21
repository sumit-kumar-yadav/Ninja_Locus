console.log("search engine file is loaded");

class searchEngine{
    constructor(){
        this.search = "";
        this.timer = null;
    }

    handleSearch = ()=>{
        console.log("input changed");
        // Fetch the searched user
        this.search = $('#search-bar-conatiner #search-bar input').val();
        let listOfUsers = $('#search-bar-conatiner ul');

        clearTimeout(this.timer);  // Clear the previous timeout running (useful if typing is fast)
        this.timer = setTimeout(() => {
            // If word length is greater then 1
            if(this.search.length > 1){
                // Ajax call to fill the lists
                $.ajax({
                    type: 'get',
                    url: '/search',
                    data: {name: this.search},
                    success: function(data){
                        let { searchedUsers } = data.data;
                        listOfUsers.html('');  // Empty the previous lists of users

                        // Fill the lists below search bar if users found
                        if(searchedUsers.length > 0){
                            searchedUsers.map((user)=>{
                                listOfUsers.append(`
                                <a href="/users/profile/${user._id}">
                                    <li>
                                            ${user.avatar ? `<img src="${user.avatar}" alt="image">`
                                                        : `<img src="images/Users-avatar.png" alt="image">` 
                                            }
                                            
                                            ${user.name}
                                        
                                    </li>
                                </a>
                                `)
                                return;
                            })

                        }else{
                            // Tell the user that user not found
                            listOfUsers.append(`
                                <a href="#">
                                    <li> No user found !!! </li>
                                </a>
                            `)
                        }
                    },
                    error: function(err){
                        console.log(error.responseText);
                    }
                });

            }else{
                // If search bar is empty or word length < 2 then remove all the appended lists
                listOfUsers.html('');
            }

        }, 300);
    }
}