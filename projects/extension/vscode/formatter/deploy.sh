# Bump the patch version
npm --no-git-tag-version version patch

# Create the vsix package
rm -f *.vsix
vsce package

# Create the vsix package name without the extension
vsixPackageName=`ls *.vsix | sed 's/\(.*\)\..*/\1/' `

# Move the .vsix package into the extensions folder
mv *.vsix /home/ba.ad.ssa.gov/212184/.vscode-server/extensions
cd /home/ba.ad.ssa.gov/212184/.vscode-server/extensions
rm -rf lnproject.formatter*
rm -rf extension

# Extract the package into the appropriate extension folder
vsixExtensionFolderName=lnproject.$vsixPackageName
unzip -q $vsixPackageName.vsix 'extension/*'
mv extension $vsixExtensionFolderName
rm -f *.vsix

cd -
echo
echo Completed deploying version $vsixPackageName
echo

