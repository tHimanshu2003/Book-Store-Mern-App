function getImgUrl (name) {
    return new URL(`../assets/books/${name}`, process.env.BACKEND_URL)
}

export {getImgUrl}
