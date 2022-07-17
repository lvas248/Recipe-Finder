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
    const randomBtn = document.querySelector('#randomBtn')
    const resultsList = document.querySelector('#resultsList')


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
                resultsList.innerHTML += `<li data-id="${meal.idMeal}"><a href="#">${meal.strMeal}</a></li>`
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
            getSecondDropDownDetails()
            searchInput.style.display = "none"
            secondDropDown.style.display = "inline-block"
            
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
        document.querySelector('#leftPanel').style.display = "block"

    })

        //Add Functionality to Random Button
    randomBtn.addEventListener('click', ()=>{
        getData('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(data => {
            //display data on showPanel
            loadToShowPanel(data.meals[0])

        })
    })

        //Add functionality to 'Back to results' button
    document.querySelector('#backButton').addEventListener('click', ()=>{
        showLeftPanel()
    })
})

//Body
    //Left Panel Functionality
document.addEventListener('DOMContentLoaded',()=>{
        //When a result is clicked - show panel is loaded with meal details
    const leftPanel = document.querySelector('#leftPanel')
    const resultsList = document.querySelector('#resultsList')

    leftPanel.addEventListener('click', (e)=>{
       
        if(e.target.tagName === 'A'){
            const mealId = e.target.parentNode.dataset.id
            loadToShowPanelByMealId(mealId)
            hideLeftPanel()
        }
    })



        //Add functionaility to filter form - Submit Event that filters results based on user input keyword
    document.querySelector('#filterForm').addEventListener('submit', (e)=>{
        e.preventDefault()
        const results = resultsList.querySelectorAll('LI')
        const keyword = document.querySelector('#keywordInput').value.toLowerCase()
        results.forEach(node =>{
            if(node.firstChild.textContent.toLowerCase().includes(keyword) === false){
                node.style.display = "none"
            }
        })

        
//-------------------FIGURE OUT HOW TO UNHIDE THE FILTERED RESULTS ---------------//
    //circle back
    })       
         //Add Functionailty to undo filter button - click event that removes filter
    // document.querySelector('#filterForm').addEventListener('click', (e)=>{
    //         if(e.target.id === "undoFilter"){
    //             leftPanel.querySelectorAll('LI').forEach(node => {
    //                 node.style.display = "block"
    //                 console.log(node)
    //             })
    //         }
    //     })
    
})

    //Center Panel Functionality
        //Like button
document.addEventListener('DOMContentLoaded', ()=>{
    showPanel.addEventListener('click', (e)=>{
        if(e.target.textContent === 'Like!'){
            e.target.textContent = "Unlike"
            getLikes(showPanel.dataset.id) 

        }else if(e.target.textContent === "Unlike"){
            e.target.textContent = "Like!"
            //Get current meal's likes from DOM
            let likes = document.querySelector('#likesNote').textContent
            const splitLikes = likes.split(' ')
            //Subtract 1 like
            splitLikes[0] = parseInt(splitLikes[0]) - 1
            document.querySelector('#likesNote').textContent = splitLikes.join(' ')
            //Patch updated like count to DB
            patchLikes(document.querySelector('#showPanel').dataset.likeId, parseInt(splitLikes[0]))
        }
    })

    //Add functionality to comment button - submit listener
    document.querySelector('#commentForm').addEventListener('submit', (e)=>{
    e.preventDefault()
    postComment()
    document.querySelector('#commentForm').reset()
    })
})


//when page loads, the top 10 rated comments are listed in the left panel in order 
document.addEventListener('DOMContentLoaded', ()=>{
    getData('http://localhost:3000/likes')
    .then(data =>{
        const topTen = sortTopTen(data)
        topTen.forEach(likeObj =>{
            document.querySelector('#topTenList').innerHTML += `
            <li data-id="${likeObj.idMeal}"><p>${likeObj.likesCount} &hearts;</p><a href="#">${likeObj.strMeal}</a></li>
            `
        })
        
    })
})
//when page loads the top rated meal loads to the showPanel
//unfilter button still needs to be looked at




// Functions that will most likely be used again
function sortTopTen(array){
    array.sort((a,b)=>{
        return b.likesCount - a.likesCount
    })
    array.splice(10)
    return array
}
function getData(url){
    return fetch(url).then(res => res.json())
}
function loadToShowPanel(mealObj){
      showPanel.dataset.id = mealObj.idMeal
    showPanel.innerHTML = `            
    <h1>${mealObj.strMeal}</h1>
    <h4 id="cuisine">Cuisine: ${mealObj.strArea}</h4>
    <h4 id="category">Category: ${mealObj.strCategory}</h4>
    <div id="likeDiv">
        <button id="likeBtn">Like!</button>
        <p id="likesNote">0 &hearts;</p> 
    </div>
    <img id="showImage" src="${mealObj.strMealThumb}" alt="">
    <h4>Ingredient List</h4>
    <ul id="ingredientList"></ul>
    <h4>Recipe & Instructions</h4>
    <div id="recipeDiv"></div>
    `
    formatIngr(mealObj)
    formatRecipe(mealObj)
    document.querySelector('#leftPanel').style.display = "none"
    
    //Fetch like data and comment data
    //loads Obj to showPanel with that data, if it exists
 
        //Fetch likes and load to showPanel if they exist
    getData('http://localhost:3000/likes')
    .then(data =>{
        const likeObj = data.find(obj => obj.idMeal === mealObj.idMeal)
        if(likeObj){
            likes = likeObj.likesCount
            const text = document.querySelector('#likesNote').textContent.split(' ')
            text[0] = likes
            document.querySelector('#likesNote').textContent = text.join(' ')
            document.querySelector('#showPanel').dataset.likeId = likeObj.id
        }
    })

    //Fetch comments and load to showPanel if any exist
    document.querySelector('#commentSection').innerHTML = ""
    getData('http://localhost:3000/comments')
    .then(data =>{
        //reverse the array of objs so that comments are listed from most recent to oldest
        data.reverse().forEach(meal =>{
            // const commentArray = []
            if(meal.idMeal === mealObj.idMeal){
                loadCommentToDOM(meal)
            } 
        })
    })




  
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
function loadToShowPanelByMealId(mealId){
    getData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(data => {
       let mealObj = data.meals[0]
       loadToShowPanel(mealObj)
    })
}
function hideLeftPanel(){
    document.querySelector('#backButton').style.display = "flex"
    document.querySelector('#leftPanel').style.display = "none"
}
function showLeftPanel(){
    document.querySelector('#backButton').style.display = 'none'
    document.querySelector('#leftPanel').style.display = 'block'
}
function patchLikes(likeId, updatedLikeCount){
    fetch(`http://localhost:3000/likes/${likeId}`,{
        method: 'PATCH',
        headers:{
            "Content-type":"application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "likesCount": `${updatedLikeCount}`
        })
    })
}
function postLikes(idMeal, updatedLikeCount, mealName){
                fetch('http://localhost:3000/likes',{
                method: 'POST',
                headers:{
                    "Content-Type":"application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    "idMeal": `${idMeal}`,
                    "likesCount": `${updatedLikeCount}`,
                    "strMeal": `${mealName}`
                })
            })
            .then(res => res.json())
            .then(data =>{
                document.querySelector('#showPanel').dataset.likeId = data.id
            })

}
function getLikes(idMeal){
    //Searches 'likes' db to see if the meal has any likes
    getData('http://localhost:3000/likes')
    .then(data =>{
        let mealObj = data.find(meal => meal.idMeal === idMeal) 
        let updatedLikeCount;     
        //If the meal has likes, update DOM with new likes and update the db 
        if(mealObj){
            updatedLikeCount = parseInt(mealObj.likesCount) + 1        
            patchLikes(mealObj.id, updatedLikeCount)
        }else{
        //if there aren't any likes in the DB, POST meal's first like
            updatedLikeCount = 1
            const mealName = showPanel.querySelector('h1').textContent
            postLikes(idMeal, updatedLikeCount, mealName)
        }
        //update DOM with new like count
        const text = document.querySelector('#likesNote').textContent.split(' ')
        text[0] = updatedLikeCount
        document.querySelector('#likesNote').textContent = text.join(' ')
    })
}
function postComment(e){
    const idMeal = document.querySelector('#showPanel').dataset.id
    const userName = document.querySelector('#userNameInput').value
    const comment = document.querySelector('#commentInput').value
    const date = Date().split(' ')
    date.splice(4)

    fetch('http://localhost:3000/comments',{
        method: 'POST',
        headers: {
            "Content-type":"application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "idMeal": idMeal,
            "userName": userName,
            "comment": comment,
            "date": date.join(' ')
        })
    })
    .then(res => res.json())
    .then(data => {
        loadCommentToDOM(data)
    })
}
function loadCommentToDOM(commentObj){
    document.querySelector('#commentSection').innerHTML += `
    <div id="commentDiv">
        <h5>${commentObj.userName}</h5>
        <h6>${commentObj.date}</h6>
        <p>${commentObj.comment}</p>
    </div>`
}