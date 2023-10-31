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
    
        let firstDiv = document.getElementById("bannerOne");
        document.body.insertBefore(resultsDiv, firstDiv);
    
        // Create an unordered list to hold all superheroes
        let unorderedList = document.createElement("ul");
        unorderedList.setAttribute("class", "ul-results");
        resultsDiv.appendChild(unorderedList);
    
        // Process each superhero
        superheroes.forEach(result => {
            const heroItem = createHeroListItem(result);
            unorderedList.appendChild(heroItem);
        });    
    }

    function createHeroListItem(result) {
        //Create list item for a single superhero
        let heroItem = document.createElement('li');
    
        // Add superhero details
        const heroName = document.createElement('h2');
        heroName.textContent = result.name;
        heroItem.appendChild(heroName);
    
        const heroGender = document.createElement('p');
        heroGender.textContent = `Gender: ${result.Gender}`;
        heroItem.appendChild(heroGender);
    
        const heroEyeC = document.createElement('p');
        heroEyeC.textContent = `Eye Color: ${result['Eye color']}`;
        heroItem.appendChild(heroEyeC);
    
        const heroRace = document.createElement('p');
        heroRace.textContent = `Race: ${result.Race}`;
        heroItem.appendChild(heroRace);
    
        const heroHeight = document.createElement('p');
        heroHeight.textContent = `Height: ${result.Height}`;
        heroItem.appendChild(heroHeight);
    
        const heroSkinC = document.createElement('p');
        heroSkinC.textContent = `Skin Colour: ${result['Skin color']}`;
        heroItem.appendChild(heroSkinC);
    
        const heroWeight = document.createElement('p');
        heroWeight.textContent = `Weight: ${result.Weight}`;
        heroItem.appendChild(heroWeight);
    
        const heroHairC = document.createElement('p');
        heroHairC.textContent = `Hair Colour: ${result['Hair color']}`;
        heroItem.appendChild(heroHairC);
    
        const heroAlignment = document.createElement('p');
        heroAlignment.textContent = `Alignment: ${result.Alignment}`;
        heroItem.appendChild(heroAlignment);
    
        const heroPublisher = document.createElement('h4');
        heroPublisher.textContent = `Publisher: ${result.Publisher}`;
        heroItem.appendChild(heroPublisher);
            
        return heroItem;
    }
    
///////////////////////////////////////////////////////////


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


function fetchSuperheroPowers() {
    const superheroId = document.getElementById('heroId').value;//get b 

    fetch(`/api/powers/${superheroId}`)
        .then(response => response.json())
        .then(data => {
            displayPowers(data.powers);
        })
        .catch(error => {
            console.error('Error fetching superhero powers:', error);
        });
}

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


function displayPowers(powersArr) {
    const powers = powersArr;
    // Clear any previous powers results
    const existingPowersResults = document.getElementById('powers-rslt');
    if (existingPowersResults) {
        existingPowersResults.remove();
    }

    // Create div for powers
    let powersDiv = document.createElement("div");
    powersDiv.setAttribute("class", "powers-results");
    powersDiv.setAttribute("id", "powers-rslt");

    // Place this new div next to the superhero results div
    let superheroDiv = document.getElementById("rslt");
    if(superheroDiv) {
        superheroDiv.appendChild(powersDiv);
    } else {
        document.body.appendChild(powersDiv);
    }

     // Create h2 for powers
     let powersTitle = document.createElement("h4");
     powersDiv.setAttribute("class", "powers-title");
     powersTitle.textContent = "Powers:";
     powersDiv.appendChild(powersTitle);

    let unorderedListTag = document.createElement("ul");
    unorderedListTag.setAttribute("class", "ul-powers-results");
    powersDiv.appendChild(unorderedListTag);


    // Create a list item for each power and append to the 'ul'
    powers.forEach(power => {
        const powerItem = document.createElement('li');
        powerItem.textContent = power;
        unorderedListTag.appendChild(powerItem);
    });
}

function adjustHeroBoxPadding() {
    const heroBox = document.querySelector('.heroBox');
    heroBox.style.paddingBottom = '0px';
}

function clearBox() {
    const parentDiv = document.querySelector('.parentDiv');
    const heroBox = document.querySelector('.heroBox');
    parentDiv.remove();
    heroBox.style.paddingBottom = '50vh';

}
