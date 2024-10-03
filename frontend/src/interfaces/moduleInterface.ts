export interface Module {
    _id: string;
    title: string;
    order: number;
    lockUntil: string; // Use string if the date is in ISO format
    isPublished: boolean;
}
