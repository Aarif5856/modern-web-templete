/* Build script for ModernWeb
 * - Minifies HTML/CSS/JS into dist/
 * - Copies assets, themes, docs
 * - Optionally compiles Tailwind if CLI available (for purge)
 * - Creates modernweb-v1.0.zip
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const archiver = require('archiver');
const { minify: minifyHtml } = require('html-minifier-terser');
const Terser = require('terser');
const CleanCSS = require('clean-css');
const { spawnSync } = require('child_process');

const root = __dirname;
const dist = path.join(root, 'dist');

async function minifyHTMLFile(src, dest) {
  const html = await fs.readFile(src, 'utf8');
  const out = await minifyHtml(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    sortAttributes: true,
    sortClassName: true,
  });
  await fs.outputFile(dest, out);
}

async function minifyCSSFile(src, dest) {
  const css = await fs.readFile(src, 'utf8');
  const out = new CleanCSS({ level: 2 }).minify(css).styles;
  await fs.outputFile(dest, out);
}

async function minifyJSFile(src, dest) {
  const js = await fs.readFile(src, 'utf8');
  const out = await Terser.minify(js, { compress: true, mangle: true });
  if (out.error) throw out.error;
  await fs.outputFile(dest, out.code);
}

async function tryTailwindBuild() {
  // Optional: compile Tailwind if CLI present
  const cli = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tailwindcss', '-v'], { cwd: root, stdio: 'ignore' });
  if (cli.status !== 0) {
    console.log('ℹ️  Tailwind CLI not found. Using CDN in index.html.');
    return false;
  }
  console.log('🌀 Compiling Tailwind CSS with purge...');
  const input = path.join('assets', '_tailwind-input.css');
  const outCss = path.join('dist', 'assets', 'tailwind.css');
  const args = ['tailwindcss', '-i', input, '-o', outCss, '--minify', '--content', 'index.html', 'script.js', 'docs/usage-guide.html'];
  const res = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, { cwd: root, stdio: 'inherit' });
  if (res.status === 0) {
    console.log('✅ Tailwind compiled to dist/assets/tailwind.css');
    return true;
  }
  console.log('⚠️  Tailwind build failed; continuing with CDN.');
  return false;
}

async function copyStatic() {
  await fs.copy(path.join(root, 'assets'), path.join(dist, 'assets'));
  await fs.copy(path.join(root, 'themes'), path.join(dist, 'themes'));
  await fs.copy(path.join(root, 'docs'), path.join(dist, 'docs'));
  // config for dynamic rendering
  await fs.copy(path.join(root, 'config.json'), path.join(dist, 'config.json'));
}

async function build() {
  console.log('🧹 Cleaning dist/');
  await fs.remove(dist);
  await fs.ensureDir(dist);

  console.log('📄 Minifying HTML');
  await minifyHTMLFile(path.join(root, 'index.html'), path.join(dist, 'index.html'));
  await minifyHTMLFile(path.join(root, 'docs', 'usage-guide.html'), path.join(dist, 'docs', 'usage-guide.html'));

  console.log('🎨 Minifying CSS');
  await minifyCSSFile(path.join(root, 'styles.css'), path.join(dist, 'styles.css'));
  await minifyCSSFile(path.join(root, 'themes', 'light.css'), path.join(dist, 'themes', 'light.css'));
  await minifyCSSFile(path.join(root, 'themes', 'dark.css'), path.join(dist, 'themes', 'dark.css'));

  console.log('🧩 Minifying JS');
  await minifyJSFile(path.join(root, 'script.js'), path.join(dist, 'script.js'));

  console.log('📦 Copying static assets');
  await copyStatic();

  await tryTailwindBuild();

  console.log('🗜️  Creating archive modernweb-v1.0.zip');
  const zipPath = path.join(root, 'modernweb-v1.0.zip');
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(dist + '/', false);
    archive.finalize();
  });

  console.log('✅ Build complete – ready for upload');
}

build().catch(err => { console.error(err); process.exit(1); });

