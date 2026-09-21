import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Apple, Check, ChevronRight, Loader2, Lock, RefreshCcw, ScanFace, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAY_METHODS, PLAN_PRICE, TRIAL_PRICE, money } from "@/lib/data";
import { cn } from "@/lib/utils";

const MERCHANT = "DramaBreak Studios";
const AUTOPAY_NOTE = `After your trial you'll be charged ${money(PLAN_PRICE)} every quarter. We'll notify you before each charge, and you can cancel any time.`;
const PROCESSING_TEXT = { card: "Processing payment…", applepay: "Confirming with Face ID…", gpay: "Confirming payment…" };

/* ---------- card helpers ---------- */
const luhn = (d) => {
  let sum = 0;
  [...d].reverse().forEach((ch, i) => {
    let n = +ch;
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  });
  return sum % 10 === 0;
};
const brandOf = (d) => {
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  return null;
};
const formatNumber = (raw) => {
  const d = raw.replace(/\D/g, "");
  if (/^3[47]/.test(d)) return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  return (d.slice(0, 16).match(/.{1,4}/g) || []).join(" ");
};
const formatExpiry = (raw) => {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function validate(v) {
  const e = {};
  const digits = v.number.replace(/\D/g, "");
  const brand = brandOf(digits);
  if (v.name.trim().length < 2) e.name = "Enter the name on your card.";
  if (!digits) e.number = "Enter your card number.";
  else if (digits.length < 13 || !luhn(digits)) e.number = "That card number doesn't look right. Check it and try again.";
  if (!v.exp) e.exp = "Enter the expiry date.";
  else if (!/^\d{2}\/\d{2}$/.test(v.exp)) e.exp = "Use the format MM/YY.";
  else {
    const [mm, yy] = v.exp.split("/").map(Number);
    if (mm < 1 || mm > 12) e.exp = "Enter a month between 01 and 12.";
    else if (new Date(2000 + yy, mm, 1) <= new Date()) e.exp = "This card has expired.";
  }
  const need = brand === "Amex" ? 4 : 3;
  if (!/^\d+$/.test(v.cvc) || v.cvc.length !== need) e.cvc = `Enter the ${need}-digit security code.`;
  return e;
}

function Field({ id, label, error, valid, children, className }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <div className="relative">
        {children}
        {valid && !error && <Check className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" strokeWidth={3} />}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-start gap-1.5 text-[13px] text-red-600">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

/* ---------- card checkout form ---------- */
function CardForm({ v, setV, onPay }) {
  const [touched, setTouched] = useState({});
  const refs = useRef({});
  const errors = validate(v);
  const digits = v.number.replace(/\D/g, "");
  const brand = brandOf(digits);

  const set = (k) => (e) => {
    let val = e.target.value;
    if (k === "number") val = formatNumber(val);
    if (k === "exp") val = formatExpiry(val);
    if (k === "cvc") val = val.replace(/\D/g, "").slice(0, 4);
    setV((s) => ({ ...s, [k]: val }));
  };
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const show = (k) => touched[k] && errors[k];
  const ok = (k) => touched[k] && !errors[k];

  const submit = (ev) => {
    ev.preventDefault();
    setTouched({ name: true, number: true, exp: true, cvc: true });
    const first = ["name", "number", "exp", "cvc"].find((k) => errors[k]);
    if (first) return refs.current[first]?.focus();
    if (digits === "4000000000000002") return onPay(false, "Your card was declined. Try a different card or payment method.");
    onPay(true);
  };

  const inputProps = (k) => ({
    id: `cc-${k}`,
    ref: (el) => (refs.current[k] = el),
    value: v[k],
    onChange: set(k),
    onBlur: blur(k),
    "aria-invalid": !!show(k),
    "aria-describedby": show(k) ? `cc-${k}-err` : undefined,
    className: "h-12 bg-white text-base",
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-2 scrollbar-none">
      <Field id="cc-name" label="Name on card" error={show("name")} valid={ok("name")}>
        <Input {...inputProps("name")} autoComplete="cc-name" placeholder="Full name" />
      </Field>
      <Field id="cc-number" label="Card number" error={show("number")} valid={ok("number")}>
        <Input {...inputProps("number")} inputMode="numeric" autoComplete="cc-number" placeholder="1234 1234 1234 1234" className="h-12 bg-white pr-24 text-base" />
        {brand && !ok("number") && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">{brand}</span>}
        {brand && ok("number") && <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">{brand}</span>}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id="cc-exp" label="Expiry" error={show("exp")} valid={ok("exp")}>
          <Input {...inputProps("exp")} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" />
        </Field>
        <Field id="cc-cvc" label="Security code" error={show("cvc")} valid={ok("cvc")}>
          <Input {...inputProps("cvc")} inputMode="numeric" autoComplete="cc-csc" placeholder={brand === "Amex" ? "4 digits" : "3 digits"} />
        </Field>
      </div>

      <p className="rounded-xl bg-zinc-50 p-3.5 text-[13px] leading-relaxed text-zinc-600">{AUTOPAY_NOTE}</p>
      <p className="text-center text-xs leading-relaxed text-zinc-400">
        Demo: 4242 4242 4242 4242 with any future date and code succeeds.<br />4000 0000 0000 0002 simulates a declined card.
      </p>

      <Button type="submit" className="mt-auto h-14 rounded-full bg-zinc-900 text-base font-semibold text-white hover:bg-zinc-800">
        <Lock className="h-4 w-4" /> Pay {money(TRIAL_PRICE, true)}
      </Button>
    </form>
  );
}

/* ---------- shared status views ---------- */
function StatusView({ step, method, txn, failMsg, onReturn, onRetry, onCancel }) {
  if (step === "processing")
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10" role="status">
        {method === "applepay" ? <ScanFace className="h-14 w-14 animate-pulse text-zinc-900" strokeWidth={1.4} /> : <Loader2 className="h-12 w-12 animate-spin text-zinc-800" />}
        <p className="text-lg font-medium">{PROCESSING_TEXT[method]}</p>
        <p className="text-sm text-zinc-500">Please don't close the app</p>
      </div>
    );
  if (step === "success")
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-8 text-center" role="status">
        <span className="flex h-24 w-24 animate-pop items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,.5)]">
          <Check className="h-12 w-12 text-white" strokeWidth={3.5} />
        </span>
        <h2 className="mt-3 text-2xl font-semibold">Payment successful</h2>
        <p className="text-zinc-600">{money(TRIAL_PRICE, true)} paid to {MERCHANT}</p>
        <p className="text-xs text-zinc-400">Transaction ID {txn}</p>
        <p className="mt-5 text-sm text-zinc-500">Taking you back to DramaBreak…</p>
        <Button variant="outline" onClick={onReturn} className="rounded-full border-zinc-300 bg-white px-6 text-zinc-900 hover:bg-zinc-50">Return now</Button>
      </div>
    );
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-8 text-center" role="alert">
      <span className="flex h-24 w-24 animate-pop items-center justify-center rounded-full bg-red-500">
        <X className="h-12 w-12 text-white" strokeWidth={3.5} />
      </span>
      <h2 className="mt-3 text-2xl font-semibold">Payment failed</h2>
      <p className="max-w-[280px] text-zinc-600">{failMsg} You haven't been charged.</p>
      <div className="mt-6 flex w-full flex-col gap-3">
        <Button onClick={onRetry} className="h-12 rounded-full bg-zinc-900 font-semibold text-white hover:bg-zinc-800"><RefreshCcw className="h-4 w-4" /> Try again</Button>
        <Button variant="outline" onClick={onCancel} className="h-12 rounded-full border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50">Back to DramaBreak</Button>
      </div>
    </div>
  );
}

/* ---------- Apple Pay & Google Pay sheets ---------- */
function ApplePaySheet({ onPay, onCancel }) {
  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-4">
      <div className="relative flex items-center justify-center">
        <button onClick={onCancel} className="absolute left-0 text-[17px] text-[#0a84ff] focus-visible:outline-none focus-visible:underline">Cancel</button>
        <span className="flex items-center gap-1 text-[19px] font-semibold"><Apple className="h-5 w-5" fill="currentColor" strokeWidth={0} /> Pay</span>
      </div>
      <dl className="divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-white text-[15px]">
        <div className="flex items-center gap-3 p-3.5">
          <span className="h-8 w-12 rounded-md bg-gradient-to-br from-indigo-600 to-sky-500 shadow-inner" aria-hidden />
          <div className="flex-1"><dt className="text-xs text-zinc-500">Card</dt><dd className="font-medium">Visa •••• 4242</dd></div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="flex items-center justify-between p-3.5"><dt className="text-zinc-500">Merchant</dt><dd className="font-medium">{MERCHANT}</dd></div>
        <div className="flex items-center justify-between p-3.5"><dt className="text-zinc-500">Trial plan</dt><dd className="text-lg font-semibold">{money(TRIAL_PRICE, true)}</dd></div>
      </dl>
      <p className="px-1 text-xs leading-relaxed text-zinc-500">{AUTOPAY_NOTE}</p>
      <button
        onClick={() => onPay(true)}
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-black text-[17px] font-semibold text-white transition-transform hover:bg-zinc-800 active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2"
      >
        <ScanFace className="h-6 w-6" /> Pay with Face ID
      </button>
    </div>
  );
}

function GooglePaySheet({ onPay, onCancel }) {
  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xl font-medium text-zinc-700">
          <span
            className="text-2xl font-bold"
            style={{ background: "conic-gradient(from -45deg, #ea4335 110deg, #4285f4 110deg 200deg, #34a853 200deg 290deg, #fbbc05 290deg)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
          >G</span>
          Pay
        </span>
        <button onClick={onCancel} aria-label="Cancel payment" className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]"><X className="h-5 w-5" /></button>
      </div>
      <div>
        <p className="text-sm text-zinc-500">{MERCHANT} · Trial plan</p>
        <p className="mt-1 text-5xl font-semibold tracking-tight">{money(TRIAL_PRICE, true)}</p>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3.5 text-[15px]">
        <span className="h-8 w-12 rounded-md bg-gradient-to-br from-zinc-800 to-zinc-600" aria-hidden />
        <div className="flex-1"><p className="text-xs text-zinc-500">Payment method</p><p className="font-medium">Mastercard •••• 8210</p></div>
        <ChevronRight className="h-4 w-4 text-zinc-400" />
      </div>
      <p className="text-xs leading-relaxed text-zinc-500">{AUTOPAY_NOTE}</p>
      <button
        onClick={() => onPay(true)}
        className="h-14 rounded-full bg-[#1a73e8] text-base font-semibold text-white transition-all hover:bg-[#1765cc] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2"
      >
        Pay {money(TRIAL_PRICE, true)}
      </button>
    </div>
  );
}

/**
 * Stand-in for the checkout the user is handed off to. Always light-themed like a real third-party page.
 * Card: validated form (4242… succeeds, 4000 0000 0000 0002 is declined). Apple Pay / Google Pay: confirmation sheets.
 */
export function PaymentApp({ method, onCancel, onSuccess }) {
  const m = PAY_METHODS.find((x) => x.id === method);
  const [step, setStep] = useState("confirm"); // confirm | processing | success | failed
  const [failMsg, setFailMsg] = useState("");
  const [card, setCard] = useState({ name: "", number: "", exp: "", cvc: "" }); // kept here so a decline doesn't wipe the form
  const result = useRef({ ok: true, msg: "" });
  const txn = useRef(`${method === "card" ? "ch" : method === "applepay" ? "ap" : "gp"}_${Date.now().toString(36)}`);

  const pay = useCallback((ok = true, msg = "") => {
    result.current = { ok, msg };
    setStep("processing");
  }, []);

  useEffect(() => {
    if (step === "processing") {
      const t = setTimeout(() => {
        if (result.current.ok) setStep("success");
        else { setFailMsg(result.current.msg); setStep("failed"); }
      }, method === "applepay" ? 1500 : 1800);
      return () => clearTimeout(t);
    }
    if (step === "success") {
      const t = setTimeout(onSuccess, 2600);
      return () => clearTimeout(t);
    }
  }, [step, method, onSuccess]);

  const status = (
    <StatusView step={step} method={method} txn={txn.current} failMsg={failMsg} onReturn={onSuccess} onRetry={() => setStep("confirm")} onCancel={onCancel} />
  );
  const busy = step !== "confirm";

  /* Apple Pay / Google Pay: dimmed backdrop + bottom sheet */
  if (method !== "card") {
    return (
      <div className="force-light absolute inset-0 flex animate-in flex-col justify-end fade-in bg-zinc-950 duration-300" role="dialog" aria-label={`${m.name} checkout`}>
        <div className="absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_30%,rgba(233,30,140,.28),transparent)]" aria-hidden />
        <div
          className={cn(
            "relative flex animate-in flex-col rounded-t-[28px] text-zinc-900 shadow-2xl duration-300 slide-in-from-bottom-10",
            method === "applepay" ? "bg-[#f2f2f7]" : "bg-white",
            busy && "min-h-[52%]"
          )}
        >
          {step === "confirm" && method === "applepay" && <ApplePaySheet onPay={pay} onCancel={onCancel} />}
          {step === "confirm" && method === "gpay" && <GooglePaySheet onPay={pay} onCancel={onCancel} />}
          {busy && status}
        </div>
      </div>
    );
  }

  /* Card: full checkout page */
  return (
    <div className="force-light absolute inset-0 flex animate-in flex-col bg-white text-zinc-900 duration-300 fade-in slide-in-from-right-8" role="dialog" aria-label="Card checkout">
      <header className="flex items-center gap-2 border-b border-zinc-200 px-3 py-3">
        {step === "confirm" ? (
          <button onClick={onCancel} aria-label="Cancel payment" className="rounded-full p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"><X className="h-5 w-5" /></button>
        ) : <span className="w-9" />}
        <span className="flex-1 text-center text-base font-semibold">Checkout</span>
        <span className="flex w-9 justify-center text-emerald-600" title="Secure"><ShieldCheck className="h-5 w-5" /></span>
      </header>

      {step === "confirm" ? (
        <>
          <div className="px-5 pb-3 pt-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-sm font-bold text-white">DB</span>
              <div className="flex-1"><p className="font-semibold">{MERCHANT}</p><p className="text-sm text-zinc-500">Trial plan · all premium content</p></div>
              <div className="text-right"><p className="text-2xl font-semibold tracking-tight">{money(TRIAL_PRICE, true)}</p><p className="text-xs text-zinc-500">due today</p></div>
            </div>
          </div>
          <CardForm v={card} setV={setCard} onPay={pay} />
        </>
      ) : status}
    </div>
  );
}
