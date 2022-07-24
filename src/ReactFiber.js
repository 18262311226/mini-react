import { 
    Placement, 
    isStr, 
    isFn, 
    isUndefined
} from './utils'

import { 
    ClassComponent,
    FunctionComponent, 
    HostComponent, 
    HostText
} from './ReactWorkTags'
import { Fragment } from 'react'

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
        fiber.tag = type.prototype.isReactComponent ? ClassComponent : FunctionComponent
    }else if (isUndefined(type)) {
        fiber.tag = HostText
        fiber.props = { children: vnode }
    }else {
        fiber.tag = Fragment
    }

    return fiber
}