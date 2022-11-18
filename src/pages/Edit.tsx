import { useState } from "react";
import Editor from "../components/Editor";
import Console from "../components/Console";
import { executeCodeAPI, ExecutedCode } from "../api/executeCodeAPI";
import styles from "./Edit.module.scss";

const Edit = () => {
  const [consoleResult, setConsoleResult] = useState<
    ExecutedCode[] | undefined
  >(undefined);

  const sendMonaco = async (code: string) => {
    const { data, status } = await executeCodeAPI.sendCode(code);

    if (status === 200 && data) {
      setConsoleResult(data);
    }
  };

  return (
    <div className={styles.container}>
      <Editor sendMonaco={sendMonaco} />
      <div className={styles.resizeBar}>
        <img src="/grab.svg" alt="resize" draggable={false} />
      </div>
      <Console consoleResult={consoleResult} />
    </div>
  );
};

export default Edit;
