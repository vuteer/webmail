// localstorage 
// set item 
// get item 
// remove  item


// Function to set an item in local storage
const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

// const to remove an item from local storage
const removeLocalStorageItem = (key) => {
    localStorage.removeItem(key);
}

// const to get an item from local storage
const getLocalStorageItem = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

export {
    setLocalStorageItem, removeLocalStorageItem, getLocalStorageItem
}