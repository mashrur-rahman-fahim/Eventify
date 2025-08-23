import Role from "../model/roles.model.js";

export const seedRoles = async (req, res) => {
    try {
        const roles = [
            {
                name: "Student",
                level: 0,
                
            },
            {
                name: "ClubAdmin",
                level: 1,
                permissions: {
                    canCreateEvents: true,
                    canEditEvents: true,
                    canDeleteEvents: true,
                    canManageAttendees: true,
                    canAddMembers: true,
                    canAddAdmins: true,
                }
            },
    
        ];
        const createdRoles = await Role.insertMany(roles);
        res.status(201).json(createdRoles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};