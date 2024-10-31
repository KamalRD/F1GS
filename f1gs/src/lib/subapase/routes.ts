import { BoardMemberValues } from "@/components/admin/EditBoardForm";
import { supabase } from "./supabase";
import { CreateBoardMemberValues } from "@/components/admin/CreateBoardMember";

// Board Members
// READ
export async function getBoardMembers() {
    const { data, error } = await supabase.from("board_members").select("first_name, last_name, position, image, id, linkedin");
    if (error) {
        throw new Error(`Failed to fetch all members info: ${error}`)
    }

    for await (const member of data) {
        const memberImageURL = await getImage("board_member_images", member.image);
        member.image = memberImageURL;
    }
    return data.map(member => {
        return ({
            name: `${member.first_name} ${member.last_name}`,
            ...member
        })
    });
}

// UPDATE
export async function updateMemberDetails(id: string, newFields: Partial<BoardMemberValues>, oldImageName: string) {
    if (newFields.image) {
        const deleteImageResponse = await deleteImage("board_member_images", oldImageName);
        if (deleteImageResponse.error) {
            throw {
                message: deleteImageResponse.error.message,
                function: "deleteOldImage"
            };
        }
        const createImageResponse = await uploadImage("board_member_images", newFields.image);
        if (createImageResponse.error && createImageResponse.error.name !== "Duplicate") {
            throw {
                message: createImageResponse.error.message,
                function: "uploadNewImage"
            };
        }
        newFields = { ...newFields, image: newFields.image.name };
    }
    const { data, error } = await supabase.from("board_members")
        .update(newFields)
        .eq("id", id).select();
    if (error) {
        throw {
            message: error.message,
            function: "updateMember"
        }
    }
    return data;
}

// CREATE 
export async function insertBoardMember(memberDetails: CreateBoardMemberValues) {
    try {
        const { data, } = await supabase.from("board_members").insert([{
            "first_name": memberDetails.first_name,
            "last_name": memberDetails.last_name,
            "position": memberDetails.position,
            "linkedin": memberDetails.linkedin,
            "image": memberDetails.image.name
        }]).select();

        await uploadImage("board_member_images", memberDetails.image);

        return data;
    } catch (e) {
        console.log(e);
        /** To Do
         * Handle Error
         */
    }
}

// DELETE
export async function deleteBoardMember(memberId: string, memberImage: string) {
    try {
        const { data } = await supabase
            .from("board_members")
            .delete()
            .eq('id', memberId)
            .select();
        await deleteImage("board_member_images", memberImage);
        return data;
    } catch (e) {
        /** To Do
         * Handle Error
         */
        console.log(e);
    }
}
// Events
// READ 
export async function getNonCompletedEvents() {
    const { data, error } = await supabase.from("events").select("title, status, description, location, start_time, end_time, image, rsvp");
    if (error) {
        throw new Error(`Failed to fetch all events info: ${error}`);
    }

    const mappedEvents = data.filter((event) => ["Upcoming", "In Progress"].includes(event.status)).map(event => {
        return {
            title: event.title,
            description: event.description,
            status: event.status,
            startTime: new Date(event.start_time),
            endTime: new Date(event.end_time),
            location: event.location,
            image: getImage("events_images", event.image),
            rsvp: event.rsvp
        }
    });

    return mappedEvents.sort((a, b) => {
        const statusOrder: Record<string, number> = {
            'In Progress': 1,
            'Upcoming': 2,
            'Completed': 3
        };

        // Sort by status first
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff; // If statuses differ, return the difference

        // If statuses are the same, sort by startTime
        return a.startTime.getTime() - b.startTime.getTime();
    });
}

export async function getAllEvents() {
    const { data, error } = await supabase.from("events").select("title, status, description, location, start_time, end_time, image, rsvp");
    if (error) {
        throw new Error(`Failed to fetch all events info: ${error}`);
    }

    return data.map(event => {
        return {
            title: event.title,
            description: event.description,
            status: event.status,
            startTime: new Date(event.start_time),
            endTime: new Date(event.end_time),
            location: event.location,
            image: getImage("events_images", event.image),
            rsvp: event.rsvp
        }
    });
}

// Storage Functions
// DELETE
async function deleteImage(bucket: string, imageToDelete: string) {
    const { data, error } = await supabase.storage.from(bucket).remove([imageToDelete]);
    return { data, error };
}

// CREATE
async function uploadImage(bucket: string, newImage: File) {
    if (getImage(bucket, newImage.name)) {
        await deleteImage(bucket, newImage.name);
    }
    const { data, error } = await supabase.storage.from(bucket).upload(newImage.name, newImage);
    return { data, error }
}

// READ
export function getImage(bucket: string, imageURL: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(imageURL);
    return data.publicUrl;
}

