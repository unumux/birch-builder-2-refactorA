// document.querySelector('.makerButton').onclick = myFunction;
// let allMakerButtons = utilNodeListToArray(document.querySelectorAll('.makerButton'))

// allMakerButtons.map( (item, i) => {
//     item.onclick = myFunction // assign this function to the click event of the element
// })

// function myFunction(evt) {
//     console.log('evt', evt);
//     console.log('evt.target', evt.target);
// }

// // functions here are connected to user generated events.
// // functions here start with my_  (to keep them distinct from methods on the masterDataObj)

// let all_addCompButton = utilNodeListToArray(document.querySelectorAll('.addCompButton'))

// all_addCompButton.map( (item, i) => {
//     item.onclick = my_addComp // assign this function to the click event of the element
// })

// function my_addComp(evt) {
//     masterDataObj.addCompToActiveCompArrayByCompId(evt.target.value)
// }



// left events
function userAddComp(templateId){
    //console.log('welcome to userAddComp()...')
    //console.log('templateId=', templateId);
    masterDataObj.addCompToActiveCompArrayByTemplateId(templateId)
}

// right events
function userCompInEmailClick(e){
    event.stopPropagation()
    //console.log('welcome to userCompInEmailClick()...');
    //console.log('e:',e);
    //console.log('e.target:', e.target);
    // console.log('guid:', e.target.dataset.guid)
    // console.log('template:', utilGetTemplateId(masterDataObj.activeCompArray, e.target.dataset.guid))
    let clickedGuid = e.target.dataset.guid
    let clickedTemplate = utilGetTemplateId(masterDataObj.activeCompArray, e.target.dataset.guid)

    // now let's check to see which mode this click should put us into

    // check to see if we should enter 'edit' mode...
    // conditions: 1) we are currently in 'add' mode
    if (state.mode == 'add'){
        //console.log('switch from ADD mode to EDIT mode...');
        state.mode = 'edit'
        state.editCompId = clickedGuid
        state.editTemplateId = clickedTemplate
        // do the switch
        userPrivateGoEditMode()
    }
    // check to se if we should enter 'add' mode...
    // conditions: 1) we are currently in 'add' mode AND
    //             2) we clicked on the SAME comp that is already open for editing
    else if (state.mode == 'edit' && state.editCompId == clickedGuid){
        // console.log('switch from EDIT mode to ADD mode...');
        state.mode = 'add'
        state.editCompId = null
        state.editTemplateId = null
        userPrivateGoAddMode()
    }
    else if (state.mode == 'edit' && state.editCompId != clickedGuid){ // edit a different comp
        // console.log('stay in EDIT mode...but swap which one is being edited');
        state.editCompId = clickedGuid
        state.editTemplateId = clickedTemplate
        userPrivateGoEditMode()
    }
    
    tempUpdateStateVariableDisplay()
}

function tempUpdateStateVariableDisplay(){
    document.getElementById('displayStateMode').innerHTML = state.mode
    document.getElementById('displayStateEditCompId').innerHTML = state.editCompId
    document.getElementById('displayStateEditTemplateId').innerHTML = state.editTemplateId
}


function userPrivateGoEditMode(){
    // console.log('welcome to userPrivateGoEditMode()...');
    // hide all editSections (in case any were already open)
    let allEditSections = utilNodeListToArray(document.querySelectorAll('.editSection'))
    allEditSections.map( item => item.classList.add('hideme') )
    // show edit view
    document.querySelector('#leftComponentView').classList.add('hideme')
    document.querySelector('#leftEditView').classList.remove('hideme')
    // show editSection for clicked comp
    document.querySelector(`#edit_${state.editTemplateId}`).classList.remove('hideme')
    // remove any active selected class in the email comps
    let allDraggable = utilNodeListToArray(document.querySelectorAll('.draggable'))
    allDraggable.map( item => item.classList.remove('draggableSelected') )
    // add the active selected class where it needs to go
    document.getElementById('draggable'+state.editCompId).classList.add('draggableSelected')
    userPrivateLoadDataIntoFields()
}

function userPrivateGoAddMode(){
    // console.log('welcome to userPrivateGoAddMode()...');
    // show ad view
    document.querySelector('#leftComponentView').classList.remove('hideme')
    document.querySelector('#leftEditView').classList.add('hideme')
    // remove any selected class...
    let allDraggable = utilNodeListToArray(document.querySelectorAll('.draggable'))
    allDraggable.map( item => item.classList.remove('draggableSelected') )
}
function userEmptyRightClicked() {
    //console.log('userEmptyRightClicked happened!');
    //privateUserSwitchToComponentView()
    state.mode = 'add'
    state.editCompId = null
    state.editTemplateId = null
    userPrivateGoAddMode()
    tempUpdateStateVariableDisplay()
}
function userPrivateLoadDataIntoFields(){
    //console.log('welcome to userPrivateLoadDataIntoFields()...');
    
    // let dataMatch = masterDataObj.activeCompArray[state.editCompId]
    let dataMatch = utilGetArrayItemByGuid(masterDataObj.activeCompArray, state.editCompId)
    //console.log('dataMatch:',dataMatch)


    ourDataObj = dataMatch.dataObj
    //console.log('ourDataObj:', ourDataObj);
    

    // loop through it and if there is a matching input field...load the data
    const ourDataArray = Object.entries(ourDataObj)  // make array from object
    for (const [fieldName, fieldData] of ourDataArray) { // loop & destructure array entries into names
        let ourSelector = document.querySelector(`#${state.editTemplateId}_${fieldName}`)
        if (ourSelector){
            ourSelector.value = fieldData
            if (ourSelector.id.includes('_backgroundColor')){
                // give the cpTooltip button in this field the matching background color
                document.querySelector(`#${ourSelector.id}CP`).style.backgroundColor = fieldData
            }
        }
    }
}
function userEditSave(){
    //console.log('welcome to userEditSave()...');
    //let dataMatch = masterDataObj.activeCompArray[state.editCompId]
    let activeComp = utilGetArrayItemByGuid(masterDataObj.activeCompArray, state.editCompId)
    // let ourSaveObj = dataMatch.compCode.saveObj 
    let compData = activeComp.dataObj
    //let ourSaveObj = dataMatch.compData 

    const compDataArray = Object.entries(compData)  // make array from object
    for (const [fieldName, fieldData] of compDataArray) { // loop & destructure array entries into names
        let ourSelector = document.querySelector(`#${activeComp.template}_${fieldName}`)
        //console.log('___');
        //console.log('wanting to save from: ', `#${activeComp.template}_${fieldName}`);
        
        if (ourSelector){
            //console.log('ourSelector is valid...');
            //let blah = utilGetArrayItemByGuid(masterDataObj.activeCompArray, state.editCompId)
            activeComp.dataObj[fieldName] = ourSelector.value

        }
    }
    //console.log('all saves done.  let us check the data before updating the view...');
    //console.log(masterDataObj.activeCompArray);
    
    masterDataObj.updateView()
}
function userEditDelete(){
    //console.log('welcome to userEditDelete()...');
    let isDeleteConfirmed = confirm("Continue with delete?");
    if (isDeleteConfirmed){
        masterDataObj.deleteComp(state.editCompId)
        userEmptyRightClicked()
    }
}

function userPickColor(el){
    let selectedColor = el.value
    let targetInputEl = document.querySelector('#'+state.colorPickerInputId)
    targetInputEl.value = selectedColor
    // document.querySelector('#'+state.colorPickerInputId).value = selectedColor
    document.querySelector('#'+state.colorPickerId).style.backgroundColor = selectedColor
    document.querySelector('body').click() // closes the tooltip popup

    // this is to auto-save without needing to click the save button
    if (targetInputEl.dataset.savetarget){ // not null, undefined, etc.
        userAutoSaveMe(targetInputEl.dataset.savetarget)
    }
}
function userAutoSaveMe(target){
    // target: 300dc  from a call like: userAutoSaveMe('300dc')
    // build: handlers.goSavet300dc()
    if (target){ // not undefined, null, etc...
        // eval(`handlers.goSavet${target}()`)
        // template1_applyBtn
        document.querySelector(`#${target}_applyBtn`).click()
        //eval(`handlers.goSavet${target}()`)
    }
}
function userBlankTo0(guy){ // used for number only input fields
    if (guy.value === ''){
        guy.value = 0;
    }
}
