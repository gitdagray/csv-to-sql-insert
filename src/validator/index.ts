export const validateString = (value: any): value is string => {
    if (!value || typeof value !== "string") {
        return false;
    }
    return true;
};
