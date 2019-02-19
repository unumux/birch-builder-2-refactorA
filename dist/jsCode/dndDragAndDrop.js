// Note: These functions need to be attached as eventListener functions to dynamically created DOM elements
//       This is done at the end of the masterDataObj's updateView() method.
//
//       Those added event listeners are removed before updateView() rebuilds everything to avoid memory leaks.



// function dnd_click(e){
//     console.log('welcome to dnd_click...')
//     console.log('e.target:', e.target)
// }
// function dnd_click2(e){
//     console.log('welcome to dnd_click2...')
//     console.log('e.target:', e.target)
// }
function dragover(e) {
    e.preventDefault()
    event.dataTransfer.dropEffect = 'copy';  // required to enable drop on DIV
}
function dragenter(e) {
    e.preventDefault()
    //console.log('dragenter triggered.  this is', this)
    this.classList.add('ddHovered')

    // fails if hovering in from below!!!  scaleLarge is instantly being removed.  fix = apply avoid-clicks class to child image
    if (this.classList.contains('dropzone--delete')){
        this.classList.add('scaleLarge')
    }
}
function dragleave(e) {
    // e.preventDefault()
    this.classList.remove('ddHovered')

    if (this.classList.contains('dropzone--delete')){
        this.classList.remove('scaleLarge')
    }
}
function drop(e) {
    // https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome
    // e.preventDefault()

    // console.log('##############################')
    // console.log('welcome to drop()...')
    
    let sourceOrder = Number(document.querySelector('#'+e.dataTransfer.getData('text')).dataset.order)
    let targetOrder = Number(this.dataset.order)

    // console.log(`sourceOrder = `, sourceOrder)
    // console.log(`targetOrder = `, targetOrder)

    if (targetOrder == -2){  // dropped into the delete dropzone
        //console.log('handle delete')
        masterDataObj.deleteComp(sourceOrder)
    }
    else{
        //console.log('prepare to swap order...');
        
        // first we have to translate targetOrder into a matching target order...
        // target Order goes from -1, 0, 1, ...  because there is a dropzone before the first item
        // source:    0,  1,  2,  3
        // target: -1,  0,  1,  2,  3
        // if the target is the same or one less than the source, we don't want to do anything! 

        if (targetOrder > sourceOrder || targetOrder < sourceOrder-1){
            masterDataObj.activeCompArray = utilMyReorderArray(masterDataObj.activeCompArray, sourceOrder, targetOrder)
        }
        else{
            //console.log('invalid swap request')
        }
    }

    // hide the delete zone (when dropped into a legit dropzone)
    document.querySelector('#dropzoneDelete').classList.add('hideme')
    document.querySelector('#dropzoneDelete').classList.remove('scaleLarge')
    document.querySelector('#dropzoneDelete').classList.remove('ddHovered')

    masterDataObj.updateView()
}

function dragstart(e) {
    e.dataTransfer.setData('text', this.id)
    this.classList.add('ddItemBeingDragged')

    //console.log('height of right (before):', document.querySelector('.right').scrollHeight)

    // show the delete zone
    document.querySelector('#dropzoneDelete').classList.remove('hideme')

    // grow all of the dropzones
    let allDropZone = document.querySelectorAll('.dropzone')
        allDropZone = utilNodeListToArray(allDropZone)
        allDropZone.map( (item, i) => {
            // everyone except the delete dropzone...
            if (!item.classList.contains('dropzone--delete')){
                item.classList.add('goLarge')
            }
        })

    // setTimeout(function(){ 
    //     console.log('height of right (after):', document.querySelector('.right').scrollHeight);
    //     document.querySelector('.deleteArea').style.height = `${document.querySelector('.right').scrollHeight}px`;
    // }, 300);
    
}
function dragend(e) {
    //console.log('dragend triggered.  this is', this)
    let draggedItem = document.querySelector('.ddItemBeingDragged')
    if (draggedItem){
        draggedItem.classList.remove('ddItemBeingDragged')
    }

    // hide the delete zone (even if not dropped into a legit dropzone)
    document.querySelector('#dropzoneDelete').classList.add('hideme')
    document.querySelector('#dropzoneDelete').classList.remove('scaleLarge')
    document.querySelector('#dropzoneDelete').classList.remove('ddHovered')

    let allDropZone = document.querySelectorAll('.dropzone')
        allDropZone = utilNodeListToArray(allDropZone)
        allDropZone.map( (item, i) => {
            item.classList.remove('goLarge')
            item.classList.remove('ddHovered') // in case any are missed from dragleave
        })
}










function utilMyReorderArray(originalArray, orderSourceNumber=Number(orderSourceNumber), zoneTargetNumber=Number(zoneTargetNumber)){
    // z(drop-zones)    = -1, 0, 1, 2, 3
    // o(order of comp) =  0, 1, 2, 3
    //console.log('originalArray:',originalArray);
    //console.log('orderSourceNumber:',orderSourceNumber);
    //console.log('zoneTargetNumber:',zoneTargetNumber);
    
    // dragging down from a lower number to a higher
    let zToOrder = zoneTargetNumber
    let indexOfItemToMove = orderSourceNumber
    let insertionPoint = zToOrder

    // dragging up from a higher number to a lower
     if (zoneTargetNumber < orderSourceNumber){
         insertionPoint = zToOrder+1
     }

    let clone = originalArray.slice(0);
    //console.log('clone:',clone);

    //console.log('Removing tempGuy...');
    let tempGuy = clone.splice(indexOfItemToMove,1)[0] // returns array so get value of the first and only entry in that array
    //console.log('tempGuy:',tempGuy);
    //console.log('clone:',clone);

    let clone2 = clone.slice(0);

    //console.log('insert tempGuy...')
    clone2.splice(insertionPoint, 0, tempGuy) // the second arg, the 0, says that we are inserting
    //console.log('clone2:',clone2);

    return clone2
}





function dndAddDragDropListeners(){
    // add event listeners to the draggable things
    let allDraggable = document.querySelectorAll('.draggable')
    allDraggable = utilNodeListToArray(allDraggable)
    allDraggable.map( (item, i) => {
        //item.addEventListener("mousedown", dnd_click)
        //item.addEventListener("click", dnd_click2)
        item.addEventListener("dragstart", dragstart)
        item.addEventListener("dragend", dragend)
    })
    //console.log('allDraggable:', allDraggable)


    // add event listeners to the drop targets
    let allDropZone = document.querySelectorAll('.dropzone')
    allDropZone = utilNodeListToArray(allDropZone)
    allDropZone.map( (item, i) => {
        item.addEventListener("dragover", dragover)
        item.addEventListener("dragenter", dragenter)
        item.addEventListener("dragleave", dragleave)
        item.addEventListener("drop", drop)
    })
    //console.log('allDropZone:', allDropZone)
}

function dndRemoveAllDragDropListeners(){
    let allDraggable = document.querySelectorAll('.draggable')
    allDraggable = utilNodeListToArray(allDraggable)
    allDraggable.map( (item, i) => {
        //item.removeEventListener("mousedown", dnd_click)
        item.removeEventListener("dragstart", dragstart)
        item.removeEventListener("dragend", dragend)
    })

    let allDropZone = document.querySelectorAll('.dropzone')
    allDropZone = utilNodeListToArray(allDropZone)
    allDropZone.map( (item, i) => {
        item.removeEventListener("dragover", dragover)
        item.removeEventListener("dragenter", dragenter)
        item.removeEventListener("dragleave", dragleave)
        item.removeEventListener("drop", drop)
    })
}



// sources: 
// https://medium.com/quick-code/simple-javascript-drag-drop-d044d8c5bed5
// https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome



// old stuff

// let utilSwapArrayElements = function(arr, indexA, indexB) {
//     let temp = arr[indexA];
//     arr[indexA] = arr[indexB];
//     arr[indexB] = temp;
// };

// https://medium.com/kevin-salters-blog/reordering-a-javascript-array-based-on-a-drag-and-drop-interface-e3ca39ca25c
function utilReorderArray(originalArray, indexBefore=Number(indexBefore), indexAfter=Number(indexAfter)){
    const movedItem = originalArray.find((item, index) => index === indexBefore);
    const remainingItems = originalArray.filter((item, index) => index !== indexBefore);

    const reorderedItems = [
        ...remainingItems.slice(0, indexAfter),
        movedItem,
        ...remainingItems.slice(indexAfter)
    ];
    console.log('reorderedItems:', reorderedItems)
    return reorderedItems;
}