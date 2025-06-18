const { Client, RentalHistory } = require('../models/index');

// Pobieranie wszystkich klientów
const getAllClients = async (req, res) => {
    const { limit = 10, page = 1, search } = req.query;
    const query = {};


    // Dodanie wyszukiwania po imieniu lub nazwisku
    if (search) {
        query.$or = [
            { name: { $regex: `^${search}\\s[a-zA-Z]*`, $options: 'i' } },
            { name: { $regex: `[a-zA-Z]*\\s${search}$`, $options: 'i' } }
        ];
    }

    try {
        const clients = await Client.find(query)
            .skip(page > 0 ? (page - 1) * limit : 0)
            .limit(parseInt(limit))
            .sort({ name: 1 });

        console.log(clients);

        const total = await Client.countDocuments(query);

        res.status(200).json({
            clients,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania klientów', error: error.message });
    }
};

// Pobieranie klienta po ID
const getClientById = async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({ message: 'Klient nie został znaleziony' });
        }
        console.log(client);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania klienta', error: error.message });
    }
};

// Tworzenie nowego klienta
const createClient = async (req, res) => {
    console.log("hello: ", req.body);
    const { name, email, phone, address, rank } = req.body;

    // Walidacja podstawowych pól
    if (!name || !phone || !email) {
        return res.status(400).json({ message: 'Imię, nazwisko, email i telefon są wymagane' });
    }

    try {
        // Sprawdzenie czy klient z tym adresem email już istnieje
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: 'Klient z tym adresem email już istnieje' });
        }

        const clientData = {
            name,
            email,
            phone,
        };

        if (address) clientData.address = address;
        if (rank) clientData.rank = rank;

        const newClient = new Client(clientData);

        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas tworzenia klienta', error: error.message });
    }
};

// Aktualizacja klienta
const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    try {
        // Sprawdzenie czy klient istnieje
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: 'Klient nie został znaleziony' });
        }

        // Sprawdzenie czy nowy email jest już używany przez innego klienta
        if (email && email !== client.email) {
            const existingClient = await Client.findOne({ email });
            if (existingClient) {
                return res.status(400).json({ message: 'Klient z tym adresem email już istnieje' });
            }
        }

        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { name, email, phone, address },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas aktualizacji klienta', error: error.message });
    }
};

// Usuwanie klienta
const deleteClient = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedClient = await Client.findByIdAndDelete(id);

        if (!deletedClient) {
            return res.status(404).json({ message: 'Klient nie został znaleziony' });
        }

        res.status(200).json({ message: 'Klient został pomyślnie usunięty', id });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas usuwania klienta', error: error.message });
    }
};

// Historia wypożyczeń klienta
const getClientRentalHistory = async (req, res) => {
    const { id } = req.params;

    try {
        // Sprawdzenie czy klient istnieje
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: 'Klient nie został znaleziony' });
        }

        const rentalHistory = await RentalHistory.find({ client: id })
            .populate('product')
            .populate('worker')
            .sort({ 'rentalPeriod.start': -1 });

        res.status(200).json(rentalHistory);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania historii wypożyczeń', error: error.message });
    }
};

// Pobieranie listy dłużników (klienci z przeterminowanymi wypożyczeniami)
const getDebtors = async (req, res) => {

    const { limit = 10, page = 1 } = req.query;
    const currentDate = new Date();

    console.log('getDebtors function called');
    console.log('req.params:', req.params);
    console.log('req.query:', req.query);
    console.log('req.query.limit:', req.query.limit);
    try {
        // Znajduje wszystkie przeterminowane wypożyczenia
        const overdueRentals = await RentalHistory.find({
            status: 'rented',
            'rentalPeriod.end': { $lt: currentDate }
        })
            .populate({
                path: 'client',
                select: 'firstName lastName email phone address'
            })
            .populate({
                path: 'product',
                select: 'title category type'
            })
            .skip(page > 0 ? (page - 1) * limit : 0)
            .limit(parseInt(limit))
            .sort({ 'rentalPeriod.end': 1 });

        // Grupowanie przeterminowanych wypożyczeń według klientów
        const debtorsMap = {};
        overdueRentals.forEach(rental => {
            const clientId = rental.client._id.toString();

            if (!debtorsMap[clientId]) {
                debtorsMap[clientId] = {
                    client: rental.client,
                    overdueItems: []
                };
            }

            debtorsMap[clientId].overdueItems.push({
                product: rental.product,
                rentalId: rental._id,
                dueDate: rental.rentalPeriod.end,
                daysOverdue: Math.floor((currentDate - rental.rentalPeriod.end) / (1000 * 60 * 60 * 24))
            });
        });

        // Konwersja mapy na tablicę
        const debtorsList = Object.values(debtorsMap);

        // Obliczenie całkowitej liczby dłużników
        const totalDebtors = await RentalHistory.aggregate([
            { $match: { status: 'rented', 'rentalPeriod.end': { $lt: currentDate } } },
            { $group: { _id: '$client' } },
            { $count: 'total' }
        ]);

        const total = totalDebtors.length > 0 ? totalDebtors[0].total : 0;

        res.status(200).json({
            debtors: debtorsList,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania listy dłużników', error: error.message });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientRentalHistory,
    getDebtors
};