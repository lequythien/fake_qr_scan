const Client = require('../models/Client');

const createClient = (req, res) => {
    const { callbackUrl } = req.body;

    if (!callbackUrl) {
        return res.status(400).json({
            message: "Invalid callback URL"
        });
    }

    Client.findOne({ callbackUrl })
        .then(existingClient => {
            if (existingClient) {
                return res.status(400).json({
                    message: "Client with this callback URL already exists"
                });
            }

            const newClient = new Client({ callbackUrl });
            return newClient.save()
                .then(savedClient => {
                    res.status(201).json({
                        message: "Successfully created client",
                        client: {
                            id: savedClient._id,
                            callbackUrl: savedClient.callbackUrl
                        }
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error creating client",
                error: err.message
            });
        });
};

module.exports = {
    createClient
};
