class Friendship{constructor(e){this.friendId=e,this.friendElement=$("#friend-"+this.friendId),this.deleteLink=$(" .remove-friend-button",this.friendElement),this.deleteFriend()}deleteFriend(){let e=this;$(this.deleteLink).click((function(n){n.preventDefault(),console.log($(e.deleteLink)),$.ajax({type:"get",url:$(e.deleteLink).prop("href"),success:function(n){$(e.friendElement).remove(),console.log("Successfully deleted")},error:function(e){console.log(e.responseText)}})}))}}$(".friends-of-user").each((function(){let e=$(this).prop("id").split("-")[1];new Friendship(e)}));