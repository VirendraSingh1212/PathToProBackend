import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate =
    (schema: z.ZodSchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.parseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation Error",
                        errors: (error as ZodError).issues,
                    });
                    return;
                }
                next(error);
            }
        };
