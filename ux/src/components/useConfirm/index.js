import { useContext } from "react";
import { ConfirmContext } from "../ConfirmContextProvider";
const useConfirm = () => {
  const [confirm, setConfirm]= useContext(ConfirmContext);
  
  const isConfirmed = (prompt) => {
    const promise = new Promise((resolve, reject) => {
      setConfirm({
        prompt,
        isOpen: true,
        proceed: resolve,
        cancel: reject
      });
    });
    return promise.then(
      () => {
        setConfirm({ ...confirm, isOpen: false });
        return true;
      },
      () => {
        setConfirm({ ...confirm, isOpen: false });
        return false;
      }
    );
  };
  return {
    ...confirm,
    isConfirmed
  };
};

export default useConfirm;