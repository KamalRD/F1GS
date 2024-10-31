// React & Next
import { NextResponse } from "next/server";

// Types
import { FormValues } from "@/components/SignupForm";

// 3rd Party Librariess
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
    apiKey: process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY,
    server: process.env.NEXT_PUBLIC_MAILCHIMP_SERVER_PREFIX
});

export async function GET(request: Request) {
    return await handleGetRequests(request);
}

export async function POST(request: Request) {
    return await handlePostRequests(request);
}

// GET
async function handleGetRequests(request: Request) {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    switch (action) {
        case "getAllMembers":
            return await getAllEmailMembers();
        default:
            return NextResponse.json({ success: false, message: "Invalid query action" }, { status: 400 });
    }
}

async function getAllEmailMembers() {
    try {
        const response = await mailchimp.lists.getListMembersInfo("8ed7e238ac", {
            fields: ["members.full_name", "members.email_address", "members.tags"],
            count: 1000
        });
        return NextResponse.json({ success: true, data: response })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch email members",
        })
    }
};

// POST
async function handlePostRequests(request: Request) {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const body = await request.json();

    switch (action) {
        case "subscribeNewMember":
            return await subscribeNewMember(body.formValues);
        default:
            return NextResponse.json({ success: false, message: "Invalid query action" }, { status: 400 });
    }
}

async function subscribeNewMember(formData: FormValues) {
    const yearToTag: Partial<Record<"1L" | "2L" | "3L", string>> = {
        "1L": "Class of 2027",
        "2L": "Class of 2026",
        "3L": "Class of 2025",
    };

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
        const errorData = (e as any).response?.body?.title || (e as any).message || "An unknown error occurred";
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