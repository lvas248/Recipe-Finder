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
            searchInput.value = ""  //clears any text leftover in the input
            secondDropDown.innerHTML = "" //clear previous dropdown options
            secondDropDown.style.display = "none"    //hide second dropdown
            searchInput.style.display = "inline-block" //display text input field
        //Area or Category are selected -> populate secondary drop down menu with corresponding data
        }else if(dropDown.value === 'area' || dropDown.value === 'category'){
            secondDropDown.innerHTML = ""   //clear previous dropdown options
            getSecondDropDownDetails()  

            function getSecondDropDownDetails(){
                //get data for secondary dropdown based off of initial drop down selection
                getData(`https://www.themealdb.com/api/json/v1/1/list.php?${dropDown.value[0]}=list`)
                .then(data => {
                    //meal[strCategory] or [strArea] -> pulls info from data
                    const key = 'str' + dropDown.value[0].toUpperCase() + dropDown.value.substring(1)
                    data.meals.forEach(areaCategory =>{
                        secondDropDown.innerHTML += `<option value=${areaCategory[key]}>${areaCategory[key]}</option>`
                    })
                })
            }

            searchInput.style.display = "none"
            secondDropDown.style.display = "inline-block"
        //First Letter is selected -> populate secondary dropdown with Alphabet
        }else if(dropDown.value === "first letter"){
            secondDropDown.innerHTML ="" //clear second dropdown
            searchInput.style.display = "none" //hide text input
            secondDropDown.style.display = "inline-block" //display second dropdown
            const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
            alphabet.forEach(letter =>{
                secondDropDown.innerHTML += `<option value=${letter}>${letter}</option>`
            })
        }
        //-Select- is selected -> hide secondary dropdown & text input
        else{
            //hide all inputs
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
                        document.querySelector('#resultsCount').innerText = `Results: 0 recipes`

                    }else{
                        data.meals.forEach(meal =>{
                            resultsList.innerHTML += `<li data-id="${meal.idMeal}"><a href="#">${meal.strMeal}</a></li>`
                        })
                        document.querySelector('#resultsCount').innerText = `Results: ${data.meals.length} recipes`
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
    const filterForm = document.querySelector('#filterForm')
    filterForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        const keyword = document.querySelector('#keywordInput').value
        if(keyword){
            //hide 'filter button'
            document.querySelector('#filterBtn').style.display = "none"
            //show unfilter btn
            document.querySelector('#undoFilterBtn').style.display = "inline-block"
            let results = resultsList.querySelectorAll('LI')
            //return any LI that doesn't contain the keyword
            const fitleredList = Array.from(results).filter(li =>{
                return li.textContent.toLowerCase().includes(keyword.toLowerCase())=== false
            })
            fitleredList.map(li =>{
                li.style.display = "none"
            })

            //Update recipe result count when results are filtered
            let count = document.querySelector('#resultsCount') //grab p with results counts
            let splitCount = count.innerText.split(' ')
            splitCount[1] = results.length - fitleredList.length
            count.innerText = splitCount.join(' ')
            
            //click event for undo filter button
            leftPanel.addEventListener('click', (e)=>{
                if(e.target.id === 'undoFilterBtn'){
                    fitleredList.map(li=>{
                        li.style.display = ""
                        document.querySelector('#undoFilterBtn').style.display = "none"
                        document.querySelector('#filterBtn').style.display = "inline-block"
                    })
                //update recipe result count when filter is undone
                count.innerText = `Results: ${results.length} recipes`
                }
            }) 
        }else{
            //alert user when filter is pushed with no text input
            alert("Please type in a keyword")
        }
        filterForm.reset()
    })   

//Go through like and unlike functionality again and optimize

    //Center Panel Functionality
      //Like/Unlike button
    showPanel.addEventListener('click', (e)=>{
        const topTenList = document.querySelector('#topTenList')
        const topTen = topTenList.querySelectorAll('LI')
        const topTenArray = Array.from(topTen)  

        //if button says like
            //If the recipe on the show panel has been liked before, patch like to DB
            //If it hasnt been liked before, post a like to the DB
            //Then update showpanel with new like count
            //Then update right panel if the recipe is in the top ten
        if(e.target.textContent === 'Like!'){
                //changed button to "Unlike"
            e.target.textContent = "Unlike"
                //grab current likes, update it 
            const likesNote = document.querySelector('#likesNote')
            const likeCount = likesNote.textContent.split(' ')[0]
            const updatedLikeCount = parseInt(likeCount) + 1
                //check to see if current meal has likeId            
            if(showPanel.dataset.likeId){
                //if yes, patch like
               patchLikes(showPanel.dataset.likeId, updatedLikeCount)
            }
                //else, post like
            else{
                const mealName = showPanel.querySelector('#mealName').textContent
                postLikes(showPanel.dataset.id, updatedLikeCount, mealName)
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

            //update DOM
            const text = document.querySelector('#likesNote').textContent.split(' ')
            text[0] = updatedLikeCount
            document.querySelector('#likesNote').textContent = text.join(' ')

            //If recipe is in top ten, update right panel
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
                likesCount = parseInt(likesCount)
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
        //If button says 'unlike' 
            //update showpanel to show one less like
            //if recipe is listed in top ten, update likes to show 1 less
            //Patch likes to DB
        else if(e.target.textContent === "Unlike"){
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
                function addTopBanner(){
                    const topMeal = document.createElement('h2')
                    topMeal.textContent = "Top Rated Recipe!"
                    showPanel.prepend(topMeal)
                }
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
    function loadToShowPanelByMealId(mealId, callBack){
        getData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(data => {
           let mealObj = data.meals[0]
           loadToShowPanel(mealObj, callBack)
        })
    }
    function loadToShowPanel(mealObj, callBack){
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
                //update likes on show panel
              likes = likeObj.likesCount
              const text = document.querySelector('#likesNote').textContent.split(' ')
              text[0] = likes
              document.querySelector('#likesNote').textContent = text.join(' ')
              document.querySelector('#showPanel').dataset.likeId = likeObj.id
                //if a function has been passed as a parameter, fire the function
              if(callBack){
                  callBack()
              }
            }
            else{
                //if recipe does has never been liked, set likeId as null
                document.querySelector('#showPanel').dataset.likeId = ""
            }
            
        })
  
        //Fetch comments and load to showPanel if any exist
        document.querySelector('#commentSection').innerHTML = ""
        getData('http://localhost:3000/comments')
        .then(data =>{
            data.forEach(commentObj =>{
                // const commentArray = []
                if(commentObj.idMeal === mealObj.idMeal){
                    loadCommentToDOM(commentObj)
                } 
          })
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
        // .then(res=> res.json())
        // .then(data => console.log(data))
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


