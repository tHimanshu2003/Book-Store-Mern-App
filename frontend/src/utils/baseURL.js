const getBaseUrl = () => {
    return process.env.BACKEND_URL || "http://localhost:5000"
}

export default getBaseUrl;
