import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/userContext";
import styles from "./Subscription.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripeAPI } from "../api/stripeAPI";
import { StripeCardElementOptions } from "@stripe/stripe-js";

type Plan = "free" | "pro" | undefined;
type Renewal = "monthly" | "yearly" | undefined;

const CARD_OPTIONS: StripeCardElementOptions = {
  iconStyle: "solid",
  style: {
    base: {
      backgroundColor: "white",
      padding: "20px",
      iconColor: "#c4f0ff",
      color: "#000",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

const Subscription = () => {
  const { user, setUser } = useContext(UserContext);
  const [isSubscribedBase, setIsSubscribedBase] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(undefined);
  const [selectedRenewal, setSelectedRenewal] = useState<Renewal>(undefined);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const checkUserSubscribed = () => {
    const todayTime = new Date().getTime();

    const { date_start_subscription, date_end_subscription } = user;

    let newIsSubscribedBase = false;

    if (
      date_start_subscription &&
      date_end_subscription &&
      date_end_subscription.getTime() > todayTime &&
      date_start_subscription.getTime() < todayTime
    )
      newIsSubscribedBase = true;

    setIsSubscribedBase(newIsSubscribedBase);
  };

  const getBorderClass = (plan: Plan) => {
    if (
      plan === "free" &&
      (selectedPlan === "free" || (!selectedPlan && !isSubscribedBase))
    )
      return styles.selected;

    if (
      plan === "pro" &&
      (selectedPlan === "pro" || (!selectedPlan && isSubscribedBase))
    )
      return styles.selected;

    return null;
  };

  const switchSelected = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleRenewalChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    event.preventDefault();

    if (value === "monthly" || value === "yearly") setSelectedRenewal(value);
  };

  const showSubscriptionDiv = () => !isSubscribedBase && selectedPlan === "pro";

  const handleCheckout = async () => {
    if (elements === null || stripe === null) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card) {
      const paymentMethodResult = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (paymentMethodResult) {
        const { error, paymentMethod } = paymentMethodResult;
        if (!error) {
          try {
            const { id } = paymentMethod;
            const { data } = await stripeAPI.getStripe(
              selectedRenewal === "monthly" ? 5 : 48,
              id
            );

            if (data?.success) {
              setPaymentSuccess(true);

              const { date_start_subscription, date_end_subscription } = data;

              setUser({
                ...user,
                date_start_subscription: new Date(date_start_subscription),
                date_end_subscription: new Date(date_end_subscription),
              });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            console.error(err);
          }
        } else {
          console.error("error", error.message);
        }
      }
    }
  };

  useEffect(() => {
    checkUserSubscribed();
  }, [user]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  return (
    <div>
      <h2>manage your subscription plan</h2>
      <p>current plan : {isSubscribedBase ? "Pro Plan" : "Free Plan"}</p>

      <div className={styles.plansContainer}>
        <div
          className={getBorderClass("free")}
          onClick={() => switchSelected("free")}
        >
          <h3>free plan</h3>
          <h4>0€ / month</h4>
          <div className={styles.descriptionContainer}>
            <p>- 50 execution / day</p>
            <p>- Z80 CPU 8MHz</p>
            <p>- 1ko RAM</p>
          </div>
        </div>
        <div
          className={getBorderClass("pro")}
          onClick={() => switchSelected("pro")}
        >
          <h3>pro plan</h3>
          <h4>5€ / month</h4>
          <div className={styles.descriptionContainer}>
            <p>- unlimited executions</p>
            <p>- AMD Ryzen Threadripper 3990X 64C 128T</p>
            <p>- 128Go RAM</p>
          </div>
        </div>
      </div>
      {showSubscriptionDiv() && (
        <div className={styles.checkoutButtonContainer}>
          <div>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Subscription renewal
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                value={selectedRenewal}
                onChange={handleRenewalChange}
              >
                <FormControlLabel
                  value="monthly"
                  control={<Radio />}
                  label="Subscribe for 1 month : 5€"
                />
                <FormControlLabel
                  value="yearly"
                  control={<Radio />}
                  label="Subscribe for a year : 48€ (-20%)"
                />
              </RadioGroup>
            </FormControl>
          </div>
          {!paymentSuccess ? (
            <div className={styles.stripeContainer}>
              <CardElement options={CARD_OPTIONS} />
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                disabled={!selectedRenewal}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          ) : (
            <>
              <div>
                <h2>payment OK</h2>
              </div>
            </>
          )}
          {/* <PaymentElement /> */}
        </div>
      )}
    </div>
  );
};

export default Subscription;
