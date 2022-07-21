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



document.addEventListener('DOMContentLoaded', ()=>{
    const dropDown = document.querySelector('#dropDown')
    const secondDropDown = document.querySelector('#secondaryDropDown')
    const searchInput = document.querySelector('#searchInput')
    const searchForm = document.querySelector('#searchForm')
    const resultsList = document.querySelector('#resultsList')


//HEADER Functionality---------
  


       //User selects an option from the drop down menu
        //depending on option selected, either a text input field or a secondary drop down menu will appear
    dropDown.addEventListener('change', ()=>{
        //Meal Search or ingridents are selected initially -> show text field for user search
        if(dropDown.value === "search" || dropDown.value === "ingredient"){
            secondDropDown.innerHTML = ""
            searchInput.style.display = "inline-block" 
            secondDropDown.style.display = "none"    
        //Area or Category are selected -> populate secondary drop down menu with corresponding data
        }else if(dropDown.value === 'area' || dropDown.value === 'category'){
            secondDropDown.innerHTML = ""
            getSecondDropDownDetails()  

            function getSecondDropDownDetails(){
                //get data for secondary dropdown based off of initial drop down selection
                getData(`https://www.themealdb.com/api/json/v1/1/list.php?${dropDown.value[0]}=list`)
                .then(data => {
                    //meal[strCategory] or str[Area] -> pulls info from data
                    const chimi = 'str' + dropDown.value[0].toUpperCase() + dropDown.value.substring(1)
                    // console.log(data.meals)
                    data.meals.forEach(meal =>{
                        secondDropDown.innerHTML += `<option value=${meal[chimi]}>${meal[chimi]}</option>`
                    })
                })
            }

            searchInput.style.display = "none"
            secondDropDown.style.display = "inline-block"
        //First Letter is selected -> populate secondary dropdown with Alphabet
        }else if(dropDown.value === "first letter"){
            secondDropDown.innerHTML =""
            const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
            searchInput.style.display = "none"
            secondDropDown.style.display = "inline-block"
            alphabet.forEach(letter =>{
                secondDropDown.innerHTML += `<option value=${letter}>${letter}</option>`
            })
        }
        //-Select- is selected -> hide secondary dropdown & text input
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

        function populateResultsToLeftPanel(){
            let searchOrFilter;
            let searchBy;

        //set url for get request based on drop down selections
            //Meal search is selected
            if(dropDown.value === 'search'){
                searchOrFilter = "search"
                //grab value from text input
                searchBy = searchInput.value
            }
            //First Letter is selected
            else if(dropDown.value === 'first letter'){
                searchOrFilter = "search"
                //grab value from secondary drop down
                searchBy = secondDropDown.value
            }
            //ingredients is selected
            else if(dropDown.value === "ingredient"){
                searchOrFilter = "filter"
                //grab value from text input
                searchBy = searchInput.value
            }
            //Area or category are selected
            else{
                searchOrFilter = "filter"
                //grab value form secondary drop down
                searchBy = secondDropDown.value
            }
            //run get request only if initial dropdown and search input or secondary dropdown exist
            if(dropDown.value[0] && searchBy){
                const url = `https://www.themealdb.com/api/json/v1/1/${searchOrFilter}.php?${dropDown.value[0]}=${searchBy}`
                getData(url)
                .then(data => {
                    //If results are null - send note to DOM
                    if(data.meals === null){
                        resultsList.innerHTML = "Sorry, your search yielded 0 results.  Please try again."
                    }else{
                        data.meals.forEach(meal =>{
                            resultsList.innerHTML += `<li data-id="${meal.idMeal}"><a href="#">${meal.strMeal}</a></li>`

                        })
                    }    
               
                })
                .catch(error =>{
                    console.log(error)
                })

                searchForm.reset()
                //hide secondary drop down and search input if they are visible
                searchInput.style.display = "none"
                secondDropDown.style.display = "none"
                showLeftPanel()
                }
            else{
                //if text fields are left blank
                alert("Please fill in text field")
            }
        }      
    })

      //Add Functionality to Random Button
    document.querySelector('#randomBtn').addEventListener('click', ()=>{
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



//Body

    //Left Panel Functionality
    //Add click event - when results is clicked show panel is loaded with meal details
    const leftPanel = document.querySelector('#leftPanel')
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
        const keyword = document.querySelector('#keywordInput').value
        if(keyword){
            //hide 'filter button'
            document.querySelector('#filterBtn').style.display = "none"
            //show unfilter btn
            document.querySelector('#undoFilterBtn').style.display = "inline-block"
            let results = resultsList.querySelectorAll('LI')
            const fitleredList = Array.from(results).filter(li =>{
                return li.textContent.toLowerCase().includes(keyword.toLowerCase())=== false
            })
            fitleredList.map(li =>{
                li.style.display = "none"
            })
            //click event for undo filter button
            leftPanel.addEventListener('click', (e)=>{
                if(e.target.id === 'undoFilterBtn'){
                    fitleredList.map(li=>{
                        li.style.display = ""
                        document.querySelector('#undoFilterBtn').style.display = "none"
                        document.querySelector('#filterBtn').style.display = "inline-block"
                    })
                }
            }) 
        }else{
            //alert user when filter is pushed with no text input
            alert("Please type in a keyword")
        }
    })   

  
//Go through like and unline functionality again and optimize

    //Center Panel Functionality
      //Like/Unlike button
    showPanel.addEventListener('click', (e)=>{
        if(e.target.textContent === 'Like!'){
            e.target.textContent = "Unlike"
            checkLikes(showPanel.dataset.id) //updates the db and the showPanel
            function checkLikes(idMeal){
                //Searches 'likes' db to see if the meal has any likes
                getData('http://localhost:3000/likes')
                .then(data =>{
                    let mealObj = data.find(meal => meal.idMeal === idMeal) 
                    let updatedLikeCount;     
                    //If the meal has likes, patch the db 
                    if(mealObj){
                        updatedLikeCount = parseInt(mealObj.likesCount) + 1        
                        patchLikes(mealObj.id, updatedLikeCount)
                    }else{
                    //if there aren't any likes in the DB, POST meal's first like
                        updatedLikeCount = 1
                        const mealName = showPanel.querySelector('h1').textContent
                        postLikes(idMeal, updatedLikeCount, mealName)
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
                    }
                    //update DOM (showPanel) with new like count
                    const text = document.querySelector('#likesNote').textContent.split(' ')
                    text[0] = updatedLikeCount
                    document.querySelector('#likesNote').textContent = text.join(' ')
                })
            }

            const topTenList = document.querySelector('#topTenList')
            const topTen = topTenList.querySelectorAll('LI')
            const topTenArray = Array.from(topTen)

            //check to see if meal is already in the top 10
            if(topTenArray.find(li => li.dataset.id === showPanel.dataset.id)){
                // find li in right panel and update likes + 1
                let foundLi = topTenArray.find(li => li.dataset.id === showPanel.dataset.id)
                let foundLiLikesCount = foundLi.querySelector('#sideLikes').innerText.split(' ')
                foundLiLikesCount[0] = parseInt(foundLiLikesCount) + 1
                foundLi.querySelector('#sideLikes').innerText = foundLiLikesCount.join(' ')

                //then fire sortList() andto re-sort the right panel
                const sortedList = sortList()
                topTenList.innerHTML = ""
                sortedList.forEach(li => {
                    topTenList.append(li)
                })
            }
            else{
                //create new li - append to right panel - fire sortList() - load top ten to right panel
                const mealId = showPanel.dataset.id 
                let likesCount = showPanel.querySelector('#likesNote').innerText.split(' ')[0]
                likesCount = parseInt(likesCount)+ 1
                const strMeal = showPanel.querySelector('#mealName').innerText
                    //create new li with current meal details and add to Right panel - now right panel has 11 meals
                topTenList.innerHTML +=
                `<li data-id="${mealId}"><p id="sideLikes">${likesCount} &hearts;</p><a href="#">${strMeal}</a></li>`
                    //fire sortList() - resorts and returns top 10 meals
                const sortedList = sortList()
                topTenList.innerHTML = ""
                sortedList.forEach(li =>{
                    topTenList.append(li)
                })
            }
        }
        else if(e.target.textContent === "Unlike"){

            const topTenList = document.querySelector('#topTenList')
            const topTen = topTenList.querySelectorAll('LI')
            const topTenArray = Array.from(topTen)
            e.target.textContent = "Like!"
            //Get current meal's likes from DOM
            let likes = document.querySelector('#likesNote').textContent
            const splitLikes = likes.split(' ')
            //Subtract 1 like
            splitLikes[0] = parseInt(splitLikes[0]) - 1
            //update showpanel
            document.querySelector('#likesNote').textContent = splitLikes.join(' ')
            //update rightpanel
                //if meal is in the top 10 list, update 1 less like, sort list
                if(topTenArray.find(li => li.dataset.id === showPanel.dataset.id)){
                    let foundLi = topTenArray.find(li => li.dataset.id === showPanel.dataset.id)
                    let foundLiLikesCount = foundLi.querySelector('#sideLikes').innerText.split(' ')
                    foundLiLikesCount[0] = parseInt(foundLiLikesCount) - 1
                    foundLi.querySelector('#sideLikes').innerText = foundLiLikesCount.join(' ')
                }
                    //Patch updated like count to DB
            patchLikes(document.querySelector('#showPanel').dataset.likeId, parseInt(splitLikes[0]))
        }   
    })

    //Add functionality to comment button - submit listener
    document.querySelector('#commentForm').addEventListener('submit', (e)=>{
    e.preventDefault()
    postComment() //post comment to DB + DOM
    function postComment(){
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
    document.querySelector('#commentForm').reset()
    })
    


    //Right Panel Functionality
        //when page loads, the top 10 rated comments are listed in the right panel in order 
        //Top rated meal is displayed on the showpanel
        loadTopTen() 
        function loadTopTen(){ 
            getData('http://localhost:3000/likes')
            .then(data =>{
                const topTen = sortTopTen(data)
                function sortTopTen(array){
                    array.sort((a,b)=>{
                        return b.likesCount - a.likesCount
                    })
                    array.splice(10)

                    //Add Top Rated Meal to show panel
                    loadToShowPanelByMealId(array[0].idMeal, addTopBanner)
                    return array
                }
                topTen.forEach(likeObj =>{
                    document.querySelector('#topTenList').innerHTML += `
                    <li data-id="${likeObj.idMeal}"><p id="sideLikes">${likeObj.likesCount} &hearts;</p><a href="#">${likeObj.strMeal}</a></li>`
                })
            })
        }
    
    
    //Add click event to top 10 - load to show panel when clicked
    document.querySelector('#topTenList').addEventListener('click', (e)=>{
        if(e.target.tagName === "A"){
            loadToShowPanelByMealId(e.target.parentNode.dataset.id)
        }
    })



//Reusable functions
    function sortList(){
        //grabs all li's in the right panel, organizes them by most likes, then returns 10 most liked meals
        const topTenList = document.querySelector('#topTenList')
        const topTen = topTenList.querySelectorAll('LI')
        const array = Array.from(topTen)
        array.sort((a,b)=>{
            return b.textContent.split(' ')[0] - a.textContent.split(' ')[0]
        })
        
        return array.slice(0,10)
    }
    function getData(url){
        return fetch(url).then(res => res.json())
    }
    function loadToShowPanelByMealId(mealId, addTopBanner){
        getData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(data => {
           let mealObj = data.meals[0]
           loadToShowPanel(mealObj, addTopBanner)
        })
    }
    function loadToShowPanel(mealObj, addTopBanner){
        showPanel.dataset.id = mealObj.idMeal
        showPanel.innerHTML = `            
        <h1 id="mealName">${mealObj.strMeal}</h1>
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
        formatRecipe(mealObj)
        function formatRecipe(mealObj){
        let recipe = mealObj.strInstructions.split('. ')
        recipe.forEach(line =>{
            recipeDiv.innerHTML += `<p>${line}</p>`
        })
        }
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
                //if a function has been passed as a parameter, fire the function
              if(addTopBanner){
                  addTopBanner()
              }
            }
        })
  
        //Fetch comments and load to showPanel if any exist
        document.querySelector('#commentSection').innerHTML = ""
        getData('http://localhost:3000/comments')
        .then(data =>{
            data.forEach(meal =>{
                // const commentArray = []
                if(meal.idMeal === mealObj.idMeal){
                    loadCommentToDOM(meal)
                } 
          })
        })
    }
    function addTopBanner(){
        const topMeal = document.createElement('h2')
        topMeal.textContent = "Top Rated Meal!"
        showPanel.prepend(topMeal)
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
    function loadCommentToDOM(commentObj){
        const div = document.createElement('div')
        div.id = "commentDiv"
        div.innerHTML =
            `<h5>${commentObj.userName}</h5>
            <h6>${commentObj.date}</h6>
            <p>${commentObj.comment}</p>`
       
        document.querySelector('#commentSection').prepend(div)

    }


})

