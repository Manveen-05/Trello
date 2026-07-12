const mongoose = require("mongoose");
//mongoose.connect("mongodb+srv://trello_user:[EMAIL_ADDRESS]/Trello")

//schema and models

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    organizations: [
        {
            _id: false,
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Organization"
            },
            title: String
        }
    ]
})

const OrganizationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    boards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board"
        }
    ]
})

const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    columns: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Column"
        }
    ]
})

const IssueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    columnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column"
    },
    state: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    }
})

const ColumnSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    },
    issues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue"
        }
    ]
})

const User = mongoose.model("User", UserSchema);
const Organization = mongoose.model("Organization", OrganizationSchema);
const Board = mongoose.model("Board", BoardSchema);
const Issue = mongoose.model("Issue", IssueSchema);
const Column = mongoose.model("Column", ColumnSchema);

module.exports = {
    User,
    Organization,
    Board,
    Issue,
    Column
}