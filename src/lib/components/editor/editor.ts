import type { EditorElement } from "./types";

export function addElement(elements: EditorElement[], element: EditorElement, parentId: string): EditorElement[] {
    return elements.map((item) => {
        if (item.id === parentId && Array.isArray(item.content)) {
            return {
                ...item,
                content: [...item.content, element],
            };
        } else if (item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: addElement(item.content, element, parentId),
            };
        }
        return item;
    })
}

export function insertElementBefore(elements: EditorElement[], element: EditorElement, reference: EditorElement): EditorElement[] {
    return elements.map(item => {
        if (item.id === reference.id && Array.isArray(item.content)) {
            if (Array.isArray(item.content)) {
                const referenceIndex = item.content.indexOf(reference);
                item.content.splice(referenceIndex, 0, element);
            }
        }
        return item;
    });
}

export function updateElement(elements: EditorElement[], element: EditorElement): EditorElement[] {
    return elements.map((item) => {
        if (item.id === element.id) {
            return {
                ...item,
                ...element
            };
        } else if (item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: updateElement(item.content, element),
            };
        }
        return item;
    })
}

export function deleteElement(elements: EditorElement[], element: EditorElement): EditorElement[] {
    return elements.filter((item) => {
        if (item.id === element.id) {
            return false;
        }
        if (item.content && Array.isArray(item.content)) {
            item.content = deleteElement(item.content, element);
        }
        return true;
    })
}
