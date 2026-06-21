// Importation mn le dossier custom li m-généré f la capture
import { PrismaClient } from './generated/prisma/index.js';

const db = new PrismaClient();

export default db;