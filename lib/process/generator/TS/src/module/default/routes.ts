import { Router } from 'express';
import { defaultController } from './controllers';

const router = Router();

router.get('/', defaultController);

export default router;
