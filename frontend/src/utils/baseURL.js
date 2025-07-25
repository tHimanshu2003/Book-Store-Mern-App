const getBaseUrl = () => {
    return import.meta.env.BACKEND_URI || "http://localhost:5000"
}

export default getBaseUrl;
