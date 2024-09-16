import React from "react";
import useConfirm from ".././useConfirm";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmModal = () => {
  const {
    prompt = " The Team Will be Removed Permanantly",
    isOpen = false,
    proceed,
    cancel
  } = useConfirm();

  return (
    <Dialog
      open={isOpen}
      onClose={cancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Confirm
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {prompt}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={proceed} autoFocus>
          Ok
        </Button>
        <Button onClick={cancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmModal;