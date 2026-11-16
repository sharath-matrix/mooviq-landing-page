import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const tempDir = resolve('.test-tmp');
mkdirSync(tempDir, { recursive: true });
const outfile = resolve(tempDir, 'mooviq.test.mjs');

try {
  await build({
    entryPoints: ['tests/mooviq.test.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    outfile,
  });

  execFileSync(process.execPath, ['--test', outfile], { stdio: 'inherit' });
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

