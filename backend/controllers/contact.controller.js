const Contact = require('../models/contact.model.js');

const createContact = async (req, res) => {
    try {
        const {name, email, message} = req.body;
        const contact = await Contact.create({name, email, message});
        res.status(201).json(contact);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    
}
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
    if(!contacts) return res.status(404).json({message: "No contacts found"});
        res.status(200).json(contacts);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}
const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findByIdAndDelete(contactId);
        if (!contact) {
            return res.status(400).json({
                success: false,
                message: "Contact not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
            contact
        })
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}   
module.exports = { createContact, getContacts, deleteContact };
