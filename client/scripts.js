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

function displaySuperHero(rslt){
    const result = rslt;

    // Clear any previous results
    const existingResults = document.getElementById('rslt');
    if (existingResults) {
        existingResults.remove();
    }

    // Create div
    let parentDiv = document.createElement("div");
    parentDiv.setAttribute("class", "parentDiv");

    // Create div
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "results");
    newDiv.setAttribute("id", "rslt");
    parentDiv.appendChild(newDiv);

    adjustHeroBoxPadding() 


    let firstDiv = document.getElementById("bannerOne");
    document.body.insertBefore(parentDiv, firstDiv);

    let unorderedListTag = document.createElement("ul");
    unorderedListTag.setAttribute("class", "ul-results");
    newDiv.appendChild(unorderedListTag);

    // Create a list item for the superhero and append parts to it, then append the item to the 'ul'
    const heroItem = document.createElement('li');

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
    heroWeight.textContent = `Hair Colour: ${result.Weight}`;
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

    unorderedListTag.appendChild(heroItem);
    document.getElementById('powers-btn').disabled = false;
    document.getElementById('clear-btn').disabled = false;
}

function fetchSuperheroPowers() {
    const superheroId = document.getElementById('heroId').value;//make it a list with options 

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
