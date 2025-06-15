const express = require('express');
const router = express.Router();

const {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientRentalHistory,
    getDebtors
} = require('../controllers/clientsController');


router.route("/")
    .get(getAllClients)
    .post(createClient)

router.route("/debtors").get(getDebtors); // zmieniona kolejnosc zeby nie bylo bledow

router.route("/:id")
    .get(getClientById)
    .put(updateClient)
    .delete(deleteClient);

router.route("/:id/rentals")
    .get(getClientRentalHistory);




module.exports = router;