import { Router } from 'express'
import { getMockingProducts } from "../controllers/mockingproducts.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";

const routerMockingProducts = Router()

routerMockingProducts.get('/', passportError('current'),authorization(['admin']),getMockingProducts)

export default routerMockingProducts