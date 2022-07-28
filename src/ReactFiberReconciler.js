import { 
    renderWithHooks 
} from "./hooks"

import { 
    createFiber 
} from "./ReactFiber"

import { 
    isArray, 
    isStringOrNumber, 
    Update, 
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
    renderWithHooks(wip)

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
    let oldFiber = wip.alternate?.child

    let previousNewFiber = null
    for(let i = 0;i < newChildren.length;i++){
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

        if(oldFiber){
            oldFiber = oldFiber.sibling
        }

        if(previousNewFiber === null){
            wip.child = newFiber         
        }else {
            previousNewFiber.sibling = newFiber
        }

        previousNewFiber = newChild
    }
}

function sameNode (a, b) {
    return a&&b && a.type === b.type && a.key === b.key
}