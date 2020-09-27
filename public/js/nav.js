document.addEventListener("DOMContentLoaded", function() {
    //Activate sidebar navigation
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    //Define load navigation function
    function loadNav() {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                //Loading linked list menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                //Register event listener for each linked menu item
                document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
                    elm.addEventListener("click", function(event) {
                        //Get side navigation closed right after it get clicked
                        const sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        //Load the content page for each clicked menu item navigation
                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });
                });
            }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    // Load page content
    let page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);

    //Define load page function for each menu item clicked
    function loadPage(page) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
            var content = document.querySelector("#body-content");

            if (page === "home") {
                getLeague();
                getTeams();
            } else if (page === "likes") {
                getLikedTeams();
            } else if (page === "match") {
                getFinishedMatches();
                getScheduledMatches();
            }

            if (this.status == 200) {
                content.innerHTML = xhttp.responseText;
                content.append = eval($('.tabs').tabs());
            } else if (this.status == 404) {
                content.innerHTML = "<p>Can't find the page.</p>";
            } else {
                content.innerHTML = "<p>Oops...Something went wrong, can't access the page.</p>";
            }
            }
        };
        
        xhttp.open("GET", `pages/${page}.html`, true);
        xhttp.send();
    }
});