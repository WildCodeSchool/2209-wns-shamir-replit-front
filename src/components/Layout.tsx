import React, { ReactNode, useContext } from "react";
import ForceProjectListUpdateContext from "../contexts/forceProjectListUpdateContext";
import ShareModalContext from "../contexts/shareModalContext";
import styles from "./Layout.module.scss";
import ShareModal from "./ShareModal";

type Children = { children: ReactNode };

const Layout = ({ children }: Children) => {
  const { shareModal, setShareModal } = useContext(ShareModalContext);
  const { setForceProjectListUpdate } = useContext(
    ForceProjectListUpdateContext
  );

  const closeShareModal = () => {
    setShareModal({});
    setForceProjectListUpdate(true);
  };

  return (
    <>
      <div className={styles.layoutContainer}>
        <div>{children}</div>
      </div>
      {shareModal.projectId !== undefined && (
        <ShareModal closeShareModal={closeShareModal} />
      )}
    </>
  );
};

export default Layout;
