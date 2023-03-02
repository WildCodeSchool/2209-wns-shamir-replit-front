import { api } from "./_REST";

type GetStripe = {
  status: number;
  data:
    | {
        success: boolean;
        message: string;
        date_start_subscription: string;
        date_end_subscription: string;
      }
    | undefined;
};

export const stripeAPI = {
  getStripe: async (amount: number, id: string): Promise<GetStripe> => {
    try {
      const { status, data }: GetStripe = await api().post(`/stripe`, {
        amount,
        id,
      });

      return { status, data };
    } catch (e) {
      console.error(e);
      return { status: 500, data: undefined };
    }
  },
};
