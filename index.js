//Header: Let user search for a recipe
    //create a button to generate a random recipe from the DB

//body: contains 3 panels: Left panel, Center panel, and Right panel
    //left panel: When user searc
        //Event Listener 'click': User clicks recipe result and it loads to showPanel

    //center panel - 
        //Event Listener DOMContentLoad: display top rate recipe to showPanel
        //comment&like section

    //Right Panel - when content loads, displays top 10 rated recipes

//Stretch Goal: create a local server to keep track of likes, comments, maybe user submitted recipes


//HEADER Functionality---------
document.addEventListener('DOMContentLoaded', ()=>{
    const dropDown = document.querySelector('#dropDown')
    const secondDropDown = document.querySelector('#secondaryDropDown')
    const searchInput = document.querySelector('#searchInput')
    const searchForm = document.querySelector('#searchForm')
    const resultsList = document.querySelector('#resultsList')
    const randomBtn = document.querySelector('#randomBtn')
    const showPanel = document.querySelector('#showPanel')

    function getSecondDropDownDetails(){
        getData(`https://www.themealdb.com/api/json/v1/1/list.php?${dropDown.value[0]}=list`)
        .then(data => {
            const chimi = 'str' + dropDown.value[0].toUpperCase() + dropDown.value.substring(1)
            data.meals.forEach(meal =>{
                secondDropDown.innerHTML += `<option value=${meal[chimi]}>${meal[chimi]}</option>`
            })
        })
    }
    function populateResultsToLeftPanel(){
        let searchOrFilter;
        let searchBy;
        if(dropDown.value === 'search'){
            searchOrFilter = "search"
            searchBy = searchInput.value
        }
        else if(dropDown.value === 'first letter'){
            searchOrFilter = "search"
            searchBy = secondDropDown.value
        }
        else if(dropDown.value === "ingredient"){
            searchOrFilter = "filter"
            searchBy = searchInput.value
        }
        else{
            searchOrFilter = "filter"
            searchBy = secondDropDown.value
        }
        const url = `https://www.themealdb.com/api/json/v1/1/${searchOrFilter}.php?${dropDown.value[0]}=${searchBy}`
        // console.log(url)
        getData(url)
        .then(data => {
            data.meals.forEach(meal =>{
                resultsList.innerHTML += `<li id="${meal.idMeal}"><a href="#">${meal.strMeal}</a></li>`
            })
        })
    }

        //User selects an option from the drop down menu
        //depending on option selected, either a text input field or a secondary drop down menu will appear
    dropDown.addEventListener('change', ()=>{
        if(dropDown.value === "search" || dropDown.value === "ingredient"){
            secondDropDown.innerHTML = ""
            searchInput.style.display = "inline-block" 
            secondDropDown.style.display = "none"    

        }else if(dropDown.value === 'area' || dropDown.value === 'category'){
            secondDropDown.innerHTML = ""
            searchInput.style.display = "none"
            secondDropDown.style.display = "inline-block"
            getSecondDropDownDetails()
        }else if(dropDown.value === "first letter"){
            secondDropDown.innerHTML =""
            const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
            searchInput.style.display = "none"
            secondDropDown.style.display = "inline-block"
            alphabet.forEach(letter =>{
                secondDropDown.innerHTML += `<option value=${letter}>${letter}</option>`
            })
        }
        else{
            secondDropDown.innerHTML = ""
            searchInput.style.display = "none"
            secondDropDown.style.display = "none"
        }
    })

        //User either fills out the text field or selects an option from the secondary drop down
        //add submit event listener for when search button is pushed
    searchForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        resultsList.innerHTML=""
        populateResultsToLeftPanel()
        searchForm.reset()
        searchInput.style.display = "none"
        secondDropDown.style.display = "none"
    })

        //Add Functionality to Random Button
    randomBtn.addEventListener('click', ()=>{
        getData('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(data => {
            //display data on showPanel
            console.log(data)
            displayOnShowPanel(data.meals[0])
        })
    })

        

})


// Functions that will most likely be used again
function getData(url){
    return fetch(url).then(res => res.json())
}
function displayOnShowPanel(mealObj){
    showPanel.innerHTML = `            
    <h1>${mealObj.strMeal}</h1>
    <h5 id="cuisine">Cuisine: ${mealObj.strArea}</h5>
    <h5 id="category">Category: ${mealObj.strCategory}</h5>
    <div>
    <p id="likes-note">LIKES: </p>        
    <img id="showImage" src="${mealObj.strMealThumb}" alt="">
    <h5>Ingredient List</h5>
    <ul id="ingredientList"></ul>
    <div id="recipeDiv"><h5>Recipe & Instructions</h5></div>
    `
    formatIngr(mealObj)
    formatRecipe(mealObj)
}
function formatIngr(mealObj){
    ingredientList.innerHTML = ""
    //Pull all keys from meal Array
    let objKeys = Object.keys(mealObj)
    for(let i=1; i<= 20; i++){
        if(objKeys.find(key => key === `strIngredient${i}`)){
            //create and add an LI for any key that doesnt have a null value
            if(mealObj[`strIngredient${i}`]){
                ingredientList.innerHTML += `<li>${mealObj[`strIngredient${i}`]} : ${mealObj[`strMeasure${i}`]}</li>`
            }    
        }
    }
} 
function formatRecipe(mealObj){
    let recipe = mealObj.strInstructions.split('. ')
    recipe.forEach(line =>{
        recipeDiv.innerHTML += `<p>${line}</p>`
    })
}