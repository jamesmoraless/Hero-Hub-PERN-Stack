fetchListNames();

function fetchListNames() {
    fetch('/api/all-superhero-lists')
        .then(response => response.json())
        .then(listNames => {
            populateListSelector(listNames);
        })
        .catch(error => {
            console.error('Error fetching list names:', error);
        });
}

function fetchHeroInformation(id) {
    return fetch(`/api/superhero/${id}`)
        .then(response => response.json());
}

function fetchHeroPowers(id) {
    return fetch(`/api/powers/${id}`)
        .then(response => response.json());
}

function fetchPublishers(){
    fetch('/api/publishers').then(response => response.json()).then(data => {
        displayPublishers(data.publishers);
    }).catch(err => {
        console.log('Could not retrieve publishers:', err);
    })
}

function populateListSelector(listNames) {
    const viewListSelector = document.getElementById('viewListSelector');
    const editListSelector = document.getElementById('editListSelector');
    const deleteListSelector = document.getElementById('deleteListSelector');

    [viewListSelector, editListSelector, deleteListSelector].forEach(selector => {
        selector.innerHTML = ''; // Clear previous options
        listNames.forEach(name => {
            let option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            selector.appendChild(option);
        });
    });
}

function doesListNameExist(listName) {
    const editListSelector = document.getElementById("editListSelector");
    const options = Array.from(editListSelector.options);
    return options.some(option => option.value === listName);
}

    //Handle the search by name, race, publisher or powers with "n" as the number of results to search for
    document.getElementById('searchButton').addEventListener('click', function(event) {
        event.preventDefault();    
        const name = document.getElementById('name').value;
        const race = document.getElementById('race').value;
        const publisher = document.getElementById('publisher').value;
        const power = document.getElementById('power').value;
        const numResults = document.getElementById('numResults').value;
        

        fetch(`/api/search?name=${encodeURIComponent(name)}&race=${encodeURIComponent(race)}&publisher=${encodeURIComponent(publisher)}&power=${encodeURIComponent(power)}&n=${encodeURIComponent(numResults)}`)
            .then(response => response.json())
            .then(data => { 
                displaySuperHeroes(data);
            })
            .catch(error => console.error('Error:', error));
    });

    //Handle the create list form submission
    document.getElementById('createListForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const listName = document.getElementById('listName').value.trim();
        const selectedHeroIDs = Array.from(document.getElementById('superheroes').selectedOptions)
        .map(option => parseInt(option.value, 10));

        // Check if list name already exists
        if (doesListNameExist(listName)) {
            alert("List name already exists. Please use a different name.");
            return;
        }

        const payload = { 
            listName: document.getElementById('listName').value, 
            superheroIds: JSON.stringify(selectedHeroIDs)
        };
        
        //Simple validation
        if (!listName) {
            alert("Please enter a list name.");
            return;
        }

        if (selectedHeroIDs.length === 0) {
            alert("Please select at least one superhero ID.");
            return;
        }

        //API call to create the list
        fetch('/api/superhero-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            alert("List created successfully!");
            fetchListNames();//refetch list names from the backend 
        })
        .catch(error => {
            console.error('Error creating the list:', error);
            alert("Error creating the list.");
        });
    });

    //Handle showing list details from a list name 
    document.getElementById('showListButton').addEventListener('click', function() {
        const listName = document.getElementById('viewListSelector').value;
    
        fetch(`/api/superhero-list-all/${encodeURIComponent(listName)}`)//
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayListDetails(data.heroes);
        })
        .catch(error => {
            console.error('Error fetching list details:', error);
        });
    });

    //Handle updating list form from a selected list Name and updated list values
    document.getElementById("updateList").addEventListener("click", () => {
        const listName = document.getElementById("editListSelector").value;
        updateSuperheroList(listName);
    });

    document.getElementById('deleteListButton').addEventListener('click', () => {
        const listName = document.getElementById('deleteListSelector').value;
    
        if (!listName) {
            alert("Please select a list to delete.");
            return;
        }
    
        if (confirm(`Are you sure you want to delete the list "${listName}"?`)) {
            deleteSuperheroList(listName);
        }
    });
    
    function deleteSuperheroList(listName) {
        fetch(`/api/superhero-list/${encodeURIComponent(listName)}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            alert("List deleted successfully!");
            fetchListNames(); // Refetch list names to update the dropdowns
        })
        .catch(error => {
            console.error('Error deleting the list:', error);
            alert("Error deleting the list.");
        });
    }
    
    //computes the updating and fetching of data
    function updateSuperheroList(listName) {
        const selectedHeroIDs = Array.from(document.getElementById('superheroesSelect').selectedOptions)
        .map(option => parseInt(option.value, 10));

        const payload = { 
            superheroIds: JSON.stringify(selectedHeroIDs)
        };
        
        //Simple validation
        if (!listName) {
            alert("Please select a list name.");
            return;
        }

        if (selectedHeroIDs.length === 0) {
            alert("Please select at least one superhero ID.");
            return;
        }
    
        fetch(`/api/superhero-list/${encodeURIComponent(listName)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            alert("List updated successfully!");
            fetchListNames();//refetch list names from the backend
        })
        .catch(error => {
            console.error('Error creating the list:', error);
            alert("Error creating the list.");
        });
    }
    
    function displayListDetails(heroes) {//used to show from a list name 
        const detailsContainer = document.getElementById('listDetails');
        detailsContainer.innerHTML = ''; //Clear previous details

        if (heroes.length === 0) {
            detailsContainer.innerHTML = '<p>No heroes found in this list.</p>';
            return;
        }
    
        heroes.forEach(hero => {
            const heroElement = document.createElement('div');
            heroElement.innerHTML = `
            <h3>${hero.name} (ID: ${hero.id})</h3>
            <p>Race: ${hero.Race}</p>
            <p>Publisher: ${hero.Publisher}</p>
            <p>Powers: ${hero.powers.join(', ')}</p>
            <p>Gender: ${hero.Gender}</p>
            <p>Eye Color: ${hero['Eye color']}</p>
            <p>Height: ${hero.Height}</p>
            <p>Skin Color: ${hero['Skin color']}</p>
            <p>Weight: ${hero.Weight}</p>
            <p>Hair Color: ${hero['Hair color']}</p>
            <p>Alignment: ${hero.Alignment}</p>
            `;
            detailsContainer.appendChild(heroElement);
        });
    }

    function displaySuperHeroes(ids) {//used to show from a random search with id's
        let existingResults = document.getElementById('rslt');
        if (existingResults) {
            existingResults.remove();
        }
    
        //Create new results div
        let resultsDiv = document.createElement("div");
        resultsDiv.setAttribute("class", "results");
        resultsDiv.setAttribute("id", "rslt");

        let task1Div = document.getElementById('task1');
        task1Div.appendChild(resultsDiv);

        ids.forEach(id => {
            Promise.all([fetchHeroInformation(id), fetchHeroPowers(id)])
                .then(([info, powersData]) => {
                    //Combine the info and powers into a single object
                    let superheroData = { ...info, powers: powersData.powers };
    
                    //Create the superhero element with all the details
                    let superheroElement = createSuperheroElement(id, superheroData);
                    resultsDiv.appendChild(superheroElement);
                })
                .catch(error => {
                    console.error('Error fetching details for superhero ID:', id, error);
                    resultsDiv.innerHTML += `<p>Error loading details for superhero ID: ${id}</p>`;
                });
        });
    }

    function createSuperheroElement(id, superheroData) {//used to streamline the creation of a hero  
        // Creating an element to display all details of a superhero
        let superheroElement = document.createElement('div');
        superheroElement.innerHTML = `
            <h3>${superheroData.name} (ID: ${id})</h3>
            <p>Race: ${superheroData.Race}</p>
            <p>Publisher: ${superheroData.Publisher}</p>
            <p>Powers: ${superheroData.powers.join(', ')}</p>
            <p>Gender: ${superheroData.Gender}</p>
            <p>Eye Color: ${superheroData['Eye color']}</p>
            <p>Height: ${superheroData.Height}</p>
            <p>Skin Color: ${superheroData['Skin color']}</p>
            <p>Weight: ${superheroData.Weight}</p>
            <p>Hair Color: ${superheroData['Hair color']}</p>
            <p>Alignment: ${superheroData.Alignment}</p>
        `;
        return superheroElement;
    }
    //////////////////////////////////////////////////////////

function displayPublishers(publishers){
    const existingPublisherResults = document.getElementById('publisherResults');
    if (existingPublisherResults) {
        existingPublisherResults.remove();
    }

     //Create the new div
     let publisherDiv = document.createElement("div");
     publisherDiv.setAttribute("id", "publisherResults");
     
     //Append the unordered list to this div
     let unorderedList = document.createElement("ul");
     unorderedList.setAttribute("class", "publisher-list");
     publisherDiv.appendChild(unorderedList);
 
     //Populate the unordered list with the publishers
     publishers.forEach(publisher => {
         let listItem = document.createElement('li');
         listItem.textContent = publisher;
         unorderedList.appendChild(listItem);
     });
 
     //Add the publisherDiv to publishersBox
     let publishersBox = document.getElementById('taskthree');
     publishersBox.appendChild(publisherDiv);
}

