import { Response } from 'express';

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

function errorHandler(e: unknown, res: Response, message = ""): Response {
    if (isErrorWithMessage(e)) {
        console.error(message, e.message); 
        return res.status(400).json({ error: e.message });
    } else {
        console.error("Erro inesperado:", e); 
        return res.status(500).json({ error: "Ocorreu um erro interno inesperado." });
    }
}

export { errorHandler };