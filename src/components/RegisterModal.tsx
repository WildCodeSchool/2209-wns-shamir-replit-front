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

type Fields = "email" | "password" | "login";

const verif = (stateType: Fields, state: string) => {
  const regVerif = {
    email: state.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    password: state.match(
      /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
    ),
    login: state.match(/^[a-zA-Z0-9_\-]{3,15}$/),
  };

  return regVerif[stateType];
};

const RegisterModal = ({ closeModal, registerNewUser }: RegisterModalProps) => {
  const [emailInscription, setEmailInscription] = useState("");
  const [passwordInscription, setPasswordInscription] = useState("");
  const [loginInscription, setLoginInscription] = useState("");

  const [wrongEmail, setWrongEmail] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [wrongLogin, setWrongLogin] = useState(false);

  const setState = {
    email: setWrongEmail,
    password: setWrongPassword,
    login: setWrongLogin,
  };
  const getState = {
    email: emailInscription,
    password: passwordInscription,
    login: loginInscription,
  };

  const verifySingleField = (field: Fields, value?: string | undefined) => {
    const fieldValue = value !== undefined ? value : getState[field];
    const status = fieldValue !== "" && !verif(field, fieldValue);

    setState[field](status);
  };

  const verifyBeforeRegister = () => {
    const fields: Fields[] = ["email", "password", "login"];

    const verifiedFields = fields.map((field) => ({
      field,
      value: getState[field],
      status: !verif(field, getState[field]),
    }));

    verifiedFields.map((vField) => {
      setState[vField.field](vField.status);
    });

    if (verifiedFields.every((vField) => !vField.status))
      registerNewUser(emailInscription, loginInscription, passwordInscription);
  };

  const getValidEmoji = (valid: boolean) => (valid ? "✅" : "💩");
  const validEmail = () => emailInscription.length > 0 && !wrongEmail;
  const validLoginSize = () =>
    loginInscription.length > 2 && loginInscription.length < 16;
  const validLoginCar = () =>
    (loginInscription.match(/^[a-zA-Z0-9_\-]+$/) || []).length > 0;
  const validPasswordSize = () => passwordInscription.length > 7;
  const validPasswordMin = () =>
    (passwordInscription.match(/[a-z]+/) || []).length > 0;
  const validPasswordMaj = () =>
    (passwordInscription.match(/[A-Z]+/) || []).length > 0;
  const validPasswordNum = () =>
    (passwordInscription.match(/[0-9]+/) || []).length > 0;
  const validPasswordSpecCar = () =>
    (passwordInscription.match(/[@#$%^&+=]+/) || []).length > 0;

  const getformInfos = () => (
    <>
      <div>
        <span>{getValidEmoji(validEmail())}</span> Email valide
      </div>
      <div>
        <span>{getValidEmoji(validLoginSize())}</span> identifiant entre 3 et 15
        caractères
      </div>
      <div>
        <span>{getValidEmoji(validLoginCar())}</span> caractères autorisés dans
        identifiant : A-Z a-z 0-9 _ -
      </div>
      <div>
        <span>{getValidEmoji(validPasswordSize())}</span> mot de passe d&apos;au
        moins 8 caractères
      </div>
      <div>
        <span>{getValidEmoji(validPasswordMin())}</span> mot de passe contient
        au moins 1 minuscule{" "}
      </div>
      <div>
        <span>{getValidEmoji(validPasswordMaj())}</span> mot de passe contient
        au moins 1 majuscule{" "}
      </div>
      <div>
        <span>{getValidEmoji(validPasswordNum())}</span> mot de passe contient
        au moins 1 chiffre{" "}
      </div>
      <div>
        <span>{getValidEmoji(validPasswordSpecCar())}</span> mot de passe
        contient au moins 1 caractère spécial (@#$%^&+=)
      </div>
    </>
  );

  const handleFieldChange = (
    e: BaseSyntheticEvent,
    fieldType: "email" | "password" | "login"
  ) => {
    const value = e.target.value;
    const setState = {
      email: setEmailInscription,
      password: setPasswordInscription,
      login: setLoginInscription,
    };

    verifySingleField(fieldType, value);
    setState[fieldType](value);
  };

  const handleModalClick = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={modalStyles.modalBackground} onClick={closeModal}>
      <div className={modalStyles.modalContainer} onClick={handleModalClick}>
        <h3>Inscription nouvel utilisateur</h3>
        <div className={styles.registerContainer}>
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
                handleFieldChange(e, "email");
              }}
              error={wrongEmail}
              autoFocus
              onBlur={() => verifySingleField("email")}
            />
            {/* <span className={styles.errorSpan}> */}
            {/*   {wrongEmail ? "votre email n'est pas valide" : ""} */}
            {/* </span> */}
            <TextField
              id="outlined-basic"
              label="votre identifiant"
              variant="outlined"
              sx={{
                backgroundColor: "white",
              }}
              value={loginInscription}
              onChange={(e) => {
                handleFieldChange(e, "login");
              }}
              error={wrongLogin}
              onBlur={() => verifySingleField("login")}
            />
            {/* <span className={styles.errorSpan}> */}
            {/*   {wrongLogin */}
            {/*     ? 'votre login n\'est pas valide, il doit contenir entre 3 et 15 caractères (minuscules, majuscules, chiffres et "_" "-")' */}
            {/*     : ""} */}
            {/* </span> */}
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
                handleFieldChange(e, "password");
              }}
              error={wrongPassword}
              onBlur={() => verifySingleField("password")}
            />
            {/* <span className={styles.errorSpan}> */}
            {/*   {wrongPassword */}
            {/*     ? "votre mot de passe n'est pas valide, il doit contenir au moins 8 caractères dont 1 caractère minuscule, 1 caractère majuscule et 1 caractère spécial" */}
            {/*     : ""} */}
            {/* </span> */}
            <Button
              onClick={verifyBeforeRegister}
              variant="contained"
              color="primary"
              disabled={wrongLogin || wrongEmail || wrongPassword}
            >
              envoyer
            </Button>
          </div>
          <div className={styles.formInfos}>
            <div className={styles.info}>{getformInfos()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
