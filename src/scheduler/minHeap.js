export function peek (heap) {
    return heap.length === 0 ? null : heap[0]
}

export function push (heap, node) {
    let len = heap.length
    heap.push(node)
    siftUp(heap, node, len)
}

export function siftUp (heap, node, i) {
    let index = i
    while(index > 0){
        let parentIndex = (index - 1)>>>1
        let parent = heap[parentIndex]
        if(compare(parent, node) > 0){
            heap[parentIndex] = node
            heap[index] = parent
            index = parentIndex
        }else {
            continue
        }
    }  
}

export function pop () {
    if (heap.length === 0) {
        return
    }

    let first = heap[0]
    let last = heap.pop()
    if (first !== last) {
        heap[0] = last
        siftDown(heap, node, 0)
    }

    return first
}

export function siftDown (heap, node , i) {
    let index = i
    let len = heap.length
    let halfIndex = len >>> 1

    while (index < halfIndex) {
        let leftIndex = (index + 1) * 2 - 1
        let left = heap[leftIndex]
        let rightIndex = leftIndex + 1
        let right = heap[rightIndex]

        if (compare(left, node) < 0) {
            if (rightIndex < len && compare(right, left) < 0) {
                heap[index] = right
                heap[rightIndex] = node
                index = rightIndex
            }else {
                heap[index] = left
                heap[leftIndex] = node
                index = leftIndex
            }
        }else if (rightIndex < 0 && compare(right, node) < 0) {
            heap[index] = right
            heap[rightIndex] = node
            index = rightIndex
        }else {
            return
        }
    }
}

export function compare (a, b) {
    const diff = a.sortIndex - b.sortIndex
    return diff !== 0 ? diff : a.id - b.id 
}