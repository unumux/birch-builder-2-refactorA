let masterDataObj = {
    guid: 0,
    activeCompArray: [],
    addCompToActiveCompArrayByTemplateId: function(templateId){
        //console.log('[masterDataObj.js] welcome to addCompToActiveCompArray...')

        let dataObj = {}
        if (state.theme == 'unum'){
            dataObj = JSON.parse(JSON.stringify(megaComponentObject[templateId].unumObj))
        }
        else if (state.theme == 'colonial'){
            dataObj = JSON.parse(JSON.stringify(megaComponentObject[templateId].colonialObj))
        }
        else{
            dataObj = JSON.parse(JSON.stringify(megaComponentObject[templateId].unumObj))
        }
        console.log('dataObj:', dataObj)

        // create and object to insert into the activeCompArray
        let newCompObj = {
            guid: this.guid, 
            template: templateId,
            order: 0,
            // isBeingEdited: false,
            //compCode: megaComponentObject[templateId] // get matching template object from the generated megaComponentObject...
            compCode: JSON.parse(JSON.stringify(megaComponentObject[templateId].code)), // get matching template object from the generated megaComponentObject...
            // the above is used to avoid making all new object referring to the same.  Objects need to be cloned or they all point to the orig obj.
            compData: dataObj
        }

        this.activeCompArray.push(newCompObj)
        this.guid++
        
        this.updateView()
    },
    deleteComp: function(index){
        //console.log('welcome to the deleteComp method...')
        //console.log('index = ', index)
        // for (let i=0; i<this.activeCompArray.length; i++){
        //     if (this.activeCompArray[i].order*1 == orderNumber*1){
        //         return this.activeCompArray[i].guid
        //     }
        // }
        this.activeCompArray.splice(index,1)
        this.updateView()
        //privateUserSwitchToComponentView()
    },
    updateView: function(){
        // remove existing dragdrop event listeners...
        //dndRemoveAllDragDropListeners()

        // clear the target container
        // document.querySelector('#emailCodeDiv').innerHTML = ''
        document.querySelector('#draggableContainer').innerHTML = ''

        // let emailString = ''
        // let emailPreviewString = `<div id="dropzoneA" class="dropzone" data-order="-1"></div>`
        // let draggableItem = ''
        let targetRenderElement = document.querySelector('#draggableContainer')

        // <div id="draggable0" class="draggable" draggable="true">dragme0</div>
        this.activeCompArray.map( (item, i) => {
            //item.order = i
            //console.log('[updateView] item.isBeingEdited:', item.isBeingEdited)
            // let mergedCode = mainMergeDataIntoPlaceholders(item.compCode.code, item.compCode.unumObj)
            //let mergedCode = mainMergeDataIntoPlaceholders(megaComponentObject[item.template].code, item.compCode.saveObj)
            //let mergedCode = mainMergeDataIntoPlaceholders(megaComponentObject[item.template].code, item.compData)
            let mergedCode = mainMergeDataIntoPlaceholders2(item.guid)
            
            
            //console.log('mergedCode:', mergedCode);
            
    
            //draggableItem += `<div id="draggable${i}" class="draggable" draggable="true">${mergedCode}</div>`
            let createdEl1 = document.createElement("div")
            createdEl1.id = 'draggable'+item.guid
            createdEl1.className = 'draggable'

            let att = document.createAttribute("draggable");
            att.value = `true`;
            createdEl1.setAttributeNode(att);

            att = document.createAttribute("data-guid");
            att.value = item.guid;
            createdEl1.setAttributeNode(att);

            createdEl1.innerHTML = mergedCode
            createdEl1.addEventListener("click", userCompInEmailClick)
            //targetRenderElement.appendChild(createdEl1)
            
            //draggableItem += `<div id="draggable${i}" class="draggable" draggable="true">${mergedCode}</div>`
            //console.log(mergedCode)
            // emailString += `<div id="draggable${i}" class="draggable" data-guid="${item.guid}" data-order="${i}" draggable="true">
            //                     <div class="avoid-clicks">
            //                     ${mergedCode}
            //                     </div>
            //                 </div>`

            // emailPreviewString += `<div id="draggable${i}" class="draggable${item.isBeingEdited ? ' isBeingEdited' : ''}" onclick="userEmailCompClick(this)" data-guid="${item.guid}" data-order="${i}" draggable="true">
            //                             <div class="avoid-clicks">
            //                             ${mergedCode}
            //                             </div>
            //                        </div>
            //                        <div id="dropzone${i}" data-order="${i}" class="dropzone"></div>`
            targetRenderElement.appendChild(createdEl1)
        })
        // document.querySelector('#emailCodeDiv').innerHTML = emailPreviewString
        //console.log(draggableItem)
        //document.querySelector('#draggableContainer').innerHTML = draggableItem
        //append(draggableItem, document.querySelector('#draggableContainer'))

        //dndAddDragDropListeners()
    }

}