import { 
    createFiber 
} from "./ReactFiber"

import { 
    scheduleUpdateOnFiber 
} from "./ReactFiberWorkLoop"

function ReactDomRoot (internalRoot) {
    this._internalRoot = internalRoot
}

ReactDomRoot.prototype.render = function (children) {
    const root = this._internalRoot

    updateContainer(children, root)
}

//入口
function createRoot (container) {
    let root = { containerInfo: container }

    return new ReactDomRoot(root)
}

function updateContainer (element, container) {
    const { containerInfo } = container
    const fiber = createFiber(element, {
        type: containerInfo.nodeName.toLowerCase(),
        stateNode: containerInfo
    })

    scheduleUpdateOnFiber(fiber)
}

export default { createRoot }