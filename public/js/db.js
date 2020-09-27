let dbPromised = idb.open("liga-sport", 1, function(upgradeDb) {
    let teamsObjectStore = upgradeDb.createObjectStore("teams", {
         keyPath: "id"
    });
    teamsObjectStore.createIndex("name", "name", { unique: false });
});

function addNewTeam (teamtoadd) {
    dbPromised
    .then(function (db) {
        let tx = db.transaction("teams", "readwrite");
        let store = tx.objectStore("teams");
        console.log(teamtoadd);
        store.add(teamtoadd);
        return tx.complete;
    })
    .then(function() {
        console.log("New Team has been added");
        M.toast({html: "New team has been added to your list."});
    });
}

function deleteTeam (id) {
    dbPromised
    .then(function (db) {
        let tx = db.transaction("teams", "readwrite");
        let store = tx.objectStore("teams");
        store.delete(id);
        return tx.complete;
    }).then(function() {
        console.log("team has been deleted");
        M.toast({html: "Team has been deleted."});
    });
}

function getAll() {
    return new Promise( (resolve, reject) => {
        dbPromised
        .then(db => {
            const tx = db.transaction("teams", "readonly");
            const store = tx.objectStore("teams");
            return store.getAll();
        })
        .then(teams => {
            resolve(teams);
        });
    });
}