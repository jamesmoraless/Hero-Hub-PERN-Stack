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

    // Handle the create list form submission
    document.getElementById('createListForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const listName = document.getElementById('listName').value.trim();
        const selectedHeroIDs = Array.from(document.getElementById('superheroes').selectedOptions)
        .map(option => parseInt(option.value, 10));

        const payload = { 
            listName: document.getElementById('listName').value, 
            superheroIds: JSON.stringify(selectedHeroIDs)
        };
        
        // Simple validation
        if (!listName) {
            alert("Please enter a list name.");
            return;
        }

        if (selectedHeroIDs.length === 0) {
            alert("Please select at least one superhero ID.");
            return;
        }

        // API call to create the list
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
        })
        .catch(error => {
            console.error('Error creating the list:', error);
            alert("Error creating the list.");
        });
    });

    function displaySuperHeroes(superheroes) {
        // Clear any previous results
        let existingResults = document.getElementById('rslt');
        if (existingResults) {
            existingResults.remove();
        }
    
        // Create new results div
        let resultsDiv = document.createElement("div");
        resultsDiv.setAttribute("class", "results");
        resultsDiv.setAttribute("id", "rslt");

        let task1Div = document.getElementById("task1");
        task1Div.appendChild(resultsDiv);        
    
        // Create an unordered list to hold all superheroes
        let unorderedList = document.createElement("ul");
        unorderedList.setAttribute("class", "ul-results");
        resultsDiv.appendChild(unorderedList);
    
        // Process each superhero
        superheroes.forEach(result => {
            const heroItem = createHeroListItem(result);
            heroItem.id = `hero-${result.id}`;//set the heroItem id to the result.id
            heroItem.classList.add('hero-item'); // Add class for styling
            unorderedList.appendChild(heroItem);

            fetchSuperheroPowers(result.id);
        });    
    }

    function createHeroListItem(result) {
        //Create list item for a single superhero
        let heroInfoDiv = document.createElement('div');
        heroInfoDiv.classList.add('hero-info');
    
        // Add superhero details
        const heroName = document.createElement('h2');
        heroName.textContent = result.name;
        heroInfoDiv.appendChild(heroName);
    
        const heroGender = document.createElement('p');
        heroGender.textContent = `Gender: ${result.Gender}`;
        heroInfoDiv.appendChild(heroGender);
    
        const heroEyeC = document.createElement('p');
        heroEyeC.textContent = `Eye Color: ${result['Eye color']}`;
        heroInfoDiv.appendChild(heroEyeC);
    
        const heroRace = document.createElement('p');
        heroRace.textContent = `Race: ${result.Race}`;
        heroInfoDiv.appendChild(heroRace);
    
        const heroHeight = document.createElement('p');
        heroHeight.textContent = `Height: ${result.Height}`;
        heroInfoDiv.appendChild(heroHeight);
    
        const heroSkinC = document.createElement('p');
        heroSkinC.textContent = `Skin Colour: ${result['Skin color']}`;
        heroInfoDiv.appendChild(heroSkinC);
    
        const heroWeight = document.createElement('p');
        heroWeight.textContent = `Weight: ${result.Weight}`;
        heroInfoDiv.appendChild(heroWeight);
    
        const heroHairC = document.createElement('p');
        heroHairC.textContent = `Hair Colour: ${result['Hair color']}`;
        heroInfoDiv.appendChild(heroHairC);
    
        const heroAlignment = document.createElement('p');
        heroAlignment.textContent = `Alignment: ${result.Alignment}`;
        heroInfoDiv.appendChild(heroAlignment);
    
        const heroPublisher = document.createElement('p');
        heroPublisher.textContent = `Publisher: ${result.Publisher}`;
        heroInfoDiv.appendChild(heroPublisher);

        const heroItem = document.createElement('li');
        heroItem.appendChild(heroInfoDiv); // Append heroInfoDiv to heroItem

        return heroItem;
    }

function fetchSuperheroInfo() {
    const id = document.getElementById('heroId').value;

    fetch(`/api/superhero/${id}`)
        .then(response => response.json())
        .then(data => {
            displaySuperHero(data);
        })
        .catch(error => {
            console.error('Error fetching superhero:', error);
        });
}


function fetchSuperheroPowers(id) {
    fetch(`/api/powers/${id}`)
        .then(response => response.json())
        .then(data => {
            displayPowers(id, data.powers);
        })
        .catch(error => {
            console.error('Error fetching superhero powers:', error);
        });
}

function displayPowers(id, powers) {
    const heroItem = document.getElementById(`hero-${id}`);
    // Clear any previous powers results
    if (!heroItem) {
        console.log("Superhero item not found.");
        return;
    }

    const powersDiv = document.createElement('div');
    powersDiv.classList.add('powers-list'); // Add class for styling

    const powersList = document.createElement('ul');

    // Create a list item for each power and append to the 'ul'
    powers.forEach(power => {
        const powerItem = document.createElement('li');
        powerItem.textContent = power;
        powersList.appendChild(powerItem);
    });
    const powersTitle = document.createElement('h3');
    powersTitle.textContent = "Powers";
    powersDiv.appendChild(powersTitle);
    powersDiv.appendChild(powersList);
    heroItem.appendChild(powersDiv);
}


/////////////////////////////////////////

function fetchPublishers(){
    fetch('/api/publishers').then(response => response.json()).then(data => {
        displayPublishers(data.publishers);
    }).catch(err => {
        console.log('Could not retrieve publishers:', err);
    })
}

function displayPublishers(publishers){
    const existingPublisherResults = document.getElementById('publisherResults');
    if (existingPublisherResults) {
        existingPublisherResults.remove();
    }

     // 2. Create the new div.
     let publisherDiv = document.createElement("div");
     publisherDiv.setAttribute("id", "publisherResults");
     
     // 3. Append the unordered list to this div.
     let unorderedList = document.createElement("ul");
     unorderedList.setAttribute("class", "publisher-list");
     publisherDiv.appendChild(unorderedList);
 
     // 4. Populate the unordered list with the publishers.
     publishers.forEach(publisher => {
         let listItem = document.createElement('li');
         listItem.textContent = publisher;
         unorderedList.appendChild(listItem);
     });
 
     // 5. Add the publisherDiv to publishersBox.
     let publishersBox = document.getElementById('taskthree');
     publishersBox.appendChild(publisherDiv);
}


function clearBox() {
    const parentDiv = document.querySelector('.parentDiv');
    const heroBox = document.querySelector('.heroBox');
    parentDiv.remove();
    heroBox.style.paddingBottom = '50vh';

}
