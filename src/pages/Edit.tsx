import React, { useContext, useEffect, useRef, useState } from "react";
import Editor from "../components/Editor";
import Console from "../components/Console";
import { executeCodeAPI, ExecutedCode } from "../api/executeCodeAPI";
import styles from "./Edit.module.scss";
import ProjectContext from "../contexts/projectContext";
import { fileAPI } from "../api/fileAPI";
import { Socket } from "socket.io-client";
import { IFiles, FilesCodeData } from "../interfaces/iFile";
import { websocket } from "../api/websocket";
import { Coworker } from "../api/coworkerAPI";
import UserContext from "../contexts/userContext";

const Edit = () => {
  const [consoleResult, setConsoleResult] = useState<
    ExecutedCode[] | undefined
  >(undefined);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [projectFiles, setProjectFiles] = useState<IFiles[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filesCodeArr, setFilesCodeArr] = useState<FilesCodeData[]>();
  const [usedFile, setUsedFile] = useState<FilesCodeData>();
  const { project } = useContext(ProjectContext);
  const [editorCode, setEditorCode] = useState("");
  const previousEditorCode = useRef<string>("");
  const [nbExecutions, setNbExecutions] = useState<number | undefined>(
    undefined
  );
  const [forceEditorUpdate, setForceEditorUpdate] = useState(0);
  const [coworkers, setCoworkers] = useState<Coworker[]>([]);
  const [restoreCursor, setRestoreCursor] = useState(false);
  const [lockCursor, setLockCursor] = useState(false);
  const { user } = useContext(UserContext);

  const websockets = useRef<Socket[]>([]);

  const websocketDisconnect = () => {
    websockets.current.map((socket) => {
      socket.close();
    });
  };

  const websocketConnect = async () => {
    websocketDisconnect();

    const userEmail = user.email;

    if (userEmail)
      websockets.current.push(
        await websocket.connect(
          { project_id: parseInt(project.id || "0"), userEmail },
          setForceEditorUpdate,
          setCoworkers
        )
      );
  };

  const compareCodeLines = (oldCode: string, newCode: string) => {
    const splittedOldCode = oldCode.split("\n");
    const splittedNewCode = newCode.split("\n");

    return splittedOldCode
      .map((oldLine, lineIndex) =>
        oldLine !== splittedNewCode[lineIndex] ? lineIndex : undefined
      )
      .filter((lineIndex) => lineIndex !== undefined) as number[];
  };

  const updateFileCodeOnline = async (
    codeToPush: string,
    fileId: number,
    projectId: number
  ) => {
    if (usedFile) {
      try {
        const socketIds = websockets.current.map((ws) => ws.id);

        const updatedLines = compareCodeLines(
          previousEditorCode.current,
          codeToPush
        );

        const updateRes = await fileAPI.updateFileOnline(
          codeToPush,
          fileId,
          projectId,
          socketIds,
          updatedLines
        );
        previousEditorCode.current = codeToPush;
        return updateRes;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const updateCode = async (value: string) => {
    setEditorCode(value);
  };

  const sendMonaco = async (code: string) => {
    const projectId = project.id;

    if (projectId) {
      const { data, status } = await executeCodeAPI.sendCode(
        code,
        parseInt(projectId, 10)
      );

      if (status === 200 && data) {
        setConsoleResult(data.result);
        setNbExecutions(data.nbExecutions);
      }
    }
  };

  const getFilesInformations = async () => {
    const projectId = project.id;
    if (projectId !== undefined) {
      const req = await fileAPI.getAllFilesByProjectId(projectId);

      const newCode = req.getCodeFiles[0].code;

      if (previousEditorCode.current !== newCode) {
        setProjectFiles(req.getFilesByProjectId);
        setFilesCodeArr(req.getCodeFiles);
        setUsedFile(req.getCodeFiles[0]);
        setEditorCode(newCode);
        previousEditorCode.current = newCode;
        setRestoreCursor(true);
        // setLockCursor(false);
      }
    }
  };

  useEffect(() => {
    setLockCursor(true);
    getFilesInformations();
  }, [forceEditorUpdate]);

  useEffect(() => {
    setLockCursor(false);
  }, [editorCode]);

  useEffect(() => {
    getFilesInformations();
    websocketConnect();
    return () => websocketDisconnect();
  }, [project]);

  return (
    <div className={styles.container}>
      {usedFile ? (
        <Editor
          sendMonaco={sendMonaco}
          coworkers={coworkers}
          editorCode={editorCode}
          updateCode={updateCode}
          updateFileCodeOnline={updateFileCodeOnline}
          fileId={usedFile.id}
          projectId={usedFile?.projectId}
          websockets={websockets}
          restoreCursor={restoreCursor}
          setRestoreCursor={setRestoreCursor}
          lockCursor={lockCursor}
          setLockCursor={setLockCursor}
          forceEditorUpdate={forceEditorUpdate}
        />
      ) : (
        <p>Loading Editor...</p>
      )}
      <div className={styles.resizeBar}>
        <img src="/grab.svg" alt="resize" draggable={false} />
      </div>
      <Console consoleResult={consoleResult} nbExecutions={nbExecutions} />
    </div>
  );
};

export default Edit;
