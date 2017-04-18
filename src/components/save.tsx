import * as React from "react"
import * as Relay from "react-relay"

import Icon from "./icon"

import styled from "styled-components"
import colors from "../assets/colors"

const SIZE = 40

export interface Props extends RelayProps, React.HTMLProps<SaveButton> {
  artwork: any
  style?: any
  relay?: any
}

export class SaveButton extends React.Component<Props, null> {

  handleSave() {
    this.props.relay.commitUpdate(
      new SaveArtworkMutation({
        artwork: this.props.artwork,
      }),
    )
  }

  render() {
    const { style, artwork } = this.props
    return (
      <div
        className={this.props.className}
        style={style}
        onClick={() => this.handleSave()}
        data-saved={artwork.is_saved}
      >
        <Icon
          name="heart"
          height={SIZE}
          color="white"
          style={{verticalAlign: "middle"}}
        />
      </div>
    )
  }
}

interface RelayProps {
  artwork: {
    is_saved: boolean | null,
  },
}

export const StyledSaveButton = styled(SaveButton)`
  width: ${SIZE}px;
  height: ${SIZE}px;
  text-align: center;
  cursor: pointer;
  color: white;
  background-color: ${colors.gray};
  background-color: rgba(0,0,0,0.4);
  border-radius: 50%;
  font-size: 16px;
  line-height: ${SIZE}px;
  &:hover {
    background-color: black;
  }
  &[data-saved='true'] {
    background-color: ${colors.purpleRegular};
    &:hover {
      background-color: ${colors.redBold};
    }
  } 
`
class SaveArtworkMutation extends Relay.Mutation<Props, null> {

  static fragments = {
    artwork: () => Relay.QL`
      fragment on Artwork {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation {saveArtwork}`
  }

  getVariables() {
    return {
      artwork_id: this.props.artwork.id,
      remove: !!this.props.artwork.is_saved,
    }
  }

  getOptimisticResponse() {
    return {
      is_saved: !this.props.artwork.is_saved,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SaveArtworkPayload {
        is_saved
      }
    `
  }

  getConfigs() {
    return [{
      type: "FIELDS_CHANGE",
      fieldIDs: {
        is_saved: this.props.artwork.id,
      },
    }]
  }
}

export default Relay.createContainer(StyledSaveButton, {
  fragments: {
    artwork: () => Relay.QL`
      fragment on Artwork {
        is_saved
        ${SaveArtworkMutation.getFragment("artwork")}
      }
    `,
  },
})
