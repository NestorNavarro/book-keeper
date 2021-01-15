const modal = document.getElementById('modal');
const modalshow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show Modal, Focus on Input
const showModal = () => {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Build Bookmarks DOM
const buildBookmarks = () => {
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';
    // Build items
    Object.keys(bookmarks).forEach((id) =>{
        const { name, url } = bookmarks[id];
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        //Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times-circle');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favaicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Apppend to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch Bookmarks
const fetchBookmarks = () => {
    // Get bookmarks from localStorage if avaible 
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage 
        const id = 'https://github.com/NestorNavarro';
        bookmarks[id] = {
                name: 'GitHub',
                url: 'https://github.com/NestorNavarro',
        }
        
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Handle Data from Form
const storeBookmark = (e) => {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://') && !urlValue.includes('https://')) {
        urlValue = `https://${urlValue}`
    }
    if(!validate(nameValue, urlValue)) {
        return false;
    } 
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    if(bookmarks[urlValue]){
        alert("This item already exists. You can't add a new bookmarks with the same URL");
    } else {
        bookmarks[urlValue] = bookmark;
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        fetchBookmarks();
        bookmarkForm.reset();
        websiteNameEl.focus();
    }
} 

// Validate Form
const validate = (nameValue, urlValue) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valida web adress');
        return false;
    }
    return true;
}

// Delete Bookmark
const deleteBookmark = (id) => {
    if(bookmarks[id]) {
        delete bookmarks[id];
    }
    // Update bookmarks array in localStrorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Modal Event Listeners
modalshow.addEventListener('click', showModal);
modalClose.addEventListener('click', (() => modal.classList.remove('show-modal')));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Event Listener 
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();
