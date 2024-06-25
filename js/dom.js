//This file will handle DOM manipulations.


export function getElement(selector, parent = document) {
    return parent.querySelector(selector);
}

export function createElement(tag, classNames = [], attributes = {}) {
    const element = document.createElement(tag);
    classNames.forEach(className => element.classList.add(className));
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    return element;
}

export function updateElementText(element, text) {
    element.textContent = text;
}
