import { tag, repo } from './deploy'
import 'shelljs/global'

exec(`git tag ${tag}`)
exec(`git push ${repo} ${tag}`)
