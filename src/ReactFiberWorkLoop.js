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

import { 
    scheduleCallback 
} from "./scheduler";

import { 
    Placement, Update, updateNode 
} from "./utils";

let wip = null
let wipRoot = null

export function scheduleUpdateOnFiber (fiber) {
    wip = fiber
    wipRoot = fiber

    scheduleCallback(workLoop)
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

function workLoop(){
    while (wip) {
        performUnitOfWork()
    }

    if(!wip && wipRoot){
        commitRoot()
    }
}

//调度程序
// requestIdleCallback(workLoop)

function commitRoot () {
    commitWork(wipRoot)
    wipRoot = null
}

function commitWork (wip) {
    if(!wip){
        return
    }

    const { flags, stateNode } = wip

    let parentNode = getParentNode(wip.return)
    if (flags & Placement && stateNode) {
        parentNode.appendChild(stateNode)
    }

    if (flags & Update && stateNode) {
        updateNode(stateNode, wip.alternate.props, wip.props)
    }

    //提交子节点
    commitWork(wip.child)

    //提交兄弟节点
    commitWork(wip.sibling)
}

function getParentNode (wip) {
    let temp = wip

    while(temp){
        if (temp.stateNode) {
            return temp.stateNode
        }
        temp = temp.return
    }
}