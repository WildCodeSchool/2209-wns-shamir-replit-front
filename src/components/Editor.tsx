import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "./Editor.module.scss";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { updateRes } from "../api/fileAPI";
import { projectAPI } from "../api/projectAPI";
import ProjectContext from "../contexts/projectContext";

type EditeurProps = {
  sendMonaco: (code: string) => Promise<void>;
  updateCode: (value: string) => void;
  editorCode: string;
  updateFileCodeOnline: (
    codeToPush: string,
    fileId: number,
    projectId: number
  ) => Promise<false | updateRes | undefined>;
  fileId: number;
  projectId: number;
};

type DownloadFile = {
  status: number;
  data: Blob;
};

type Theme = "light" | "vs-dark";

const Editeur = (props: EditeurProps) => {
  const [theme, setTheme] = useState<Theme>("light");
  const { project } = useContext(ProjectContext);

  // State Booléen pour savoir si le document est sauvegarder en ligne
  const [isSaveOnline, setIsSaveOnline] = useState(true);

  // const editor = document.getElementById("resize");
  // const [input, setInput] = useState<string>();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const getMonacoText = () => {
    setIsSaveOnline(false);
    if (editorRef.current) props.updateCode(editorRef.current.getValue());
  };

  const monacoHook = useMonaco();
  function toggleTheme() {
    setTheme(theme === "light" ? "vs-dark" : "light");
  }

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    _monaco: Monaco
  ) {
    editorRef.current = editor;
  }

  const execute = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();

      if (code) props.sendMonaco(code);
    }
  };

  const sanitizeFileName = (fileName: string) =>
    fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  const downloadProject = async () => {
    if (project.name === undefined) return;
    const res = (await projectAPI.downloadProject(
      props.projectId
    )) as DownloadFile;
    console.log(res);
    const href = URL.createObjectURL(res.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;

    link.setAttribute("download", `${sanitizeFileName(project.name)}.zip`); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  useEffect(() => {
    // do conditional chaining
    monacoHook?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    const willUpdate = setTimeout(async () => {
      const res = await props.updateFileCodeOnline(
        props.editorCode,
        props.fileId,
        props.projectId
      );
      if (res !== false && res !== undefined) setIsSaveOnline(true);
    }, 2000);
    return () => clearTimeout(willUpdate);
  }, [monacoHook, props.editorCode]);

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <button onClick={execute}>
          <img src="/start.svg" alt="execute code" draggable={false} />
        </button>
        <p>{isSaveOnline ? "Sauvegarde réussie" : "Non sauvegardé"}</p>
        <div className={styles.rightPanel}>
          <img
            src="/download.png"
            alt="project doawnload"
            className={styles.imgBtn}
            onClick={downloadProject}
          />
          <button onClick={toggleTheme} className={styles.themeBtn}>
            {theme === "light" ? "light mode" : "dark mode"}
          </button>
        </div>
      </div>

      <div className={styles.resizable} id="resize">
        {props.fileId ? (
          <Editor
            height="50vh"
            defaultLanguage="javascript"
            theme={theme}
            onMount={handleEditorDidMount}
            onChange={getMonacoText}
            defaultValue={props.editorCode}
          />
        ) : (
          <p>Test</p>
        )}
      </div>
    </div>
  );
};

export default Editeur;
