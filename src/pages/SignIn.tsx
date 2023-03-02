import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signin.module.scss";
import { TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button/Button";
import { userAPI } from "../api/userAPI";
import { authAPI } from "../api/authAPI";
import UserContext from "../contexts/userContext";
import RegisterModal from "../components/RegisterModal";
import { CreateUser } from "../interfaces/IUser";
import { api } from "../api/_graphQL";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState<boolean>(false);
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogin = async () => {
    const { token, userId } = await authAPI.getToken(email, password);

    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("token", token);

    const user = (await userAPI.getAll()).filter(
      (u) => u.id === userId.toString()
    )[0];

    setUser({ ...user, id: userId.toString() });
    await api.resetStore();
    // eslint-disable-next-line no-restricted-globals
    location.reload();

    navigate("/");
  };

  const registerNewUser = async (
    emailInscription: string,
    loginInscription: string,
    passwordInscription: string
  ) => {
    if (emailInscription && passwordInscription && !token) {
      try {
        const user: CreateUser = {
          password: passwordInscription,
          login: loginInscription,
          email: emailInscription,
        };
        await userAPI.create(user);
      } catch (e) {
        console.error("error", e);
      }
    }
    closeModal();
    return (
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity="success">
          This is a success alert — check it out!
        </Alert>
      </Stack>
    );
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className={styles.connection}>
        <TextField
          id="email_input"
          label="votre email"
          variant="outlined"
          sx={{
            backgroundColor: "white",
          }}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          autoFocus
        />
        <TextField
          id="password_input"
          label="mot de passe"
          type="password"
          variant="outlined"
          sx={{
            backgroundColor: "white",
          }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className={styles.btnco}>
          <Button
            onClick={handleLogin}
            variant="contained"
            color="primary"
            size="medium"
          >
            Login
          </Button>
          <Button onClick={openModal} variant="contained" color="primary">
            inscription
          </Button>
        </div>
      </div>
      {modal === true && (
        <RegisterModal
          closeModal={closeModal}
          registerNewUser={registerNewUser}
        />
      )}
    </>
  );
};
export default SignIn;
