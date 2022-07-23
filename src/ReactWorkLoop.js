import { 
    updateHostComponent, 
    updateFunctionComponent, 
    updateClassComponent, 
    updateFragmentComponent, 
    updateHostTextComponent 
} from "./ReactReconciler";

import { 
    Fragment, 
    HostComponent, 
    FunctionComponent, 
    HostText, 
    ClassComponent 
} from "./ReactWorkTags"

let wip = null

function performUnitOfWork () {
    const { tag } = wip

    switch (tag) {
        case HostComponent:
            updateHostComponent(wip)
            break;
        case FunctionComponent:
            updateFunctionComponent(wip)
            break;
        case ClassComponent:
            updateClassComponent(wip)
            break;
        case Fragment:
            updateFragmentComponent(wip)
            break;
        case HostText:
            updateHostTextComponent(wip)
            break;
        default:
            break;
    }

    //下一个更新谁 深度优先遍历
    if (wip.child) {
        wip = wip.child
        return
    }

    let next = wip

    while (next) {
        if (next.sibling) {
            wip = next.sibling
            return
        }

        next = next.return
    }

    wip = null    
}