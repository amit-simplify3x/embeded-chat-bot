import mongoose, { model, Schema } from "mongoose"


interface ISettings {
    ownerid: string,
    businessname: string,
    supportEmail: string,
    knowledgebase: string,

}


const settingsSchema = new Schema<ISettings>({
    ownerid: { type: String, required: true },
    businessname: { type: String, required: true },
    supportEmail: { type: String, required: true },
    knowledgebase: { type: String, required: true },
}, { timestamps: true })

const Settings = mongoose.models?.Settings || model("Settings", settingsSchema)

export default Settings

