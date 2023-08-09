let temp;
let clickedItem;
let end;
var titles = JSON.parse(content_str)

const list = titles
const output = document.querySelector(".output");
const search = document.querySelector(".filter-input");
const nextButton = document.getElementById("nextButton");

window.addEventListener("DOMContentLoaded", loadList);
search.addEventListener("input", filter);


function loadList() {
    let temp = `<ul class="list-items">`;
    list.forEach((item) => {
        temp += `<li class="list-item"> <a onclick="handleItemClick(event)">${item['title']}  (${item['id']})</a> </li>`;
    });
    temp += `</ul>`;
    output.innerHTML = temp;
    output.addEventListener("click", handleItemClick);
}


function filter(e) {
    let temp = '';
    const result  = list.filter(item=> item['title'].toLowerCase().includes(e.target.value.toLowerCase()));
    if(result.length>0){
        temp = `<ul class="list-items">`;
        result.forEach((item) => {
            temp += `<li class="list-item"> <a onclick="handleItemClick(event)">${item['title']}  (${item['id']})</a> </li>`;
        });
        temp += `</ul>`;
    }else{
        temp =`<div class="no-item"> No Item Found </div>`;
    }
    output.innerHTML =temp;
    output.addEventListener("click", handleItemClick);
}


function handleItemClick(event) {
    temp = event.target.textContent;
    clickedItem = temp.trim().split(/\s{2}/);;
    console.log(`Clicked item: ${clickedItem}`);
    for (let i = 0; i < list.length; i++) {
        if (list[i]['id'] === clickedItem[1].substring(1, clickedItem[1].length - 1)) {
            end = list[i];
            console.log(end);
            break;
        }
    }
	
	// Create a new container element
    var newContainer = document.createElement('div');
    newContainer.className = 'new-container';

    // Create and append content to the new container
	const item = `Navigating to "${clickedItem[0]}"`
    var itemContent = document.createElement('p');
    itemContent.textContent = item;
    newContainer.appendChild(itemContent);

    // Create "Go to Next Page" button
    var nextPageButton = document.createElement('button');
    nextPageButton.textContent = 'Next';
    nextPageButton.addEventListener('click', navigateToNextPage);
    newContainer.appendChild(nextPageButton);

    // Get a reference to the existing container
    var existingContainer = document.querySelector('.container');

    // Replace the existing container with the new container
    if (existingContainer) {
        existingContainer.parentNode.replaceChild(newContainer, existingContainer);
    }
}


function navigateToNextPage() {
    window.location.href = 'page2.html';
}

