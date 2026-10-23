import type { ScriptTag } from './types'

import baseList from './base'
import prodList from './prod'
import testList from './test'

export default [...baseList, ...(import.meta.env.VITE_APP_ENV === 'prod' ? prodList : testList)] as ScriptTag
