import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const silentDir = path.join(__dirname, "..", "assets", "images", "silent");

const grayWhite = (img) =>
  img
    .grayscale()
    .modulate({ brightness: 1.12, saturation: 0 })
    .linear(1.05, -8)
    .png({ compressionLevel: 9 });

async function processFile(input, output, extract) {
  const base = sharp(input);
  let pipeline = base;
  if (extract) {
    const meta = await base.metadata();
    const w = meta.width || 0;
    const h = meta.height || 0;
    pipeline = sharp(input).extract({
      left: extract.left,
      top: extract.top,
      width: extract.width ?? Math.floor(w / 2),
      height: extract.height ?? h,
    });
  }
  const buf = await pipeline.toBuffer();
  await grayWhite(sharp(buf)).toFile(output);
  console.log("wrote", output);
}

const dual = path.join(silentDir, "sign-thanks-goodbye-src.png");
const meta = await sharp(dual).metadata();
const w = meta.width || 1;
const h = meta.height || 1;
const half = Math.floor(w / 2);

await processFile(
  path.join(silentDir, "sign-hello-particle.png"),
  path.join(silentDir, "sign-hello-particle.png")
);

await processFile(dual, path.join(silentDir, "sign-thanks-particle.png"), {
  left: 0,
  top: 0,
  width: half,
  height: h,
});

await processFile(dual, path.join(silentDir, "sign-goodbye-particle.png"), {
  left: half,
  top: 0,
  width: w - half,
  height: h,
});
