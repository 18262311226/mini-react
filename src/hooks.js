import { 
    scheduleUpdateOnFiber 
} from "./ReactFiberWorkLoop"

let currentlyRenderingFiber = null
let workInProgressHook = null

export function renderWithHooks (wip) {
    currentlyRenderingFiber = wip
    currentlyRenderingFiber.memorizedState = null
    workInProgressHook = null
}

function updateWorkInProgressHook () {
    let hook

    const current = currentlyRenderingFiber.alternate
    if (current) {
        currentlyRenderingFiber.memorizedState = current.memorizedState
        if (workInProgressHook) {
            workInProgressHook = hook = workInProgressHook.next
        } else {   
            workInProgressHook = hook = currentlyRenderingFiber.memorizedState
        }
    } else {
        hook = {
            memorizedState: null,
            next: null
        }
        if(workInProgressHook){
            workInProgressHook = workInProgressHook.next = hook
        } else {
           workInProgressHook = currentlyRenderingFiber.memorizedState = hook
        }
    }

    return hook
}

export function useReducer (reducer, initalState) {
    let hook = updateWorkInProgressHook()

    if (!currentlyRenderingFiber.alternate) {
        hook.memorizedState = initalState
    }

    let dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, hook, reducer)

    return [hook.memorizedState, dispatch]
}

function dispatchReducerAction (fiber, hook, reducer, action) {
    hook.memorizedState = reducer ?  reducer(hook.memorizedState) : action
    currentlyRenderingFiber.alternate = {...fiber}
    fiber.sibling = null
    scheduleUpdateOnFiber(fiber)
}

export function useState (initalState) {
    return useReducer(null, initalState)
}
