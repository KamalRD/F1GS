import { NextResponse } from "next/server";

import mailchimp from '@mailchimp/mailchimp_marketing';
import { FormValues } from "@/components/SignupForm";

mailchimp.setConfig({
    apiKey: process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY,
    server: process.env.NEXT_PUBLIC_MAILCHIMP_SERVER_PREFIX
});

const yearToTag: Partial<Record<"1L" | "2L" | "3L", string>> = {
    "1L": "Class of 2027",
    "2L": "Class of 2026",
    "3L": "Class of 2025",
};

export async function POST(requestDetails: Request) {
    const body = await requestDetails.json();
    const formData: FormValues = body.formValues;
    try {
        const mailchimpResponse = await mailchimp.lists.addListMember("8ed7e238ac", {
            email_address: formData.email,
            status: "subscribed",
            merge_fields: {
                FNAME: formData.firstName,
                LNAME: formData.lastName,
            },
            tags: [yearToTag[formData.year] ?? ""],
        });

        if ('id' in mailchimpResponse) {
            return NextResponse.json({
                success: true,
                message: formData.firstName,
            })
        }

        return NextResponse.json({
            success: false,
            data: mailchimpResponse,
        });
    } catch (e: unknown) {
        const errorData = e.response?.body?.title || e.message || "An unknown error occurred";
        if (errorData === "Member Exists") {
            return NextResponse.json({
                success: false,
                message: "It seems you're already subscribed to our mailing list!",
            })
        }
        return NextResponse.json({
            success: false,
            message: "There was an error adding you to our email list!"
        })
    }
}