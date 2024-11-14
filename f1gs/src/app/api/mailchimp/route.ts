// React & Next
import { NextResponse } from "next/server";

// Types
import { FormValues } from "@/components/SignupForm";

// 3rd Party Librariess
import mailchimp from '@mailchimp/mailchimp_marketing';
import { DayLawYear, NightLawYear } from "@/lib/types";

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
    const graduationYear = `Class of ${calculateGraduationYear(formData.year)}`;

    try {
        const mailchimpResponse = await mailchimp.lists.addListMember("8ed7e238ac", {
            email_address: formData.email,
            status: "subscribed",
            merge_fields: {
                FNAME: formData.firstName,
                LNAME: formData.lastName,
            },
            tags: [graduationYear],
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

export function calculateGraduationYear(lawYear: DayLawYear | NightLawYear): number {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-based month

    const isDayLawYear = (year: DayLawYear | NightLawYear): year is DayLawYear => {
        return year === '1L' || year === '2L' || year === '3L';
    };

    if (isDayLawYear(lawYear)) {
        switch (lawYear) {
            case '1L':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 3
                    : currentYear + 2;
            case '2L':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 2
                    : currentYear + 1;
            case '3L':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 1
                    : currentYear;
            default:
                throw new Error('Invalid Law Year');
        }
    } else {
        switch (lawYear) {
            case '1LE':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 4
                    : currentYear + 3;
            case '2LE':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 3
                    : currentYear + 2;
            case '3LE':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 2
                    : currentYear + 1;
            case '4LE':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 1
                    : currentYear;
            default:
                throw new Error('Invalid Law Year');
        }
    }
}