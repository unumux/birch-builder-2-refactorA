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
    // let dataMatch = masterDataObj.activeCompArray[state.editCompId]
    let dataMatch = utilGetArrayItemByGuid(masterDataObj.activeCompArray, state.editCompId)
    console.log('dataMatch:',dataMatch)


    ourDataObj = dataMatch.compData
    console.log('ourDataObj:', ourDataObj);
    

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
    let compData = activeComp.compData
    //let ourSaveObj = dataMatch.compData 

    const compDataArray = Object.entries(compData)  // make array from object
    for (const [fieldName, fieldData] of compDataArray) { // loop & destructure array entries into names
        let ourSelector = document.querySelector(`#${activeComp.template}_${fieldName}`)
        console.log('wanting to save to: ', `#${activeComp.template}_${fieldName}`);
        
        if (ourSelector){
            // utilGetArrayItemByGuid(masterDataObj.activeCompArray, state.editCompId).compCode.saveObj[fieldName] = ourSelector.value
            console.log(utilGetArrayItemByGuid(masterDataObj.activeCompArray, state.editCompId).compData[fieldName])
            utilGetArrayItemByGuid(masterDataObj.activeCompArray, state.editCompId).compData[fieldName] = ourSelector.value
        }
    }
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











/*
function userEmailCompClick(el){ // this function is added to the DOM's click event dynamically in masterDataObj during updateView()
    event.stopPropagation() // to keep a click here from bubbling to the empty right area and triggering userEmptyRightClicked()
    console.log('welcome to userEmailCompClick()...');
    // console.log('el=',el);
    // console.log(`the template for this emailComp is ${masterDataObj.activeCompArray[el.dataset.guid].template}`)
    // console.log(masterDataObj.activeCompArray[el.dataset.guid]);

    let dataGuidOfClickedEmailComp = el.dataset.guid
    //console.log('dataGuidOfClickedEmailComp:',dataGuidOfClickedEmailComp);
    let templateOfClickedEmailComp = masterDataObj.activeCompArray[dataGuidOfClickedEmailComp].template
    //console.log('templateOfClickedEmailComp:',templateOfClickedEmailComp);


    

    let clickedTemplateId = masterDataObj.activeCompArray[el.dataset.order].template
    let isEditViewActive = !document.querySelector('#leftEditView').classList.contains('hideme')
    
    if (!isEditViewActive){
        // show edit view
        document.querySelector('#leftComponentView').classList.add('hideme')
        document.querySelector('#leftEditView').classList.remove('hideme')
        // show editSection for clicked comp
        document.querySelector(`#edit_${clickedTemplateId}`).classList.remove('hideme')
        // state.editActiveComp = masterDataObj.activeCompArray[el.dataset.order]
        //console.log('>>> el.dataset.guid:',el.dataset.guid);
        document.querySelector('#guidBeingEdited').value = el.dataset.guid
        masterDataObj.activeCompArray[el.dataset.guid].isBeingEdited = true
        el.classList.add('isBeingEdited')
        userloadDataIntoInputFields(dataGuidOfClickedEmailComp, templateOfClickedEmailComp)
    }
    else{
        // switch to component view OR switch to a different component in edit view
        // if isEditViewActive then there must be an active editSection

        // find the open editSection...
        let activeEditSectionId = null
        let allEditSections = utilNodeListToArray(document.querySelectorAll('.editSection'))
        allEditSections.map( (item, i) => {
            if (!item.classList.contains('hideme')){
                activeEditSectionId = item.id
            }
        })

        // switch to another editSection or close the entire edit view...

        if (document.querySelector('#guidBeingEdited').value == el.dataset.guid){
            // same comp clicked again, so close the entire edit view...then switch to component view
            privateUserSwitchToComponentView()
            
        }
        else{
            // switch to a different editSection
            masterDataObj.activeCompArray.map( item => item.isBeingEdited = false ) // set all to false
            // remove isBeingEdited css class 
            let allDraggable = utilNodeListToArray(document.querySelectorAll('.draggable'))
            allDraggable.map( (item, i) => {
                item.classList.remove('isBeingEdited')
            })

            document.querySelector(`#${activeEditSectionId}`).classList.add('hideme')
            document.querySelector(`#edit_${clickedTemplateId}`).classList.remove('hideme')
            document.querySelector('#guidBeingEdited').value = el.dataset.guid
            masterDataObj.activeCompArray[el.dataset.guid].isBeingEdited = true
            el.classList.add('isBeingEdited')
            userloadDataIntoInputFields(dataGuidOfClickedEmailComp, templateOfClickedEmailComp)
        }
        
    }

}

// userloadDataIntoInputFields(dataGuidOfClickedEmailComp, templateOfClickedEmailComp)
function userloadDataIntoInputFields(guid, template){
    //console.log('welcome to userloadDataIntoInputFields()...')
    let dataMatch = masterDataObj.activeCompArray[guid]
    //console.log('dataMatch:',dataMatch);
    
    // let ourDataObj = null
    // if (state.theme == 'unum'){
    //     ourDataObj = dataMatch.compCode.unumObj
    // }
    ourDataObj = dataMatch.compCode.saveObj

    //console.log('ourDataObj:',ourDataObj);

    // loop through it and if there is a matching input field...load the data

    

    const ourDataArray = Object.entries(ourDataObj)  // make array from object
    for (const [fieldName, fieldData] of ourDataArray) { // loop & destructure array entries into names
        //console.log(`fieldName:${fieldName} fieldData:${fieldData}`);
        // template1_textText
        //console.log('uh:',`#${template}_${fieldName}`);
        
        let ourSelector = document.querySelector(`#${template}_${fieldName}`)
        //console.log('ourSelector:',ourSelector);
        
        if (ourSelector){
            ourSelector.value = fieldData
        }
    }
    
}

function userEditSave(){
    //console.log('welcome to userEditSave()...');
    let guid = document.querySelector('#guidBeingEdited').value
    //console.log('guid:',guid);

    let dataMatch = masterDataObj.activeCompArray[guid]
    //console.log('dataMatch:',dataMatch);
    
    let ourSaveObj = dataMatch.compCode.saveObj // this obj is messed up!! Or maybe not...
    //console.log('ourSaveObj:',ourSaveObj)

    

    const ourSaveArray = Object.entries(ourSaveObj)  // make array from object
    //console.log('ourSaveArray:',ourSaveArray)
    for (const [fieldName, fieldData] of ourSaveArray) { // loop & destructure array entries into names
        let ourSelector = document.querySelector(`#${dataMatch.template}_${fieldName}`)
        //console.log('ourSelector:',ourSelector);

        //console.log('ourSaveObj', ourSaveObj)
        
        if (ourSelector){
            //console.log(`saving ${ourSelector.value} into ${fieldName}`);
            //ourSaveObj[fieldName] = ourSelector.value
            //console.log('>>>>', masterDataObj.activeCompArray[guid].compCode.saveObj[fieldName])
            masterDataObj.activeCompArray[guid].compCode.saveObj[fieldName] = ourSelector.value
        }
    }
    masterDataObj.updateView()
}








function privateUserSwitchToComponentView(){
    // hide all of the child editSections before switching views...
    let allEditSections = utilNodeListToArray(document.querySelectorAll('.editSection'))
    allEditSections.map( (item, i) => {
        item.classList.add('hideme')
    })
    document.querySelector('#leftEditView').classList.add('hideme')
    document.querySelector('#leftComponentView').classList.remove('hideme')

    // loop through data to make sure non-have their edit mode activated
    masterDataObj.activeCompArray.map( item => item.isBeingEdited = false ) // set all to false

    // remove isBeingEdited css class 
    let allDraggable = utilNodeListToArray(document.querySelectorAll('.draggable'))
    allDraggable.map( (item, i) => {
        item.classList.remove('isBeingEdited')
    })

    //state.editActiveComp = null
}


*/
