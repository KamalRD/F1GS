import React, { ChangeEvent, FormEvent, useState } from "react";
import { z } from "zod";

// Components
import Button from "./general/Button";
import { ClipLoader } from "react-spinners";

export default function SignupForm() {
  const [selectedYear, setSelectedYear] = useState<string>("1L");
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    year: "1L",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [subscriptionResponse, setSubscriptionResponse] = useState<{
    success: boolean;
    message: string;
  }>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof FormValues];
      return newErrors;
    });
    setFormValues({ ...formValues, [name]: value });
  };

  const attemptSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    try {
      formSchema.parse(formValues);
      setIsLoading(true);

      const addMemberResponse = await (
        await fetch("/api/mailchimp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formValues }),
        })
      ).json();

      setIsLoading(false);
      setSubscriptionResponse(addMemberResponse);
      setIsCompleted(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: Partial<Record<keyof FormValues, string>> = {};
        err.errors.forEach((error) => {
          validationErrors[error.path[0] as keyof FormValues] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center py-8">
      <ClipLoader
        color="brand_black"
        speedMultiplier={1}
        size={80}
        className="mx-auto"
      />
    </div>
  ) : isCompleted && subscriptionResponse ? (
    <div className="flex flex-col gap-0 justify-start items-center h-32 mx-auto">
      {subscriptionResponse.success ? (
        <>
          <h1 className="text-2xl">Success!</h1>
          <p>{`${subscriptionResponse.message}, thanks for subscribing!`}</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-red-500 pb-4">Whoops!</h1>
          <p>{subscriptionResponse.message}</p>
        </>
      )}
    </div>
  ) : (
    <form
      className="flex flex-col md:grid md:grid-cols-2 gap-4 w-[90%] mx-auto"
      onSubmit={attemptSubmit}
    >
      <fieldset className="flex flex-col gap-2">
        <h2 className="text-md font-semibold">Name</h2>
        <label className="flex flex-col w-[90%]">
          <input
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
              errors.firstName ? "border-red-500" : ""
            }`}
          />
          <span className="text-xs text-red-500">{errors.firstName}</span>
          <span className="text-sm">First Name</span>
        </label>
        <label className="flex flex-col w-[90%]">
          <input
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
              errors.lastName ? "border-red-500" : ""
            }`}
          />
          <span className="text-xs text-red-500">{errors.lastName}</span>
          <span className="text-sm">Last Name</span>
        </label>
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <h2 className="text-md font-semibold">Contact Information</h2>
        <label className="row-start-2 col-span-1 flex flex-col w-[90%]">
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className={`border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-1 text-sm ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          <span className="text-xs text-red-500">{errors.email}</span>
          <span className="text-sm">Email</span>
        </label>
        <>
          <h2 className="row-start-1 col-span-2 text-md font-semibold">
            Your Year
          </h2>
          <div className="flex flex-row justify-start gap-x-4 w-[60%]">
            {["1L", "2L", "3L"].map((year) => (
              <span key={year} className="text-sm flex flex-col">
                <label
                  htmlFor={year}
                  className={`flex items-center flex-col cursor-pointer relative`}
                >
                  <input
                    type="radio"
                    checked={selectedYear === year}
                    value={year}
                    id={year}
                    onClick={(e) => {
                      const selectedYear = (e.target as HTMLInputElement)
                        .value as "1L" | "2L" | "3L";
                      setSelectedYear(selectedYear);
                      setFormValues({ ...formValues, year: selectedYear });
                    }}
                  />
                  {year}
                </label>
              </span>
            ))}
          </div>
          {errors.year && <span className="text-red-500">{errors.year}</span>}
        </>
      </fieldset>
      <div className="mx-auto col-span-2">
        <Button
          type="submit"
          size="xsmall"
          color="primary"
          hoverColor="secondary"
        >
          Join!
        </Button>
      </div>
    </form>
  );
}

// Zod Schema
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .endsWith("@fordham.edu", { message: "Use your '@fordham.edu' email" }),
  year: z.enum(["1L", "2L", "3L"], {
    required_error: "You must select a year",
  }),
});

export type FormValues = z.infer<typeof formSchema>;
