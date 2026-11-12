import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const tempDir = mkdtempSync(join(tmpdir(), 'mooviq-test-'));
const outfile = join(tempDir, 'mooviq.test.mjs');

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
