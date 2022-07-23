import { 
    Placement, 
    isStr, 
    isFn 
} from './utils'

import { 
    FunctionComponent, 
    HostComponent 
} from './ReactWorkTags'

export function createFiber (vnode, returnFiber) {
    const fiber = {
        type: vnode.type,
        key: vnode.key,
        props: vnode.props,
        stateNode: null,
        child: null,
        sibling: null,
        return: returnFiber,
        flags: Placement,
        index: null
    }

    let { type } = vnode

    if(isStr(type)){
        fiber.tag = HostComponent
    }else if (isFn(type)) {
        fiber.tag = FunctionComponent
    }

    return fiber
}