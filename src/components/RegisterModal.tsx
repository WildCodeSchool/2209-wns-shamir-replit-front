import React, { BaseSyntheticEvent, useState } from "react";
import modalStyles from "../styles/modal.module.scss";
import styles from "./RegisterModal.module.scss";
import { Button, TextField } from "@mui/material";

type RegisterModalProps = {
  closeModal: () => void;
  registerNewUser: (
    emailInscription: string,
    loginInscription: string,
    passwordInscription: string
  ) => Promise<JSX.Element>;
};

const RegisterModal = ({ closeModal, registerNewUser }: RegisterModalProps) => {
  const [emailInscription, setEmailInscription] = useState("");
  const [passwordInscription, setPasswordInscription] = useState("");
  const [loginInscription, setLoginInscription] = useState("");

  const handleModalClick = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={modalStyles.modalBackground} onClick={closeModal}>
      <div className={modalStyles.modalContainer} onClick={handleModalClick}>
        <h3>Inscription nouvel utilisateur</h3>
        <div className={styles.form}>
          <TextField
            id="outlined-basic"
            label="votre email"
            variant="outlined"
            sx={{
              backgroundColor: "white",
            }}
            value={emailInscription}
            onChange={(e) => {
              setEmailInscription(e.target.value);
            }}
            autoFocus
          />
          <TextField
            id="outlined-basic"
            label="votre identifiant"
            variant="outlined"
            sx={{
              backgroundColor: "white",
            }}
            value={loginInscription}
            onChange={(e) => {
              setLoginInscription(e.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="votre mot de passe"
            variant="outlined"
            type="password"
            sx={{
              backgroundColor: "white",
            }}
            value={passwordInscription}
            onChange={(e) => {
              setPasswordInscription(e.target.value);
            }}
          />
          <Button
            onClick={() =>
              registerNewUser(
                emailInscription,
                loginInscription,
                passwordInscription
              )
            }
            variant="contained"
            color="primary"
          >
            envoyer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
