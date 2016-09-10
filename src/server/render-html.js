module.exports = ({appHTML})=> {
  return `<!doctype html>
<script>window.__STATE= ${JSON.stringify({})}</script>
${appHTML}
<script src="//0.0.0.0:3032/lib.js"></script>
<script src="//0.0.0.0:3032/app.js"></script>
`
}
