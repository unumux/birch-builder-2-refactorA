console.log('hey there this is main.js')
console.log('megaComponentObject is loaded as a global variable from the generated megaComponentObject.js:', megaComponentObject)

// initialize drop and drop
let dnd_el = document.getElementById('draggableContainer');
let sortable = Sortable.create(dnd_el, {
  ghostClass: "ghost"
});

let state = {
    theme: 'unum', // unum, colonial
    mode: 'add', // add, edit  (add=list of components visible; edit=data entry visible)
    editCompId: null,
    editTemplateId: null,
    colorPickerInputId: null, // used during clicker picking to know what to target with the selected color
    colorPickerId: null
}
mainPopulateLeft()

function mainPopulateLeft(){
    // loop through megaComponentObject to create buttons in left for each comp
    const megaComponentArray = Object.entries(megaComponentObject)  // make array from object
    for (const [compId, compObj] of megaComponentArray) { // destructure array entries into names
        //console.log(`The compId is ${compId}`);
        //console.log(`The compObj is ${compObj}`);

        let targetRenderElement = document.querySelector('#leftContainersInsertionPoint')

        // create container element
        let createdEl1 = document.createElement("div")
        createdEl1.className = 'addComponentContainer'
        targetRenderElement.appendChild(createdEl1)

        let att = document.createAttribute("onclick");
        att.value = `userAddComp('${compId}')`;
        createdEl1.setAttributeNode(att);

        // create child element inside the container
        let createdEl2 = document.createElement("div")
        createdEl2.className = 'addComponentLabel'
        createdEl2.innerHTML = `${compId}`
        createdEl1.appendChild(createdEl2)

        // create another child element
        let createdEl3 = document.createElement("div")
        createdEl3.className = 'addComponentPreview avoid-clicks'
        createdEl1.appendChild(createdEl3)

        // create child inside that last child
        let createdEl4 = document.createElement("div")
        // merge the template code with the comp data first...
        //let mergedCode = mainMergeDataIntoPlaceholders(templateBaseCode, templateDataObj)
        //let mergedCode = mainMergeDataIntoPlaceholders(compObj.code, compObj.unumObj)
        let mergedCode = mainMergeDataIntoPlaceholders(compObj.code, compObj.unumObj)
        //compObj.code = mergedCode
        createdEl4.innerHTML = mergedCode
        // createdEl4.innerHTML = `${compObj.code}`
        createdEl3.appendChild(createdEl4)

    }
}



function mainMergeDataIntoPlaceholders2(compGuid){
    //console.log('######################');
    console.log('welome to mainMergeDataIntoPlaceholders2()...');
    console.log('compGuid:',compGuid);
    let activeComp = utilGetArrayItemByGuid(masterDataObj.activeCompArray, compGuid)
    console.log('activeComp:', activeComp)
    let compCode = activeComp.compCode
    console.log('compCode:', compCode)
    
    // build compData...
    





    //console.log('dataObj:',dataObj);
    //console.log('');

    // let originalTemplateCode = templateCode // do I need this?
    
    /*
    // loop through the dataObj looking for dynamic code placeholders
    const dataObjEntries = Object.entries(dataObj)
    for (const [fieldLabel, fieldData] of dataObjEntries) { // destructured to give names to the data fields
        //console.log('fieldLabel:',fieldLabel);
        //console.log('fieldData:',fieldData);

        // generic match merge.  If the placeholder name matches a field name
        templateCode = myReplace(templateCode, `birch_${fieldLabel}_birch`, fieldData)
    }
    
    return templateCode
    */
    
}



function mainMergeDataIntoPlaceholders(templateCode, dataObj){
    //console.log('######################');
    //console.log('welome to mainMergeDataIntoPlaceholders()...');
    //console.log('templateCode:',templateCode);
    //console.log('dataObj:',dataObj);
    //console.log('');

    // let originalTemplateCode = templateCode // do I need this?
    

    // loop through the dataObj looking for dynamic code placeholders
    const dataObjEntries = Object.entries(dataObj)
    for (const [fieldLabel, fieldData] of dataObjEntries) { // destructured to give names to the data fields
        //console.log('fieldLabel:',fieldLabel);
        //console.log('fieldData:',fieldData);
        
        // baseCodeWithDynamicCodeInserted = baseCodeWithDynamicCodeInserted.replace(`birch_bottomAddress_birch`, dataObj.bottomAddress)
        // if (fieldLabel == 'testText'){
        //     templateCode = myReplace(templateCode, 'birch_testText_birch', fieldData)
        // }

        // generic match merge.  If the placeholder name matches a field name
        //if (fieldLabel == 'testText'){
            templateCode = myReplace(templateCode, `birch_${fieldLabel}_birch`, fieldData)
        //}

    }
    
    // return templateCode with dataObj info merged into any matching placeholders
    //console.log('the merged code is', templateCode);
    return templateCode
    
}


function myReplace(mainString, substringToReplace, newSubString){
    return mainString.replace(substringToReplace, newSubString)
}
function myReplaceAll(targetString, replaceThis, withThat){
    const afterAllSwapped = targetString.split(replaceThis).join(withThat)
    return afterAllSwapped
}


function mainEditSave_template1(){
    console.log('||||||||||||welcome to mainEditSave_template1()...');
    let template1_textText = document.querySelector('#template1_textText').value
    //console.log('template1_textText:',template1_textText);

    let dataGuid = document.querySelector('#guidBeingEdited').value
    //console.log('dataGuid:',dataGuid)
    
    //console.log('masterDataObj.activeCompArray[dataGuid]:', masterDataObj.activeCompArray[dataGuid])
    let dataMatch = masterDataObj.activeCompArray[dataGuid]


    // get the matching data guy
    //console.log('state.editActiveComp:',state.editActiveComp)
    //let dataMatch = utilGetArrayItemByGuid(masterDataObj.activeCompArray, dataGuid)
    //console.log('++++++ dataMatch:', dataMatch)
    // update it's data from the user input fields
    dataMatch.compCode.unumObj.testText = document.querySelector('#template1_textText').value


    // that should be it!  No need to merge here.  The merge should happen during master updateView!!


    // merge it's code with the updated data
    // console.log('megaComponentObject[state.editActiveComp.template]', megaComponentObject[state.editActiveComp.template])
    // mainMergeDataIntoPlaceholders(templateCode, dataObj)
    // let mergedCode = mainMergeDataIntoPlaceholders(megaComponentObject[item.template].code, item.compCode.unumObj)
    // let mergedCode = mainMergeDataIntoPlaceholders(megaComponentObject[dataMatch.template].code, dataMatch.compCode.unumObj)
    // let mergedCode = mainMergeDataIntoPlaceholders(megaComponentObject[state.editActiveComp.template].code, state.editActiveComp.compCode.unumObj)
    
    //console.log('mergedCode:', mergedCode);
    masterDataObj.updateView()
    
    
    // update the master updateView

    //let mergedCode = mainMergeDataIntoPlaceholders(compObj.code, compObj.unumObj)
    //compObj.code = mergedCode
}

function mainEditSave_template2(){
    console.log('welcome to mainEditSave_template2()...');
    let template2_textText = document.querySelector('#template2_textText').value
    //console.log('template2_textText:',template1_textText);

    // get the matching data guy
    //console.log('state.editActiveComp:',state.editActiveComp)
    // update it's data from the user input fields
    state.editActiveComp.compCode.unumObj.testText = document.querySelector('#template2_textText').value
    // merge it's code with the updated data
    // update the master updateView

    //let mergedCode = mainMergeDataIntoPlaceholders(compObj.code, compObj.unumObj)
    //compObj.code = mergedCode
}