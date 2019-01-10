import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import { Modal as BootstrapModal, Button } from "react-bootstrap";
import { getModalInstance, getEntity, getIsShowing } from "../selectors/modals";
import { connect } from "react-redux";

import {
  CREATE_PROPERTY,
  EDIT_PROPERTY,
  DELETE_PROPERTY,
  setModal,
  clearModal
} from "../actions/modal";
import { getCurrentDeviceName } from "../selectors/currentDevice";
import DeleteProperty from "./DeleteProperty";
import AddProperty from "./AddProperty";
import EditProperty from "./EditProperty";
import PropTypes from "prop-types";
import Login from "./Login";

const modalRoot = document.getElementById("modal");

class ModalPortal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  parseTangoDB(props) {
    return (props || this.props).match.params.tangoDB;
  }

  render() {
    //const { title, body, footer } = this.props;
    return ReactDOM.createPortal(this.props.children, this.el);
    // <BootstrapModal.Header>
    //   <BootstrapModal.Title>{title}</BootstrapModal.Title>
    // </BootstrapModal.Header>
    // <BootstrapModal.Body>{body}</BootstrapModal.Body>
    // <BootstrapModal.Footer>{footer}</BootstrapModal.Footer>

    // const { isShowing, entity, modalInstance, currentDevice } = this.props;

    // switch (modalInstance) {
    //   case CREATE_PROPERTY:
    //     return (
    //       <AddProperty
    //         entity={entity}
    //         currentDevice={currentDevice}
    //         closeDialog={this.props.closeDialog}
    //         tangoDB={this.parseTangoDB()}
    //       />
    //     );
    //   case EDIT_PROPERTY:
    //     return (
    //       <EditProperty
    //         entity={entity}
    //         currentDevice={currentDevice}
    //         closeDialog={this.props.closeDialog}
    //         tangoDB={this.parseTangoDB()}
    //       />
    //     );
    //   case DELETE_PROPERTY:
    //     return (
    //       <DeleteProperty
    //         entity={entity}
    //         currentDevice={currentDevice}
    //         closeDialog={this.props.closeDialog}
    //         tangoDB={this.parseTangoDB()}
    //       />
    //     );
    //   case "LOGIN":
    //     return <Login closeDialog={this.props.closeDialog} />;
    //   default:
    //     return null;
    // }
  }
}

// Modal.propTypes = {
//   isShowing: PropTypes.bool,
//   entity: PropTypes.string,
//   modalInstance: PropTypes.string,
//   currentDevice: PropTypes.string
// };

// function mapStateToProps(state) {
//   return {
//     isShowing: getIsShowing(state),
//     entity: getEntity(state),
//     modalInstance: getModalInstance(state),
//     currentDevice: getCurrentDeviceName(state)
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     closeDialog: () => dispatch(clearModal())
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Modal);

// export const Footer = Modal.Footer;
// export const Header = Modal.Header;
// export const Title = Modal.Title;

export default class ModalForm extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <ModalPortal>
        <BootstrapModal.Dialog>
          <BootstrapModal.Header>
            <BootstrapModal.Title>{title}</BootstrapModal.Title>
          </BootstrapModal.Header>
          {children}
        </BootstrapModal.Dialog>
      </ModalPortal>
    );
  }
}

ModalForm.Body = BootstrapModal.Body;
ModalForm.Footer = BootstrapModal.Footer;
