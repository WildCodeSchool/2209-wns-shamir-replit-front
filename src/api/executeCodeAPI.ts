import { api } from "./_REST";

export type ExecutedCode = {
  type: "log" | "info" | "warn" | "error";
  message: string[];
};

type GetExecutedCode = {
  status: number;
  data: ExecutedCode[] | undefined;
};

export const executeCodeAPI = {
  sendCode: async (code: string): Promise<GetExecutedCode> => {
    try {
      const { status, data }: GetExecutedCode = await api.post(`/executeCode`, {
        code,
      });

      return { status, data };
    } catch (e) {
      console.error(e);
      return { status: 500, data: undefined };
    }
  },
};
