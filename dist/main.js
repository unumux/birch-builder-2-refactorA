console.log('hey there this is main.js')
console.log('megaComponentObject is loaded as a global variable from the generated megaComponentObject.js:', megaComponentObject)

// initialize drop and drop
let dnd_el = document.getElementById('draggableContainer');
let sortable = Sortable.create(dnd_el, {
  ghostClass: "ghost",
  // Element dragging ended
	onEnd: function (/**Event*/evt) {
		// var itemEl = evt.item;  // dragged HTMLElement
		// evt.to;    // target list
		// evt.from;  // previous list
		// evt.oldIndex;  // element's old index within old parent
        // evt.newIndex;  // element's new index within new parent
        console.log('drag ended!')
        mainSaveNewOrderAfterDrop()
	},
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
        //console.log(`The compObj is`, compObj);

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
        let themeModifiedDataObj = mainMergeDataWithTheme(compObj)
        let mergedCode = mainMergeDataIntoPlaceholders(themeModifiedDataObj) 

        //compObj.code = mergedCode
        createdEl4.innerHTML = mergedCode
        // createdEl4.innerHTML = `${compObj.code}`
        createdEl3.appendChild(createdEl4)

    }
}

function mainSaveNewOrderAfterDrop(){
    //console.log('welcome to mainSaveNewOrderAfterDrop()...');
    let tempArray = [];

    let allDraggable = utilNodeListToArray(document.querySelectorAll('.draggable'))
    allDraggable.map( (item,i) => {
        tempArray[i] = utilGetArrayItemByGuid(masterDataObj.activeCompArray, item.dataset.guid)
    })

    // now loop to update the master with the temp
    masterDataObj.activeCompArray.map( (item,i) => {
        masterDataObj.activeCompArray[i] = tempArray[i]
    })

    masterDataObj.updateView()
}

function mainMergeDataWithTheme(theObj){
    //console.log('welcome to mergeDataWithTheme()...');
    if (state.theme == 'unum'){
        theObj.dataObj = Object.assign(theObj.dataObj, theObj.unumObj);
    }
    else if (state.theme == 'colonial'){
        theObj.dataObj = Object.assign(theObj.dataObj, theObj.colonialObj);
    }
    return theObj
}

function mainMergeDataIntoPlaceholders(themeModifiedDataObj){
    //console.log('welome to mainMergeDataIntoPlaceholders()...');
    //console.log('themeModifiedDataObj:',themeModifiedDataObj);

    let compCode = themeModifiedDataObj.code
    let compData = themeModifiedDataObj.dataObj
    let mergedCode = compCode
    
    // loop through the dataObj looking for dynamic code placeholders
    const compDataEntries = Object.entries(compData)
    for (const [fieldLabel, fieldData] of compDataEntries) { // destructured to give names to the data fields
        //console.log('fieldLabel:',fieldLabel);
        //console.log('fieldData:',fieldData);

        
        // c090
        if (fieldLabel == 'linkCode'){
            // choose either link or text version
            let selectedCode = compData.linkCode
            if (compData.linkUrl == ''){
                selectedCode = `<p style="Margin: 0; color: birch_linkColor_birch; font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: normal; margin: 0; padding: 0;">birch_linkText_birch</p>`
            }
            // apply optional alignment sub-component code 
            if (compData.linkAlign == 'center'){
                selectedCode = subCenterBlockMe(selectedCode)
            }
            mergedCode = myReplace(mergedCode, `birch_linkCode_birch`, selectedCode)
            //console.log('link mergedCode:',mergedCode)
        }

        // 100, 102, 104
        if (fieldLabel === 'ctaLinkCode'){   
            if (compData.ctaText == ''){ // exclude the cta
                mergedCode = myReplace(mergedCode, `birch_ctaLinkCode_birch`, '')
            }
            else if (compData.ctaUrl == ''){ // no link, just text
                mergedCode = myReplace(mergedCode, `birch_ctaLinkCode_birch`, compData.ctaText)
            }
            else{ // include the full cta link
                mergedCode = myReplace(mergedCode, `birch_ctaLinkCode_birch`, compData.ctaLinkCode)
            }
        }

        // generic match merge.  If the placeholder name matches a field name
        mergedCode = myReplaceAll(mergedCode, `birch_${fieldLabel}_birch`, fieldData)
        //console.log('mergedCode:',mergedCode)
    }
    //console.log('mergedCode:',mergedCode)
    return mergedCode
}
function myReplace(mainString, substringToReplace, newSubString){
    return mainString.replace(substringToReplace, newSubString)
}
function myReplaceAll(targetString, replaceThis, withThat){
    const afterAllSwapped = targetString.split(replaceThis).join(withThat)
    return afterAllSwapped
}



function subCenterBlockMe(str){
    //str = myReplaceAll(str, `birch_linkAlign_birch`, 'center')
    let part1 = `<center data-parsed="" style="min-width: initial !important; width: 100%;">`
    let part2 = `</center>`
    return part1 + str + part2
}