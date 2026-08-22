import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicFile = path.join(root, "shared", "pantanal.ts");
const batchDir = path.join(root, "shared", "catalog", "batches");
const publicText = fs.readFileSync(publicFile, "utf8");
const batchFiles = fs.readdirSync(batchDir).filter((name) => name.endsWith(".ts")).sort();
const batchText = batchFiles.map((name) => fs.readFileSync(path.join(batchDir, name), "utf8")).join("\n");
const count = (text, pattern) => (text.match(pattern) ?? []).length;
const groups = ["Mamíferos", "Aves", "Répteis", "Anfíbios", "Peixes", "Invertebrados"];
const publicCount = count(publicText, /\bid:\s*["']/g);
const modularCount = count(batchText, /\bid:\s*["']/g);
const modularImages = count(batchText, /\bimages:\s*\[/g) * 3;
const pending = count(batchText, /status:\s*["']pending-review["']/g);
const verified = count(batchText, /status:\s*["']verified["']/g);
const reviewReady = count(batchText, /status:\s*["']review-ready["']/g);
const rows = groups.map((group) => {
  const publicGroup = (publicText.match(new RegExp(`group:\\s*["']${group}["']`, "g")) ?? []).length;
  const modularGroup = (batchText.match(new RegExp(`group:\\s*["']${group}["']`, "g")) ?? []).length;
  return { group, public: publicGroup, modular: modularGroup };
});
console.log(JSON.stringify({ generatedAt: new Date().toISOString(), publicSpecies: publicCount, modularSpecies: modularCount, totalSpecies: publicCount + modularCount, modularBatches: batchFiles.length, pendingReviewBatches: pending, verifiedBatches: verified, reviewReadyBatches: reviewReady, modularImages, groups: rows }, null, 2));
