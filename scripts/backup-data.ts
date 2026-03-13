import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as fs from 'fs';
import * as path from 'path';
import { encrypt } from './utils/encryption';
import { uploadToGCS } from './utils/gcs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🚀 Starting system-wide backup (encrypted + cloud) for HandyForMe...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  if (!process.env.BACKUP_SECRET) {
    console.error('❌ BACKUP_SECRET environment variable is not set.');
    process.exit(1);
  }

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL as string });
  const prisma = new PrismaClient({ adapter });

  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      payload: {
        users: await prisma.user.findMany(),
        decisionHelperLists: await prisma.decisionHelperList.findMany({
          include: { items: true }
        }),
        decisionHelperItems: await prisma.decisionHelperItem.findMany(),
        visualBoardItems: await prisma.visualBoardItem.findMany(),
        bucketListItems: await prisma.bucketListItem.findMany(),
        shortcutCategories: await prisma.shortcutCategory.findMany({
          include: { shortcuts: true }
        }),
        shortcuts: await prisma.shortcut.findMany(),
        weeklyWins: await prisma.weeklyWin.findMany(),
        yearPromises: await prisma.yearPromise.findMany(),
      }
    };

    const timestamp = new Date().toISOString();
    const fileName = `backup_${timestamp.replace(/[:.]/g, '-')}.json.enc`;
    const backupsDir = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const backupJson = JSON.stringify(backupData, null, 2);
    const encryptedData = encrypt(backupJson);

    // Save 'latest' version locally for tracking
    const latestPath = path.join(backupsDir, 'automated_latest.json.enc');
    fs.writeFileSync(latestPath, encryptedData);

    // Save timestamped version locally
    const filePath = path.join(backupsDir, fileName);
    fs.writeFileSync(filePath, encryptedData);

    console.log(`✅ Local encrypted backup saved to: ${filePath}`);

    // Cloud Upload
    try {
      await uploadToGCS(filePath, fileName);
      await uploadToGCS(latestPath, 'automated_latest.json.enc');
    } catch (cloudError) {
      console.error('⚠️ Cloud upload failed, but local backups were saved.');
    }

    console.log(`📊 Exported all system data.`);
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
