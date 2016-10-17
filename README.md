# galeri

### How to dev:

```bash
npm run dev
```

### How to package:
```
npm run package
```

### How to release:

1. Bump the version using `npm version [major|minor|patch]`.
2. Run packaging scripts and push.
3. Create a new release on github.
4. Update the `auto_updater.json` in the root directory to point to the new release
