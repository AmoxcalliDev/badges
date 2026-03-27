export const expiredDate = (dateExpires: string): boolean => {
    return new Date().getTime() < new Date(dateExpires).getTime();
};