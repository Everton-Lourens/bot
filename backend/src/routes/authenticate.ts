import express from 'express'
import { AuthenticateController } from '../controllers/AuthenticateController'

const authenticateRoutes = express.Router()
const authenticateController = new AuthenticateController()

authenticateRoutes.post('/signIn', authenticateController.authenticateUser.bind(authenticateController))

authenticateRoutes.post('/refreshToken', authenticateController.refreshToken.bind(authenticateController))

export { authenticateRoutes }
