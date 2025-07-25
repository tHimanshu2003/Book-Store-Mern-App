const getBaseUrl = () => {
    return import.meta.env.BACKEND_URL || "http://localhost:5000"
}

export default getBaseUrl;
