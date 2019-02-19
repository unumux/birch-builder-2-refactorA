function utilNodeListToArray(nl){
    return Array.prototype.slice.call(nl)
}

// utilGetArrayItemByGuid(masterDataObj.activeCompArray, 0)
function utilGetArrayItemByGuid(ar, targetGuid){
    // using a for loop so we can exit as soon as we find it
    for (let i=0; i<ar.length; i++){
        if (ar[i].guid == targetGuid){
            return ar[i]
        }
    }
}
function getGuidByOrder(ar, orderNumber){
    // using a for loop so we can exit as soon as we find it
    for (let i=0; i<ar.length; i++){
        if (ar[i].order*1 == orderNumber*1){
            return ar[i].guid
        }
    }
}

function utilGetTemplateId(ar, ReceivedGuid){
    // using a for loop so we can exit as soon as we find it
    for (let i=0; i<ar.length; i++){
        if (ar[i].guid == ReceivedGuid){
            return ar[i].template
        }
    }
}

function pickColor(el){
    let selectedColor = el.value
    let targetInputEl = document.querySelector('#'+state.colorPickerInputId)
    targetInputEl.value = selectedColor
    // document.querySelector('#'+state.colorPickerInputId).value = selectedColor
    document.querySelector('#'+state.colorPickerId).style.backgroundColor = selectedColor
    document.querySelector('body').click() // closes the tooltip popup

    // this is to auto-save without needing to click the save button
    if (targetInputEl.dataset.savetarget){ // not null, undefined, etc.
        saveMe(targetInputEl.dataset.savetarget)
    }
}
function saveMe(target){
    // target: 300dc  from a call like: saveMe('300dc')
    // build: handlers.goSavet300dc()
    if (target){ // not undefined, null, etc...
        // eval(`handlers.goSavet${target}()`)
        // template1_applyBtn
        document.querySelector(`#${target}_applyBtn`).click()
        //eval(`handlers.goSavet${target}()`)
    }
}







