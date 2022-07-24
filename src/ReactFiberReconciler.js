import { 
    createFiber 
} from "./ReactFiber"

import { 
    isArray, 
    isStringOrNumber, 
    updateNode 
} from "./utils"

export function updateHostComponent (wip) {
    if(!wip.stateNode){
        wip.stateNode = document.createElement(wip.type)
        updateNode(wip.stateNode, wip.props)
    }

    reconcileChildren(wip, wip.props.children)
}

export function updateFunctionComponent (wip) {

}

export function updateClassComponent (wip) {

}

export function updateFragmentComponent (wip) {

}

export function updateHostTextComponent (wip) {

}

function reconcileChildren (wip, children) {
    if(isStringOrNumber(children)){
        return
    }

    let newChildren = isArray(children) ? children : [children]
    let previousNewFiber = null
    for(let i = 0;i < newChildren.length;i++){
        let newChild = newChildren[i]
        let newFiber = createFiber(newChild)

        if(previousNewFiber === null){
            wip.child = newFiber         
        }else {
            previousNewFiber.sibling = newFiber
        }

        previousNewFiber = newChild
    }
}