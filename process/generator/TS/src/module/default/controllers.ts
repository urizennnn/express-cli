import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export const defaultController = (_: Request, res: Response) => {
	res.status(StatusCodes.OK).json({ message: "Hello World" })
}
