import { 
    createFiber 
} from "./ReactFiber"

import { 
    isArray, 
    isStringOrNumber, 
    Update
} from "./utils"

function deleteChild (returnFiber, childToDelete) {
    let deletions = returnFiber.deletions
    if(deletions){
        deletions.push(childToDelete)
    }else {
        deletions = [childToDelete]
    }
}

function deleteRemainingChildren (returnFiber, currentFirstChild) {
    let childToDelete = currentFirstChild

    while (childToDelete) {
        deleteChild(returnFiber, childToDelete)
        childToDelete = childToDelete.sibling
    }
}

export function reconcileChildren (returnFiber, children) {
    if(isStringOrNumber(children)){
        return
    }

    let newChildren = isArray(children) ? children : [children]
    let oldFiber = returnFiber.alternate?.child
    let newIndex = 0
    let previousNewFiber = null
    for(newIndex;i < newChildren.length;i++){
        let newChild = newChildren[i]
        let newFiber = createFiber(newChild)
        const same = sameNode(newFiber, oldFiber)

        if (same) {
            Object.assign(newFiber, {
                stateNode: oldFiber.stateNode,
                alternate: oldFiber,
                flags: Update
            })
        }

        if (!same && oldFiber) {
            deleteChild(returnFiber, oldFiber)
        }

        if(oldFiber){
            oldFiber = oldFiber.sibling
        }

        if(previousNewFiber === null){
            returnFiber.child = newFiber         
        }else {
            previousNewFiber.sibling = newFiber
        }

        previousNewFiber = newChild
    }

    if (newIndex === newChildren.length) {
        deleteRemainingChildren(returnFiber, oldFiber)
        return
    }
}

function sameNode (a, b) {
    return a&&b && a.type === b.type && a.key === b.key
}