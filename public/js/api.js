const base_url = "https://api.football-data.org/v2";
const competition_url = `${base_url}/competitions/2001`;
const standing_url = `${competition_url}/standings?standingType=TOTAL`;
const finishedMatch_url = `${competition_url}/matches?status=FINISHED`;
const scheduledMatch_url = `${competition_url}/matches?status=SCHEDULED`;
const fetch_headers = {
    headers: {
        'X-Auth-Token': 'a0cf3b9108b44b27bed1ec7357f33c48',
    }
};

//Define fetch respons status function
const status = (response) => {
    if (response.status !== 200) {
        console.log(`Error : ${response.status}`);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
};

//Define json parsing function
const json = (response) => {
    return response.json();
}

//Define error handling function
const error = (error) => {
    console.log(`Error : ${error}`);
}

//Define request function to get competition information
function getLeague() {

    if ("caches" in window) {
        caches.match(competition_url).then(response => {
            if (response) {
                response.json().then( data => {
                    displayLeague(data);
                })
            }
        })
    }

    fetch(competition_url, fetch_headers)
    .then(status)
    .then(json)
    .then(data => {
        displayLeague(data);
    })
    .catch(error);    
}

//Define request function to get list of all teams and its total score
function getTeams() {
    if ("caches" in window) {
        caches.match(standing_url).then(response => {
            if (response) {
                response.json().then(data => {
                    data.standings.forEach(group => {
                        displayGroup(group);
                    })
                })
            }
        })
    }
    fetch(standing_url, fetch_headers)
    .then(status)
    .then(json)
    .then(data => {
        data.standings.forEach(group => {
            displayGroup(group);
        });
    }) 
}

//Define request function to load the last 20 mathches finished
function getFinishedMatches() {
    if ("caches" in window) {
        caches.match(finishedMatch_url).then(response => {
            if (response) {
                response.json().then(data => {
                   displayFinishedMatch(data); 
                })
            }
        })
    }
    fetch(finishedMatch_url, fetch_headers)
    .then(status)
    .then(json)
    .then(data => {
        displayFinishedMatch(data);
    })
    .catch(error);  
}


//Define request function to load scheduled mathches
function getScheduledMatches() {
    if ("caches" in window) {
        caches.match(scheduledMatch_url).then(response => {
            if (response) {
                response.json().then(data => {
                   displayScheduledMatch(data);
                })
            }
        })
    }
    fetch(scheduledMatch_url, fetch_headers)
    .then(status)
    .then(json)
    .then(data => {
        displayScheduledMatch(data);
    })
    .catch(error);  
}

//Define request function to load team detail information by ID 

function getTeamById() {

    return new Promise(function(resolve, reject) {
        // Get query parameter (?id=)
        const urlTeams = new URLSearchParams(window.location.search);
        const idTeam = urlTeams.get("id");

        const team_url = `${base_url}/teams/${idTeam}`;

        if ("caches" in window) {
            caches.match(team_url).then(response => {
                if (response) {
                    response.json().then( team => {
                        displayTeam(team);

                        //send team data to database
                        resolve(team);
                    });
                }
            });
        }
    
        fetch(team_url, fetch_headers)
        .then(status)
        .then(json)
        .then(team => {
            displayTeam(team);

            //send team data to database
            resolve(team);
        });
    });
}

function displayLeague (data) {
    const leagueHTML = 
        `
        <div style="display: grid; grid-template-columns: 1fr 1fr;">
            <p class="z-depth-5">START DATE</p>
            <p class="z-depth-5">END DATE</p>
        </div>
        <div style="display: grid; grid-template-columns: 4fr 1fr 4fr; align-items: center;">
            <p>${data.currentSeason.startDate}</p>
            <p>:</p>
            <p>${data.currentSeason.endDate}</p>
        </div>
        `;
    document.getElementById("league-content").innerHTML = leagueHTML;
}


function displayGroup (group) {
    let GroupHTML = `
            <style>
                .teamBadge {
                    max-width: 100%;
                    height: 100px;
                }
                .teamDesc .col {
                    font-size: x-small;
                }
                a {
                    text-decoration: none;
                    color: black;
                }
                .card {
                    border-radius: 7px;
                }
                #team > p {
                    font-size: large;
                    font-weight: bold;
                }

            </style>
            `;

    group.table.forEach(team => {
        let badgeurl = team.team.crestUrl
        badgeurl = badgeurl.replace(/^http:\/\//i, 'https://');
        GroupHTML += `
        <div class="col s12 l6">
            <a href="/pages/team.html?id=${team.team.id}">
            <div class="card">
                <div class="row card-content">
                    <div class="col s3">
                        <img class="teamBadge" src="${badgeurl}" alt="" onerror="this.onerror=null;this.src='/img/teambadge.png';">
                    </div>
                    <div class="col s9" id="team">
                        <p>${team.team.name}</p>
                        <div class="row teamDesc">
                            <div class="col s2">
                                <p>Match</p>
                                <p>${team.playedGames}</p>
                            </div>
                            <div class="col s2">
                                <p>Won</p>
                                <p>${team.won}</p>
                            </div>
                                <div class="col s2">
                                <p>Lost</p>
                                <p>${team.lost}</p>
                            </div>
                            <div class="col s2">
                                <p>Draw</p>
                                <p>${team.draw}</p>
                            </div>
                            <div class="col s2">
                                <p>Goals</p>
                                <p>${team.goalsFor}</p>
                            </div>
                            <div class="col s2">
                                <p>Points</p>
                                <p>${team.points}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
        </div>
        `;
    });
    document.getElementById(`${group.group}`).innerHTML = GroupHTML;
}

function displayTeam (team) {

    let badgeurl = team.crestUrl
    badgeurl = badgeurl.replace(/^http:\/\//i, 'https://');

    let playerHTML = "";
        team.squad.forEach(player => {
            playerHTML += `
            <div class="col s6 m4 l3">
                        <div class="card">
                            <div class="row card-content">
                                <div class="col s4">
                                    <img src="../img/football-player.png" id="playerIcon" alt="">
                                </div>
                                <div class="col s8">
                                    <p><b>${player.name}</b></p>
                                    <p>${player.position}</p>
                                    <p>Nationality: ${player.nationality}</p>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
        });


        let TeamHTML = `
        <style>
            .card {
                border-radius: 5px;
                font-size: x-small;
            }
            #playerIcon {
                border-radius: 50%;
                width: 100%;
            }
        </style>
        <div class="container">
            <div class="col s12">
                <div class="row" style="text-align: center;">
                    <div class="col s4">
                        <div class="card">
                            <img class="card-content" src="${badgeurl}" alt="" onerror="this.onerror=null;this.src='../img/teambadge.png';" style="width: 100%;">
                        </div>
                    </div>
                    <div class="col s8">
                        <h4><b>${team.name}</b></h4>
                        <p>${team.area.name}</p>
                        <p>Venue: ${team.venue}</p>
                        <p>Founded in ${team.founded}</p>
                    </div>
                </div>
                <div class="row" style="text-align: center;">
                    <div class="col s6">
                        <p>${team.email}</p>
                        <p>${team.phone}</p>
                    </div>
                    <div class="col s6">
                        <p>Address: ${team.address}</p>
                    </div>
                </div>
                <div class="row" id="personContainer">
                    ${playerHTML}
                </div>
            </div>
        </div>
        `;

        document.getElementById("body-content").innerHTML = TeamHTML;
}

// Define function to display last 20th matches
function displayFinishedMatch(data) {
    const matches_ = data.matches;
    const lastMatchIndex = (matches_.length) - 1;
    const last20MatchIndex = lastMatchIndex - 20;
    const matches20 = matches_.slice(last20MatchIndex, lastMatchIndex);

    //Get match data for display
    let MatchesHTML = "";
    matches20.forEach(function (match) {

        const winner = match.score.winner;

        function checkHomeWinner(param) {
            if(param == "HOME_TEAM") {
                return 'style="box-shadow: 0px 0px 20px 0px rgba(242,213,22,1) !important;"';
            } else {
                return ;
            }
        }

        function checkAwayWinner(param) {
            if(param == "AWAY_TEAM") {
                return 'style="box-shadow: 0px 0px 20px 0px rgba(242,213,22,1) !important;"';
            } else {
                return ;
            }
        }

        const homeShadow = checkHomeWinner(winner);
        const awayShadow = checkAwayWinner(winner);

        MatchesHTML += `
        <div class="col s12 m4 l3">
            <div class="card z-depth-5" style="padding-top: 5px;">
                <div class="row">
                    <div class="col s12">${match.stage}</div>
                    <div class="col s12">${match.utcDate}</div>
                    <div class="col s12">
                        <div class="row">
                            <div class="col s6">${match.homeTeam.name}</div>
                            <div class="col s6">${match.awayTeam.name}</div>
                        </div>
                    </div>
                    <div class="col s12">
                        <div class="row">
                            <div class="col s4">
                                <img src="/img/home-team.png" alt="" ${homeShadow}>
                            </div>
                            <div class="col s4" style="font-size: medium !important; font-weight: bold;"> ${match.score.fullTime.homeTeam} VS ${match.score.fullTime.awayTeam}</div>
                            <div class="col s4">
                                <img src="/img/away-team.png" alt="" ${awayShadow}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    document.getElementById("finished").innerHTML = MatchesHTML;
}

//Define request function to load upcoming scheduled matches
function displayScheduledMatch(data) {
    let MatchesHTML = "";
    
    data.matches.forEach(match => {
        MatchesHTML += `
        <div class="col s12 m4 l3">
            <div class="card z-depth-5" style="padding-top: 5px;">
                <div class="row">
                    <div class="col s12">${match.stage}</div>
                    <div class="col s12">${match.utcDate}</div>
                    <div class="col s12">
                        <div class="row">
                            <div class="col s6">${match.homeTeam.name}</div>
                            <div class="col s6">${match.awayTeam.name}</div>
                        </div>
                    </div>
                    <div class="col s12">
                        <div class="row">
                            <div class="col s5">
                                <img src="/img/home-team.png" alt="">
                            </div>
                            <div class="col s2" style="font-size: medium !important; font-weight: bold;">VS</div>
                            <div class="col s5">
                                <img src="/img/away-team.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    document.getElementById("upcoming").innerHTML = MatchesHTML;
}


//Define function to get saved teams
function getLikedTeams() {
    getAll().then(teams => {
        console.log(teams);

        let teamsHTML = "";

        teams.forEach(team => {
            teamsHTML += `
            <div class="col s6 m4 l3" id=${team.id}>
                <div class="row text-center">
                    <div class="col s12">
                        <p style="font-weight: bold;">${team.name}</p>
                    </div>
                    <div class="col s12">
                        <div class="card">
                            <div class="card-image">
                                <img src="${team.crestUrl}" alt="" onerror="this.onerror=null;this.src='../img/teambadge.png';">
                                <a id="delete" onclick="delButton(${team.id})" class="btn-floating halfway-fab waves-effect waves-light red darken-3"> X </a>
                            </div>
                        </div>
                    </div>
                    <div class="col s12">
                        <p>${team.shortName}</p>
                        <p>${team.area.name}</p>
                    </div>
                </div>
            </div>
            `;
        });
        console.log(teamsHTML);
        document.getElementById("likedTeams").innerHTML = teamsHTML;
    });
}

//Define function to delete team on likes list
function delButton(id) {
    deleteTeam(id);
    let card = document.getElementById(id);
    card.remove();
}