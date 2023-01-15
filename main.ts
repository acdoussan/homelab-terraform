import * as dotenv from 'dotenv';
import * as path from 'path';

import { HomelabApp } from 'src/app';

dotenv.config({ path: path.resolve(__dirname, 'secrets', '.env') });

const app = new HomelabApp();
app.synth();
