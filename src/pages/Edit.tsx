/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import Editor from "../components/Editor";
import Console from "../components/Console";
import { executeCodeAPI, ExecutedCode } from "../api/executeCodeAPI";
import styles from "./Edit.module.scss";
import ProjectContext from "../contexts/projectContext";
import { fileAPI } from "../api/fileAPI";
import { Socket } from "socket.io-client";
import { IFileData, IFileCodeData } from "../interfaces/iFile";
import { websocket } from "../api/websocket";
import { Coworker } from "../api/coworkerAPI";
import CommentSection from "../components/Comment";

const Edit = () => {
  const [consoleResult, setConsoleResult] = useState<
    ExecutedCode[] | undefined
  >(undefined);

  const [usedFile, setUsedFile] = useState<IFileCodeData>();
  const { project } = useContext(ProjectContext);
  const [editorCode, setEditorCode] = useState("");
  const [nbExecutions, setNbExecutions] = useState<number | undefined>(
    undefined
  );
  const [forceEditorUpdate, setForceEditorUpdate] = useState(0);
  const [coworkers, setCoworkers] = useState<Coworker[]>([]);
  const [restoreCursor, setRestoreCursor] = useState(false);
  const [lockCursor, setLockCursor] = useState(false);

  const websockets = useRef<Socket[]>([]);

  const websocketDisconnect = () => {
    websockets.current.map((socket) => {
      socket.close();
    });
  };

  const websocketConnect = async () => {
    websocketDisconnect();

    // websockets.current.push(
    //   await websocket.connect(project.id, setForceEditorUpdate, setCoworkers)
    // );
  };
  async function updateFileCodeOnline(
    codeToPush: string,
    fileId: number,
    projectId: number
  ): Promise<boolean> {
    if (!usedFile) {
      return false;
    }
    try {
      await fileAPI.updateFileOnline(codeToPush, fileId, projectId);
      return true;
    } catch (error) {
      console.error(
        `Failed to update file with id ${fileId} in project ${projectId}. Error message: ${error}`
      );
      return false;
    }
  }

  const updateCode = async (value: string) => {
    setEditorCode(value);
  };

  const sendMonaco = async (code: string) => {
    const projectId = project.id;

    if (projectId) {
      const { data, status } = await executeCodeAPI.sendCode(code, projectId);

      if (status === 200 && data) {
        setConsoleResult(data.result);
        setNbExecutions(data.nbExecutions);
      }
    }
  };

  const getFilesInformations = async () => {
    if (project.id !== undefined) {
      const req = await fileAPI.getAllFilesByProjectId(project.id);

      const newFileCodeData: IFileCodeData = {
        code: req.getCodeFiles[0].code,
        id: req.getFilesByProjectId[0].id,
        language: req.getCodeFiles[0].language,
        name: req.getCodeFiles[0].name,
        projectId: req.getCodeFiles[0].projectId,
      };

      setUsedFile(newFileCodeData);
      setEditorCode(newFileCodeData.code);
      setRestoreCursor(true);
      // setLockCursor(false);
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
    <>
      {usedFile ? (
        <div className={styles.containerView}>
          <div className={styles.container}>
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
            />
            <div className={styles.resizeBar}>
              <img src="/grab.svg" alt="resize" draggable={false} />
            </div>
            <Console
              consoleResult={consoleResult}
              nbExecutions={nbExecutions}
            />
          </div>
          <CommentSection fileID={usedFile.id} />
        </div>
      ) : (
        <p>Loading Editor...</p>
      )}
    </>
  );
};

export default Edit;
