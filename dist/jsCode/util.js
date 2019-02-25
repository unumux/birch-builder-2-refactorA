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
// function getGuidByOrder(ar, orderNumber){
//     // using a for loop so we can exit as soon as we find it
//     for (let i=0; i<ar.length; i++){
//         if (ar[i].order*1 == orderNumber*1){
//             return ar[i].guid
//         }
//     }
// }

function utilGetTemplateId(ar, ReceivedGuid){
    // using a for loop so we can exit as soon as we find it
    for (let i=0; i<ar.length; i++){
        if (ar[i].guid == ReceivedGuid){
            return ar[i].template
        }
    }
}