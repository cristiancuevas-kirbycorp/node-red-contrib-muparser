# Publishing to npm

## Pre-Publishing Checklist

✅ Package is ready:
- [x] Version updated in package.json (currently 1.1.0)
- [x] README.md complete with examples
- [x] Keywords optimized for discoverability
- [x] License file present (MIT)
- [x] Repository URL configured
- [x] Author information set
- [x] Test flow examples created
- [x] muParser library vendored (no external dependencies)

## First Time Setup

### 1. Create npm Account
If you don't have an npm account:
```bash
# Visit https://www.npmjs.com/signup
# Or create via CLI:
npm adduser
```

### 2. Login to npm
```bash
npm login
# Enter your username, password, and email
```

### 3. Verify Login
```bash
npm whoami
```

## Publishing Steps

### 1. Final Verification
```bash
# Test build
npm run build

# Create package (test what will be published)
npm pack

# Check contents
tar -tzf node-red-contrib-muparser-1.1.0.tgz
```

### 2. Publish to npm
```bash
# Public publish (first time)
npm publish --access public

# Future updates (after version bump)
npm publish
```

### 3. Verify Publication
```bash
# Check on npm
npm info node-red-contrib-muparser

# Or visit:
# https://www.npmjs.com/package/node-red-contrib-muparser
```

## After Publishing

### Update Node-RED Flow Library
Your package will automatically appear on Node-RED library within 24 hours:
- https://flows.nodered.org/

### Tag the Release on GitHub
```bash
git tag v1.1.0
git push origin v1.1.0
```

### Create GitHub Release
1. Go to: https://github.com/cristiancuevas-kirbycorp/node-red-contrib-muparser/releases
2. Click "Create a new release"
3. Select tag: v1.1.0
4. Title: "v1.1.0 - Major Feature Release"
5. Description: Copy from your changelog/commit messages
6. Publish release

## Future Updates

### Version Bumping
```bash
# Patch (bug fixes): 1.1.0 -> 1.1.1
npm version patch

# Minor (new features): 1.1.0 -> 1.2.0
npm version minor

# Major (breaking changes): 1.1.0 -> 2.0.0
npm version major

# Then publish
npm publish
git push --follow-tags
```

## Troubleshooting

### "Package name already exists"
- Choose a different name or contact npm support if you own the name

### "Must be logged in to publish"
```bash
npm login
```

### "403 Forbidden"
- Check if package name is available: `npm info node-red-contrib-muparser`
- Ensure you have publish rights

### Build Fails During Install
- Users need: Node.js 14+, Python 3, C++ build tools
- Document platform requirements in README (already done!)

## Support

After publishing, users may report issues:
- GitHub Issues: https://github.com/cristiancuevas-kirbycorp/node-red-contrib-muparser/issues
- Node-RED Forum: https://discourse.nodered.org/
- Monitor npm weekly downloads: https://www.npmjs.com/package/node-red-contrib-muparser

## Marketing (Optional)

Promote your package:
- [ ] Post on Node-RED forum: https://discourse.nodered.org/c/share-your-projects
- [ ] Reddit: r/nodered
- [ ] Twitter/X: @NodeRED
- [ ] LinkedIn article about use cases
