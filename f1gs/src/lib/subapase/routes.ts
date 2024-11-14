import { BoardMemberValues } from "@/components/admin/board/EditBoardForm";
import { CreateBoardMemberValues } from "@/components/admin/board/CreateBoardMember";
import { CreateEventValues } from "@/components/admin/events/CreateEvent";

import { supabase } from "./supabase";
import { BackEndEvent, FrontEndEvent } from "../types";

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
export async function getNonCompletedEvents(): Promise<FrontEndEvent[]> {
    const { data, error } = await supabase.from("events").select("title, status, description, location, start_time, end_time, image, rsvp");
    if (error) {
        throw new Error(`Failed to fetch all events info: ${error}`);
    }

    const mappedEvents = data.filter((event) => ["Upcoming", "In Progress"].includes(event.status)).map(event => {
        return {
            title: event.title,
            description: event.description,
            status: event.status,
            start_time: new Date(event.start_time),
            end_time: new Date(event.end_time),
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
        return a.start_time.getTime() - b.start_time.getTime();
    });
}

export async function getAllEvents() {
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
        throw new Error(`Failed to fetch all events info: ${error}`);
    }
    return data.map(event => {
        return {
            title: event.title,
            description: event.description,
            status: event.status,
            start_time: new Date(event.start_time),
            end_time: new Date(event.end_time),
            location: event.location,
            image: getImage("events_images", event.image),
            rsvp: event.rsvp,
            id: event.id,
        }
    });
}

// CREATE
export async function insertEvent(eventDetails: CreateEventValues) {
    try {
        const { data } = await supabase.from("events").insert([{
            ...eventDetails,
            image: eventDetails.image.name
        }]).select();
        await uploadImage("events_images", eventDetails.image);
        return data;
    } catch (e) {
        console.log(e);
    }

}

// UPDATE
export async function updateEvent(eventToUpdate: Partial<BackEndEvent>, id: string) {
    try {
        let updateData;
        if (eventToUpdate.start_time) {
            eventToUpdate.start_time = new Date(eventToUpdate.start_time);
        }

        if (eventToUpdate.end_time) {
            eventToUpdate.end_time = new Date(eventToUpdate.end_time);
        }

        if (eventToUpdate.image) {
            const { data } = await supabase.from("events").update({ ...eventToUpdate, image: (eventToUpdate.image as File).name }).eq("id", id).select("title, status, description, location, start_time, end_time, image, rsvp");
            await uploadImage("events_images", eventToUpdate.image as File);
            if (data) {
                const updatedEvent = data[0];
                updateData = {
                    title: updatedEvent.title,
                    description: updatedEvent.description,
                    status: updatedEvent.status,
                    start_time: new Date(updatedEvent.start_time),
                    end_time: new Date(updatedEvent.end_time),
                    image: getImage("events_images", updatedEvent.image),
                    location: updatedEvent.location,
                    rsvp: updatedEvent.rsvp
                }
            }
        } else {
            const { data } = await supabase.from("events").update({ ...eventToUpdate }).eq("id", id).select("title, status, description, location, start_time, end_time, image, rsvp");
            if (data) {
                const updatedEvent = data[0];
                updateData = {
                    title: updatedEvent.title,
                    description: updatedEvent.description,
                    status: updatedEvent.status,
                    start_time: new Date(updatedEvent.start_time),
                    end_time: new Date(updatedEvent.end_time),
                    image: getImage("events_images", updatedEvent.image),
                    location: updatedEvent.location,
                    rsvp: updatedEvent.rsvp
                }
            }
        }
        return updateData;
    } catch (e) {
        console.log(e);
    }
}

// DELETE
export async function deleteEvent(eventId: string, eventImage: string) {
    try {
        const { data } = await supabase
            .from("events")
            .delete()
            .eq('id', eventId)
            .select();
        await deleteImage("events_images", eventImage);
        if (data) {
            return data[0];
        }
    } catch (e) {
        /** To Do
         * Handle Error
         */
        console.log(e);
    }

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

