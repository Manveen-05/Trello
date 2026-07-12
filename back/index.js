const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");
const { User, Organization, Board, Issue, Column } = require("./models");


const app = express();

app.use(express.json());

let USERS_ID = 1;
let BOARDS_ID = 1;
let ISSUES_ID = 1;
let ORGANIZATION_ID = 1;

const users = [{
    email: "[EMAIL_ADDRESS]",
    password: "password",
    id: 1,
    boards: []
}, {
    email: "[EMAIL_ADDRESS]",
    password: "password",
    id: 2,
    boards: []
},]

const organizations = [{
    id: 1,
    name: "Org 1",
    members: [1, 2],
    boards: []
}, {
    id: 2,
    name: "Org 2",
    members: [1, 2],
    boards: []
},]

const boards = [{
    id: 1,
    name: "Board 1",
    organizationId: 1,
    columns: []
}, {
    id: 2,
    name: "Board 2",
    organizationId: 1,
    columns: []
},]

const issues = [{
    id: 1,
    title: "Issue 1",
    description: "Issue 1 description",
    columnId: 1,
    state: "Pending",
}, {
    id: 2,
    title: "Issue 2",
    description: "Issue 2 description",
    columnId: 1,
    state: "In Progress",
},]

app.post("/signup", async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;

    //const userexists = users.find(user => user.username === username);
    const userexists = await User.findOne(
        { username: username, });
    if (userexists) {
        return res.status(400).json(
            { message: "User already exists" });
    }
    const newUser = await User.create({ username, password, id: USERS_ID++, boards: [] });
    res.status(201).json(
        { message: "User signed up successfully", id: newUser._id });
});

app.post("/signin", async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    const userexists = await User.findOne({ username: username, password: password });
    if (!userexists) {
        return res.status(401).json(
            { message: "Invalid credentials" });
    }
    const token = jwt.sign(
        { id: userexists._id },
        "secret",
        { expiresIn: "1h" }
    );
    res.status(200).json(
        { message: "User signed in successfully", token, id: userexists._id });
});


app.post("/organization", authMiddleware, async (req, res) => {
    const user = req.userId;
    try {
        const oranization = await Organization.create({
            title: req.body.title,
            description: req.body.description,
            members: [user],
            boards: [],
            admin: user
        })
        await User.findByIdAndUpdate(user, { $push: { organizations: { id: oranization._id, title: oranization.title } } });
        res.status(201).json({
            message: "Organization created successfully",
            organizationId: oranization._id,
            organizations: {
                title: oranization.title,
                description: oranization.description,
                members: oranization.members.map(m => ({
                    username: m.username,
                    id: m._id
                })),
                boards: oranization.boards.map(b => ({
                    title: b.name,
                    id: b._id
                })),
                admin: oranization.admin
            }
        });
    } catch (e) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});
app.post("/add-members-to-organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberEmail = req.body.organizationId;
    const memberUserUsername = req.body.memberUserUsername || req.body.memberUsername;
    const oranization = await Organization.findById(organizationId)

    // console.log("--- DEBUG ADD MEMBER ---");
    // console.log("Req Organization ID:", organizationId);
    // console.log("Found Organization:", oranization);
    // console.log("Organization Admin ID:", oranization?.admin?.toString());
    // console.log("Request User ID:", userId);
    // console.log("Does admin match user?", oranization?.admin?.toString() === userId);
    // console.log("-------------------------");

    if (!oranization || oranization.admin?.toString() !== userId) {
        return res.status(404).json({
            message: "Organization not found or you are not admin"
        })
    }

    const memberUser = await User.findOne({ username: memberUserUsername });

    if (!memberUser) {
        const allUsers = await User.find({}, "username");
        // console.log("--- DEBUG MEMBER NOT FOUND ---");
        // console.log(`Searched for: "${memberUserUsername}"`);
        // console.log("Available usernames in MongoDB:", allUsers.map(u => u.username));
        // console.log("-------------------------------");
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isAlreadyMember = oranization.members && oranization.members.some(memberId => memberId.toString() === memberUser._id.toString());
    if (isAlreadyMember) {
        return res.status(400).json({
            message: "User is already a member of this organization"
        });
    }

    await Organization.updateOne(
        { _id: organizationId },
        { $push: { members: memberUser._id } }
    );
    await User.updateOne(
        { _id: memberUser._id },
        { $push: { organizations: { id: organizationId, title: oranization.title } } }
    );
    const populatedOrg = await Organization.findById(organizationId)
        .populate("members", "username")
        .populate("boards", "name");

    res.status(200).json({
        message: "Member added successfully",
        organization: {
            title: populatedOrg.title,
            description: populatedOrg.description,
            members: populatedOrg.members.map(m => ({
                username: m.username,
                id: m._id
            })),
            boards: populatedOrg.boards.map(b => ({
                title: b.name,
                id: b._id
            })),
            admin: populatedOrg.admin
        }
    });
});
app.post("/members", authMiddleware, (req, res) => {
    const name = req.body.name;
    const organizationId = req.body.organizationId;
    const memberUserUsername = req.body.organizationId;


}
)
app.post("/boards", (req, res) => {

});

app.delete("/remove-members-from-organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const { memberId, memberUsername, memberUserUsername } = req.body;
    const targetUsername = memberUsername || memberUserUsername;

    try {
        const oranization = await Organization.findById(organizationId);

        if (!oranization || oranization.admin?.toString() !== userId) {
            return res.status(404).json({
                message: "Organization not found or you are not admin"
            });
        }

        let memberUser;
        if (targetUsername) {
            memberUser = await User.findOne({ username: targetUsername });
        } else if (memberId) {
            memberUser = await User.findById(memberId);
        }

        if (!memberUser) {
            const allUsers = await User.find({}, "_id username");
            //console.log("--- DEBUG REMOVE MEMBER NOT FOUND ---");
            // console.log(`Searched for memberId: "${memberId}", memberUsername: "${memberUsername}"`);
            // console.log("Available users in MongoDB:", allUsers.map(u => ({ id: u._id, username: u.username })));
            // console.log("--------------------------------------");
            return res.status(404).json({
                message: "User not found"
            });
        }

        await Organization.updateOne(
            { _id: organizationId },
            { $pull: { members: memberUser._id } }
        );
        await User.updateOne(
            { _id: memberUser._id },
            { $pull: { organizations: { id: organizationId } } }
        );

        res.status(200).json({
            message: "Member removed successfully"
        });
    } catch (e) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})



// GET Endpoints
app.get("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;

    try {
        const organization = await Organization.findById(organizationId).populate("members", "username");

        if (!organization || organization.admin?.toString() !== userId) {
            return res.status(404).json({
                message: "Organization not found or you are not admin"
            });
        }

        res.json({
            organization: {
                id: organization._id,
                title: organization.title,
                description: organization.description,
                members: organization.members.map(member => ({
                    id: member._id,
                    username: member.username
                }))
            }
        });
    } catch (e) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})



app.listen(3000, () => {
    console.log("Server started on port 3000");
});
