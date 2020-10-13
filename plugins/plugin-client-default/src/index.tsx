/*
 * Copyright 2020 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react'

import { i18n, inBrowser } from '@kui-shell/core'
import { Kui, KuiProps, ContextWidgets, MeterWidgets, CurrentWorkingDirectory } from '@kui-shell/plugin-client-common'

import { CurrentGitBranch } from '@kui-shell/plugin-git'
import { ProxyOfflineIndicator } from '@kui-shell/plugin-proxy-support'
import { Screenshot, Search } from '@kui-shell/plugin-electron-components'

import { productName } from '@kui-shell/client/config.d/name.json'

import { CurrentUrlWidget, CurrentIdWidget, HelpWidget } from '@kui-shell/plugin-http-shell'

const strings = i18n('plugin-client-default')

/**
 * We will set this bit when the user dismisses the Welcome to Kui
 * tab, so as to avoid opening it again and bothering that user for
 * every new Kui window.
 *
 */
const welcomeBit = 'plugin-client-default.welcome-was-dismissed'

/**
 * Format our body, with extra status stripe widgets
 *   - <CurrentGitBranch />
 *   - <ProxyOfflineIndicator />
 *
 */
export default function renderMain(props: KuiProps) {


  const title = strings('Welcome to Kui')

  return (
    <Kui
      productName={productName}
      prompt='>'
      splitTerminals
      lightweightTables
      {...props}
      toplevel={!inBrowser() && <Search />}
      commandLine={
        props.commandLine || [
          'tab',
          'new',
          '--cmdline',
          'replay /kui/welcome.json',
          '-q', // qexec
          '--bg', // open in background
          '--title',
          title,
          '--status-stripe-type',
          'blue',
          '--status-stripe-message',
          title,
          '--if',
          `kuiconfig not set ${welcomeBit}`,
          '--onClose',
          `kuiconfig set ${welcomeBit}`
        ]
      }
    >
      <ContextWidgets>
        <CurrentWorkingDirectory />
        <CurrentGitBranch className="kui--hide-in-narrower-windows" />
        <CurrentIdWidget />
        <CurrentUrlWidget />
        <HelpWidget />
      </ContextWidgets>

      <MeterWidgets>
        <ProxyOfflineIndicator />
        <Screenshot />
      </MeterWidgets>
    </Kui>
  )
}
