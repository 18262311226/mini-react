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
    const { type, props } = wip 

    const children = type(props)

    reconcileChildren(wip, children)
}

export function updateClassComponent (wip) {
    const { type, props } = wip 

    const instance = new type(props)
    const children = instance.render()

    reconcileChildren(wip, children)
}

export function updateFragmentComponent (wip) {
    reconcileChildren(wip, wip.props.children)
}

export function updateHostTextComponent (wip) {
    wip.stateNode = document.createTextNode(wip.props.children)
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