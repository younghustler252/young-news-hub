export const handleError = (error) => {
    // First check if the error has a response property (Axios style error)
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    
    // If there's no response, check if it has a general message
    if (error?.message) {
        return error.message;
    }

    // Default fallback message
    return "Something went wrong";
};
