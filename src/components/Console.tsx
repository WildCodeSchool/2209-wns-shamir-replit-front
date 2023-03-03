import React from "react";
import { ExecutedCode } from "../api/executeCodeAPI";
import ReactJson from "react-json-view";
import styles from "./Console.module.scss";

type ConsoleProps = {
  consoleResult: ExecutedCode[] | undefined;
  nbExecutions: number | undefined;
};

const Console = ({ consoleResult, nbExecutions }: ConsoleProps) => (
  <div
    className={[styles.container, styles.scroll, styles["scroll-2"]].join(" ")}
  >
    {consoleResult && (
      <>
        {nbExecutions !== undefined && (
          <>
            <p className={styles.info}>
              <span>{`>\u00a0`}</span>
              <span>
                code executions remaining in free plan : {50 - nbExecutions}
              </span>
            </p>
            <p className={styles.log}>
              <span>{`>\u00a0`}</span>
              <span>
                to unlock execution limit,{" "}
                <a href="/subscription">subscribe here</a> 🚀
              </span>
            </p>
          </>
        )}
        {consoleResult.map((line, lineIndex) => (
          <p className={styles[line.type]} key={lineIndex}>
            <span>{`>\u00a0`}</span>
            <span>
              <ReactJson
                src={line.message}
                theme="hopscotch"
                collapsed={1}
                displayDataTypes={false}
                name={false}
                style={{
                  backgroundColor: "black",
                  fontSize: "16px",
                }}
              />
            </span>
          </p>
        ))}
      </>
    )}
  </div>
);

export default Console;
