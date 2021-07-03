/* eslint-disable no-else-return */
import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";

// import modals
import AccLinkAttempted from "./modals/AccLinkAttempted";
import AttemptingToDisconnect from "./modals/AttemptingToDisconnect";
import AttemptingToLink from "./modals/AttemptingToLink";
import DisconnectError from "./modals/DisconnectError";
import DisconnectSuccess from "./modals/DisconnectSuccess";
import LinkingInProgress from "./modals/LinkingInProgress";

export default function LinkAccStatusModal({ linkingAcc, updateState }) {
  // console.log(
  //   "LinkAccStatusModal is open?: ",
  //   linkingAcc.connectStatus.attemptingToLink
  // );

  return (
    <Box>
      {/* conditionally handle which modals to display */}
      {(() => {
        // Account link attempted
        if (linkingAcc.connectStatus.accountLinkAttempted) {
          return (
            <AccLinkAttempted
              linkingAcc={linkingAcc}
              updateState={updateState}
            />
          );
          // attempting to disconnect
        } else if (linkingAcc.disconnectStatus.attemptingToDisconnect) {
          return (
            <AttemptingToDisconnect
              linkingAcc={linkingAcc}
              updateState={updateState}
            />
          );
          // attempting to link
        } else if (linkingAcc.connectStatus.attemptingToLink) {
          return (
            <AttemptingToLink
              linkingAcc={linkingAcc}
              updateState={updateState}
            />
          );
          // disconnect error
        } else if (linkingAcc.disconnectStatus.error) {
          return (
            <DisconnectError
              linkingAcc={linkingAcc}
              updateState={updateState}
            />
          );
          // disconnect success
        } else if (linkingAcc.disconnectStatus.success) {
          return (
            <DisconnectSuccess
              linkingAcc={linkingAcc}
              updateState={updateState}
            />
          );
          // linking in progress
        } else if (linkingAcc.connectStatus.linkingInProgress) {
          return (
            <LinkingInProgress
              linkingAcc={linkingAcc}
              updateState={updateState}
            />
          );
        } else {
          return null;
        }
      })()}
    </Box>
  );
}

LinkAccStatusModal.propTypes = {
  updateState: PropTypes.func,
  linkingAcc: PropTypes.object,
};
