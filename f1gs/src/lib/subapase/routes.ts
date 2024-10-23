import { BoardMemberValues } from "@/components/admin/EditBoardForm";
import { supabase } from "./supabase";

export async function getBoardMembers() {
    const { data, error } = await supabase.from("board_members").select("first_name, last_name, position, image, id, linkedin");
    if (error) {
        throw new Error(`Failed to fetch all members info: ${error}`)
    }

    for await (const member of data) {
        const memberImageURL = await getImage(member.image);
        member.image = memberImageURL.publicUrl;
    }
    return data.map(member => {
        return ({
            name: `${member.first_name} ${member.last_name}`,
            ...member
        })
    });
}


export async function updateMemberDetails(id: string, newFields: Partial<BoardMemberValues>, oldImageName: string) {
    if (newFields.image) {
        const deleteImageResponse = await deleteImage(oldImageName);
        if (deleteImageResponse.error) {
            throw {
                message: deleteImageResponse.error.message,
                function: "deleteOldImage"
            };
        }
        const createImageResponse = await uploadImage(newFields.image);
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

// Storage Functions
// DELETE
async function deleteImage(imageToDelete: string) {
    const { data, error } = await supabase.storage.from('board_member_images').remove([imageToDelete]);
    return { data, error };
}

// CREATE
async function uploadImage(newImage: File) {
    if (getImage(newImage.name)) {
        await deleteImage(newImage.name);
    }
    const { data, error } = await supabase.storage.from('board_member_images').upload(newImage.name, newImage);
    return { data, error }
}

// READ
export function getImage(imageURL: string) {
    const { data } = supabase.storage.from("board_member_images").getPublicUrl(imageURL);
    return data;
}