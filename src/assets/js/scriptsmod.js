function myFunction(x) {
  if (x.matches) { // If media query matches
   

    window.addEventListener("load", function () {
      document.getElementById("body_general").classList.add('sidebar-collapse');
      console.log("ES UN IPAD ");
      document.getElementById("ham").hidden = true;
     
    });

      

   
  } else {

  }
}

var x = window.matchMedia("(max-width: 1024px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes
