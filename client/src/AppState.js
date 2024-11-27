import { reactive } from 'vue'
import { logger } from './utils/Logger.js'
import { Folder } from './models/Folder.js'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  coldPriceUSD: 0.00803,
  hotPriceUSD: 0.018,
  accountBytes: 0,
  /**@type {import('@bcwdev/auth0provider-client').Identity} */
  identity: null,
  /** @type {import('./models/Account.js').Account} user info from the database*/
  account: null,

  backup: new Folder({
    id: 'base',
    name: '',
    folder: ''
  }),
  /** @type {Folder} */
  activeDir: null,
  socketMessages: []
})

