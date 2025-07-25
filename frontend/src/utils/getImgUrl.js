function getImgUrl (name) {
    return new URL(`../assets/books/${name}`, import.meta.env.BACKEND_URL)
}

export {getImgUrl}
