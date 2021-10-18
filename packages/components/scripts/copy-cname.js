const fs = require('fs-extra');

fs.copySync('./scripts/CNAME', './docs-dist/CNAME');
