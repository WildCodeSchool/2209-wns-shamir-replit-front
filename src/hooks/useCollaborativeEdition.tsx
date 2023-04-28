import React, { useContext, useRef } from "react";
import { Coworker, coworkerAPI } from "../api/coworkerAPI";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import UserContext from "../contexts/userContext";
import styles from "../components/Editor.module.scss";
import { Socket } from "socket.io-client";

type CursorPosition = {
  lineNumber: number;
  column: number;
};

type UseCollaborativeEditionProps = {
  coworkers: Coworker[];
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  setRestoreCursor: React.Dispatch<React.SetStateAction<boolean>>;
  lockCursor: boolean;
  setLockCursor: React.Dispatch<React.SetStateAction<boolean>>;
  isTyping: React.MutableRefObject<boolean>;
  editorCode: string;
  websockets: React.MutableRefObject<Socket[]>;
  projectId: number;
};

const useCollaborativeEdition = ({
  coworkers,
  editorRef,
  setRestoreCursor,
  lockCursor,
  setLockCursor,
  isTyping,
  editorCode,
  websockets,
  projectId,
}: UseCollaborativeEditionProps) => {
  const { user } = useContext(UserContext);

  const oldDecorations = useRef<string[]>([]);
  const cursorPositionRef = useRef<CursorPosition>({
    lineNumber: 1,
    column: 1,
  });

  const updateCoworkers = () => {
    if (editorRef.current) {
      const uniqueCoworkers = [...coworkers.map((cw) => cw.userId)];

      const decorations = uniqueCoworkers
        .map((ucwId) => coworkers.filter((cw) => cw.userId === ucwId)[0])
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

  const setCursorPosition = () => {
    if (editorRef.current && !isTyping.current) {
      editorRef.current.setPosition(cursorPositionRef.current);
      setRestoreCursor(false);
      setLockCursor(false);
      updateCoworkers();
    }
  };

  const sendCursorPosition = () => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();

      if (position) {
        // save cursor position
        if (!lockCursor) {
          const lines = editorCode.split("\n");

          const nbLines = lines.length;
          const lastLineLength = lines[lines.length - 1].length;

          if (
            nbLines !== position.lineNumber &&
            lastLineLength !== position.column
          ) {
            cursorPositionRef.current.column = position.column;
            cursorPositionRef.current.lineNumber = position.lineNumber;
          }
        }

        const coworker: Coworker = {
          name: user.login || "",
          project_id: projectId,
          userId: parseInt(user.id || "0"),
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        };

        const socketIds: string[] = websockets.current.map(
          (socket) => socket.id
        );

        coworkerAPI.sendCoworker({
          socketIds,
          coworker,
        });
      }
    }
  };

  return {
    setCursorPosition,
    sendCursorPosition,
    updateCoworkers,
  };
};

export default useCollaborativeEdition;
