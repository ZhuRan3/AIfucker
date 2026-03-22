import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  banner: {
    js: `#!/usr/bin/env node`,
  },
  esbuildOptions(options) {
    options.banner = {
      js: `#!/usr/bin/env node`,
    };
  },
});
