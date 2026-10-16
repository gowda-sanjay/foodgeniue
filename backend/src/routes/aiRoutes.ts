import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { chatAiController, searchAiController, imageAiController, voiceAiController, recommendAiController } from '../controllers/aiController';
import { validateRequest } from '../middlewares/validateRequest';
import { chatSchema, searchSchema, imageSchema, voiceSchema, recommendSchema } from '../validators/aiSchemas';

export const aiRouter = Router();

aiRouter.use(authMiddleware);
aiRouter.post('/chat', validateRequest(chatSchema), chatAiController);
aiRouter.post('/search', validateRequest(searchSchema), searchAiController);
aiRouter.post('/image', validateRequest(imageSchema), imageAiController);
aiRouter.post('/voice', validateRequest(voiceSchema), voiceAiController);
aiRouter.post('/recommend', validateRequest(recommendSchema), recommendAiController);
