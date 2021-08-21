
// get all the elements which use animate.css class in the welcome_page
var animationElements = document.querySelectorAll('#welcome-container .animate__animated');

var animationDone = [];  // Loop and initialse all the animationDone as false
for (let i = 0; i < animationElements.length; i++){
    animationDone[i] = false;
}

// When #layout-main is scrolled
document.getElementById('layout-main').addEventListener('scroll', function(e){
    console.log("scrolled");
    for (let i = 0; i < animationElements.length; i++){
        checkScroll(animationElements[i], i);
    }
});

// check and fire animation
function checkScroll(element, index){
    // Check whether skill container is visible or not
    let coordinates = element.getBoundingClientRect();
    if(!animationDone[index] && coordinates.top <= window.innerHeight){
        animationDone[index] = true;
        // console.log('animation of element', element);
        var className = element.getAttribute('data-anination-name');
        element.classList.add(className);
    }
    else if(coordinates.top > window.innerHeight){
        animationDone[index] = false;
        var className = element.getAttribute('data-anination-name');
        element.classList.remove(className);
        // console.log(coordinates.top , window.innerHeight);
    }
}


// When page is loaded the section which is visible on window should fire the animation
function fireAnimationOfAlreadyVisibleElements(){
    for (let i = 0; i < animationElements.length; i++){
        checkScroll(animationElements[i], i);
    }
}
fireAnimationOfAlreadyVisibleElements();