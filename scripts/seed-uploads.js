// scripts/seed-uploads.js
import { cpSync, existsSync } from "fs";
import path from "path";

const FIXTURES_DIR = path.resolve("tests/fixtures");
const UPLOADS_DIR = path.resolve("/uploads/media/chats/_demo");

if (!existsSync(FIXTURES_DIR)) {
  console.log("⏭️  Нет тестовых фикстур, пропускаю seed");
  process.exit(0);
}

cpSync(FIXTURES_DIR, UPLOADS_DIR, { recursive: true });
console.log(`✅ Скопированы тестовые файлы в ${UPLOADS_DIR}`);
