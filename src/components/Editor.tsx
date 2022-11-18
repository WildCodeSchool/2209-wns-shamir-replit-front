import { useEffect, useState, useRef } from "react";
import styles from "./Editor.module.scss";
import Editor, { useMonaco } from "@monaco-editor/react";

type EditeurProps = {
  sendMonaco: (code: string) => Promise<void>;
};

type Theme = "light" | "vs-dark";

const Editeur = ({ sendMonaco }: EditeurProps) => {
  const [theme, setTheme] = useState<Theme>("light");
  // const editor = document.getElementById("resize");
  // const [input, setInput] = useState<string>();
  const editorRef = useRef<any>(null);

  const monaco = useMonaco();
  function toggleTheme() {
    setTheme(theme === "light" ? "vs-dark" : "light");
  }

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const execute = () => {
    // console.log(editorRef.current.getValue());

    const code = editorRef.current.getValue();

    if (code) sendMonaco(code);
  };

  useEffect(() => {
    // do conditional chaining
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }, [monaco]);

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <button onClick={execute}>
          <img src="/start.svg" alt="execute code" draggable={false} />
        </button>
        <button onClick={toggleTheme}>
          {theme === "light" ? "light mode" : "dark mode"}
        </button>
      </div>

      <div className={styles.resizable} id="resize">
        <Editor
          height="50vh"
          defaultLanguage="javascript"
          theme={theme}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default Editeur;
