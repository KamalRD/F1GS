import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { z } from "zod";

// Components
import Button from "./general/Button";
import { ClipLoader } from "react-spinners";
import { DayLawYear, NightLawYear } from "@/lib/types";

export default function SignupForm() {
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    studentType: "Day",
    year: "1L",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [selectedYear, setSelectedYear] = useState<DayLawYear | NightLawYear>(
    "1L"
  );
  const [selectedType, setSelectedType] = useState<"Day" | "Evening">("Day");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [subscriptionResponse, setSubscriptionResponse] = useState<{
    success: boolean;
    message: string;
  }>();

  useEffect(() => {
    if (selectedType === "Day") {
      setSelectedYear("1L");
      setFormValues((previousValues) => ({ ...previousValues, year: "1L" }));
    } else {
      setSelectedYear("1LE");
      setFormValues((previousValues) => ({ ...previousValues, year: "1LE" }));
    }
  }, [selectedType]);

  const yearsToDisplay =
    selectedType === "Day" ? ["1L", "2L", "3L"] : ["1LE", "2LE", "3LE", "4LE"];

  const handleYearSelect = (selectedYear: DayLawYear | NightLawYear) => {
    setSelectedYear(selectedYear);
    setFormValues({ ...formValues, year: selectedYear });
  };

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
        await fetch("/api/mailchimp?action=subscribeNewMember", {
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
      </fieldset>
      <fieldset className="col-span-2 grid grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-md font-semibold">Division</h2>
          <div className="flex flex-row justify-start gap-x-4 w-[45%]">
            {["Day", "Evening"].map((type) => (
              <span key={type} className="text-sm flex flex-col">
                <label
                  htmlFor={type}
                  className={`flex items-center flex-col cursor-pointer relative`}
                >
                  <input
                    type="radio"
                    checked={selectedType === type}
                    value={type}
                    id={type}
                    onChange={(e) => {
                      const selectedType = (e.target as HTMLInputElement)
                        .value as "Day" | "Evening";
                      setSelectedType(selectedType);
                      setFormValues({
                        ...formValues,
                        studentType: selectedType,
                      });
                    }}
                  />
                  {type}
                </label>
              </span>
            ))}
          </div>
          {errors.year && <span className="text-red-500">{errors.year}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-md font-semibold">Year</h2>
          <div className="flex flex-row justify-start gap-x-4 w-[45%]">
            {yearsToDisplay.map((year) => (
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
                    onChange={(e) =>
                      handleYearSelect(
                        (e.target as HTMLInputElement).value as
                          | DayLawYear
                          | NightLawYear
                      )
                    }
                  />
                  {year}
                </label>
              </span>
            ))}
          </div>
          {errors.year && <span className="text-red-500">{errors.year}</span>}
        </div>
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
const DayLawYearEnum = z.enum(["1L", "2L", "3L"]);
const NightLawYearEnum = z.enum(["1LE", "2LE", "3LE", "4LE"]);

const formSchema = z
  .object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" })
      .endsWith("@fordham.edu", { message: "Use your '@fordham.edu' email" }),

    // Field to distinguish between Day and Night students
    studentType: z.enum(["Day", "Evening"], {
      required_error: "You must select a student type",
    }),

    // Conditional year field based on the student type
    year: z.union([DayLawYearEnum, NightLawYearEnum], {
      required_error: "You must select a year",
    }),
  })
  .refine(
    (data) => {
      // Validation logic to ensure that the selected year matches the student type
      if (
        data.studentType === "Day" &&
        !["1L", "2L", "3L"].includes(data.year)
      ) {
        return false;
      }
      if (
        data.studentType === "Evening" &&
        !["1LE", "2LE", "3LE", "4LE"].includes(data.year)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Selected year does not match the student type",
      path: ["year"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;
