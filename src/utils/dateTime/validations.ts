export const expiredDate = (dateExpires: string): boolean => {
    return Date.now() < new Date(dateExpires).getTime();
};