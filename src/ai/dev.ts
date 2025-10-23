import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-compromised-devices.ts';
import '@/ai/flows/detect-anomalous-network-activity.ts';