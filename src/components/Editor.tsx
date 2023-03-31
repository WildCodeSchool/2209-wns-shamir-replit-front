import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "./Editor.module.scss";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { updateRes } from "../api/fileAPI";
import { projectAPI } from "../api/projectAPI";
import ProjectContext from "../contexts/projectContext";
import { Coworker, coworkerAPI } from "../api/coworkerAPI";
import { Socket } from "socket.io-client";
import UserContext from "../contexts/userContext";

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
  coworkers: Coworker[];
  websockets: React.MutableRefObject<Socket[]>;
  restoreCursor: boolean;
  setRestoreCursor: React.Dispatch<React.SetStateAction<boolean>>;
};

type DownloadFile = {
  status: number;
  data: Blob;
};

type Theme = "light" | "vs-dark";

type CursorPosition = {
  lineNumber: number;
  column: number;
};

const Editeur = (props: EditeurProps) => {
  const [theme, setTheme] = useState<Theme>("light");
  const { project } = useContext(ProjectContext);
  const { user } = useContext(UserContext);
  const oldDecorations = useRef<string[]>([]);

  // State Booléen pour savoir si le document est sauvegarder en ligne
  const [isSaveOnline, setIsSaveOnline] = useState(true);

  // const editor = document.getElementById("resize");
  // const [input, setInput] = useState<string>();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const cursorPositionRef = useRef<CursorPosition>({
    lineNumber: 1,
    column: 1,
  });

  const updateCoworkers = () => {
    if (editorRef.current) {
      const decorations = props.coworkers
        .filter((cw) => cw.userId !== parseInt(user.id || "0"))
        .sort((cw1, cw2) => {
          if (cw1.name > cw2.name) return 1;
          if (cw1.name < cw2.name) return -1;
          return 0;
        })
        .map((cw, cwIndex) => {
          const classIndex = cwIndex % 6;
          const className = [
            styles.coWorkerCursor,
            styles["coWorkerCursor" + classIndex],
          ].join(" ");

          return {
            range: {
              startLineNumber: cw.startLineNumber,
              startColumn: cw.startColumn,
              endLineNumber: cw.endLineNumber + 0,
              endColumn: cw.endColumn + 1,
            },
            options: {
              className,
              hoverMessage: {
                value: cw.name,
              },
            },
          };
        });

      oldDecorations.current = editorRef.current.deltaDecorations(
        oldDecorations.current,
        decorations
      );
    }
  };

  const getMonacoText = () => {
    setIsSaveOnline(false);
    if (editorRef.current) {
      props.updateCode(editorRef.current.getValue());
    }
  };

  const setCursorPosition = () => {
    if (editorRef.current) {
      editorRef.current.setPosition(cursorPositionRef.current);
      props.setRestoreCursor(false);
    }
  };

  const sendCursorPosition = () => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();

      if (position) {
        cursorPositionRef.current.column = position.column;
        cursorPositionRef.current.lineNumber = position.lineNumber;

        const coworker: Coworker = {
          name: user.login || "",
          project_id: props.projectId,
          userId: parseInt(user.id || "0"),
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        };

        const socketIds: string[] = props.websockets.current.map(
          (socket) => socket.id
        );

        coworkerAPI.sendCoworker({
          socketIds,

          coworker,
        });
      }
    }
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
    updateCoworkers();
  }, [props.coworkers]);

  useEffect(() => {
    if (props.restoreCursor) {
      // retrieve previous cursorPosition
      setCursorPosition();
    }
  }, [props.restoreCursor]);

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
    }, 500);
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

      <div
        className={styles.resizable}
        id="resize"
        onKeyUp={sendCursorPosition}
        onClick={sendCursorPosition}
      >
        {props.fileId ? (
          <Editor
            height="50vh"
            defaultLanguage="javascript"
            theme={theme}
            onMount={handleEditorDidMount}
            onChange={getMonacoText}
            // defaultValue={props.editorCode}
            value={props.editorCode}
          />
        ) : (
          <p>Test</p>
        )}
      </div>
    </div>
  );
};

export default Editeur;
