import React from 'react'
import {
  AragonApp,
  Button,
  Text,
  Input,

  observe
} from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {
  render () {
    return (
      <AppContainer>
        <div>
          <Input onClick={() => this.props.app.decrement(1)}>Enter your ens name</Button>
          <Button onClick={() => this.props.app.increment(1)}>Increment</Button>
        </div>
      </AppContainer>
    )
  }
}

const ObservedCount = observe(
  (state$) => state$,
  { count: 0 }
)(
  ({ count }) => <Text.Block style={{ textAlign: 'center' }} size='xxlarge'>{count}</Text.Block>
)
