Login\Register system for meetups app

-register locally  
-login with google  
-login with facebook  

**Changes to login branch, in preparation for front-end code:**

- adds info to package.json  
- installs eslint  
- basic linting completed  
- sets up external stylesheet  
- replaces `config/database.js` with `config/database.example.js` and `config/auth.js` with `config/auth.example.js`, as first step in securing login credentials  
- adds `config/database.js` and `config/auth.js` to .gitignore  
- Makes changes to existing views to match front-end design  
- Adds routes for create and list pages (GET only)
