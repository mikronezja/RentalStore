const express = require('express');
const router = express.Router();

const {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientRentalHistory
} = require('../controllers/clientsController');


router.route("/")
    .get(getAllClients)
    .post(createClient)

router.route("/:id")
    .get(getClientById)
    .put(updateClient)
    .delete(deleteClient);

router.route("/:id/rentals")
    .get(getClientRentalHistory);

router.route("/debtors").get(getDebtors);


module.exports = router;