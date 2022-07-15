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
document.addEventListener('DOMContentLoaded', (e)=>{
    const dropDown = document.querySelector('#dropDown')
    const secondDropDown = document.querySelector('#secondaryDropDown')
    const searchInput = document.querySelector('#searchInput')
    function getSecondDropDownDetails(){
        secondDropDown.innerHTML= ""
        fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${dropDown.value[0]}=list`)
        .then(res => res.json())
        .then(data => {
            const chimi = 'str' + dropDown.value[0].toUpperCase() + dropDown.value.substring(1)
            data.meals.forEach(meal =>{
                secondDropDown.innerHTML += `<option value=${meal[chimi]}>${meal[chimi]}</option>`
            })
        })
    }

    dropDown.addEventListener('change', (e)=>{
        if(dropDown.value === "search"){
            searchInput.style.display = "inline-block"   
        }
        else if(dropDown.value === 'area' || dropDown.value === 'category'){
            searchInput.style.display = "none"
            secondDropDown.style.display = "inline-block"
            getSecondDropDownDetails()
        }
    })

})



