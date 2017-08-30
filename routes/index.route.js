/**
 * Created by pure on 2017/8/30.
 */
import express from 'express';

const router = express.Router();
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);
export default router;
