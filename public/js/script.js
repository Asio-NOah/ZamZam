/* Header hide and show on scroll */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navBar").style.top = "0";
  } else {
    document.getElementById("navBar").style.top = "-60px";
  }
  prevScrollpos = currentScrollPos;
}

/* Menu icon */
function myFunction(x) {
    x.classList.toggle("change");
  }

  document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container.nav-menu');
    const menu = document.querySelector('.menu');
  
    container.addEventListener('click', function() {
      container.classList.toggle('active');
      menu.classList.toggle('active');
    });
});

/* add active to active link */
document.addEventListener('DOMContentLoaded', function () {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(function (link) {
      const linkPath = link.getAttribute('href');

      // Check if the link's href matches the current page's path
      if (linkPath === currentPath) {
          link.classList.add('active');
      }
  });
});


  /* Removing navbar */
const menuItems = document.querySelectorAll('.nav-bar ul li a');
menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

/* Removing submenu */
const submenuItems = document.querySelectorAll('.nav-bar ul li ul li a');
submenuItems.forEach((submenuItem) => {
    submenuItem.addEventListener('click', () => {
        // Remove the active class from the navbar when a menu item is clicked
        navbar.classList.remove('remove');
    });
});


/* Search input */
function showSearchInput() {
    var searchInput = document.getElementById("searchInput");
    searchInput.style.display = searchInput.style.display === "none" ? "block" : "none";
}

function showSearchInput() {
  var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
}


/* booking form hide or show */
function showBooking() {
    var bookingData = document.getElementById("bookingData");
    bookingData.style.display = bookingData.style.display === "none" ? "block" : "none";
}



/* Booking Data Appear and Disappear */
function showContent(sectionId) {
    
    // Get all content sections
    var contentSections = document.querySelectorAll(".content-section");
  
    // Show or hide each content section based on the sectionId
    contentSections.forEach(function (section) {
      if (section.id === sectionId) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });
  }
  

  /* Booking Menu when active */
  document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.menu-link');

    menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Remove 'active' class from all links and add it to the clicked link
            menuLinks.forEach(function (menuLink) {
                menuLink.classList.remove('on-show');
            });
            this.classList.add('on-show');
        });
    });
});

  



