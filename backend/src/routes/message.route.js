import express from 'express'
import {
    getConversationsForSidebar,
    getMessages,
    getUsersForSidebar,
    sendMessage,
} from '../controllers/message.controller'
import { protectRoute } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = express.Router()

router.use(protectRoute)

router.get('/users', getUsersForSidebar)
router.get('/conversations', getConversationsForSidebar)
router.get('/:id', getMessages)
router.get('/send/:id', upload.single('media'), sendMessage)

export default router