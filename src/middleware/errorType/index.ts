class IFoundError extends Error {
    readonly statusCode: number;
    readonly errors: Array<string>;
    constructor(message: string, status: number, errors: Array<string>) {
        super(message);
        this.statusCode = status;
        this.errors = errors;
    }
}
export { IFoundError }
