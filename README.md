Enable general website watching:
`npm run start`

That won't catch updates to the component code.  For that use: (perhaps in another terminal window)
`npm run buildjs`
This will recreate dist/generatedFiles/megaComponentObject.js with the updates
It combines the uComponents files declared in uComponents/_allComponents.js


