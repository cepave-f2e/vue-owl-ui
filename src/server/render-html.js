module.exports = ({ appHTML, initState = {} })=> {
  return `<!doctype html>
<meta charset="UTF-8" />
<link href="//fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i" rel="stylesheet" />
<link href="//fonts.googleapis.com/css?family=Source+Code+Pro:400,300,200" rel="stylesheet" />
<link rel="stylesheet" href="//codemirror.net/theme/neo.css" />
<script>window.__STATE= ${JSON.stringify(initState)}</script>
${appHTML}
<script src="//0.0.0.0:3032/lib.js"></script>
<script src="//0.0.0.0:3032/app.js"></script>
`
}
