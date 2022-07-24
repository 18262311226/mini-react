import { 
    updateHostComponent, 
    updateFunctionComponent, 
    updateClassComponent, 
    updateFragmentComponent, 
    updateHostTextComponent 
} from "./ReactFiberReconciler";

import { 
    Fragment, 
    HostComponent, 
    FunctionComponent, 
    HostText, 
    ClassComponent 
} from "./ReactWorkTags"
import { Placement } from "./utils";

let wip = null
let wipRoot = null

export function scheduleUpdateOnFiber (fiber) {
    wip = fiber
    wipRoot = fiber
}

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

function workLoop(idleDeadline){
    while (wip && idleDeadline.timeRemaining() > 0) {
        performUnitOfWork()
    }

    if(!wip && wipRoot){
        commitRoot()
    }
}

//调度程序
requestIdleCallback(workLoop)

function commitRoot () {
    commitWork(wipRoot)
    wipRoot = null
}

function commitWork (wip) {
    if(!wip){
        return
    }

    const { flags, stateNode } = wip

    let parentNode = wip.return.stateNode
    if (flags & Placement && stateNode) {
        parentNode.appendChild(stateNode)
    }

    //提交子节点
    commitWork(wip.child)

    //提交兄弟节点
    commitWork(wip.sibling)
}