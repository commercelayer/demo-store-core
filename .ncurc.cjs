module.exports = {
  reject: [
    'pnpm',
    'iframe-resizer',
    'iframe-resizer-react'
  ],
  filterResults: (name, { upgradedVersionSemver }) => {
    if (
      name === '@types/node' && parseInt(upgradedVersionSemver?.major) >= 22 ||
      name === 'eslint' && parseInt(upgradedVersionSemver?.major) >= 9
    ) {
      return false
    }

    return true
  }
}
